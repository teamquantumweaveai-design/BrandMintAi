<?php
declare(strict_types=1);
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }

function voice_config(): array
{
    $path = getenv('BRANDMINT_VOICE_CONFIG') ?: dirname(__DIR__, 3) . '/voice-config.php';
    $config = is_readable($path) ? require $path : [];
    return is_array($config) ? $config : [];
}
function voice_json(int $status, array $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store'); header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); exit;
}
function voice_origin(): void
{
    $parts = parse_url($_SERVER['HTTP_ORIGIN'] ?? '');
    $host = is_array($parts) ? strtolower($parts['host'] ?? '') . (isset($parts['port']) ? ':' . $parts['port'] : '') : '';
    if ($host === '' || $host !== strtolower($_SERVER['HTTP_HOST'] ?? '')
        || !in_array($parts['scheme'] ?? '', ['https', 'http'], true)
        || ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') voice_json(403, ['success' => false, 'message' => 'Request not allowed.']);
}
function voice_secret(array $config): string
{
    $secret = (string) (getenv('OPENAI_API_KEY') ?: ($config['api_key'] ?? ''));
    if ($secret === '') voice_json(503, ['success' => false, 'message' => 'Voice is not configured.']);
    return hash('sha256', 'brandmint-session:' . $secret);
}
function voice_storage(array $config): string
{
    $dir = (string) ($config['storage_dir'] ?? (sys_get_temp_dir() . '/brandmint-voice-' . substr(hash('sha256', __DIR__), 0, 16)));
    $docroot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: '';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) voice_json(503, ['success' => false, 'message' => 'Voice storage is unavailable.']);
    $resolved = realpath($dir);
    if (!$resolved || ($docroot !== '' && (strcasecmp($resolved, $docroot) === 0 || stripos($resolved, $docroot . DIRECTORY_SEPARATOR) === 0))) {
        voice_json(503, ['success' => false, 'message' => 'Voice private storage needs configuration.']);
    }
    @chmod($dir, 0700);
    return $dir;
}
function voice_metric(array $config, string $name, ?int $latency = null): void
{
    // Anonymous aggregate counts only: never names, emails, questions or transcripts.
    $file = @fopen(voice_storage($config) . '/metrics.json', 'c+');
    if (!$file || !flock($file, LOCK_EX)) { if ($file) fclose($file); return; }
    @chmod(voice_storage($config) . '/metrics.json', 0600);
    $data = json_decode(stream_get_contents($file) ?: '{}', true) ?: [];
    $cutoff = gmdate('Y-m-d', time() - 90 * 86400);
    foreach (array_keys($data) as $day) if ($day < $cutoff) unset($data[$day]);
    $day = gmdate('Y-m-d');
    $data[$day][$name] = (int) ($data[$day][$name] ?? 0) + 1;
    if ($latency !== null) {
        $data[$day]['connection_ms_total'] = (int) ($data[$day]['connection_ms_total'] ?? 0) + max(0, min(120000, $latency));
        $data[$day]['connection_ms_samples'] = (int) ($data[$day]['connection_ms_samples'] ?? 0) + 1;
    }
    rewind($file); ftruncate($file, 0); fwrite($file, json_encode($data)); fflush($file);
    flock($file, LOCK_UN); fclose($file);
}
function voice_new_session(array $config): string
{
    $id = bin2hex(random_bytes(24)); $expires = time() + 900;
    $directory = voice_storage($config);
    // Bounded cleanup of expired booking drafts; files live for at most 15 minutes plus cleanup delay.
    $scanned = 0;
    foreach (new DirectoryIterator($directory) as $entry) {
        if (++$scanned > 2000) break;
        if ($entry->isFile() && preg_match('/^session-[a-f0-9]{48}\.json$/', $entry->getFilename()) && $entry->getMTime() < time() - 900) {
            $old = @fopen($entry->getPathname(), 'r+');
            if ($old && flock($old, LOCK_EX | LOCK_NB)) { @unlink($entry->getPathname()); flock($old, LOCK_UN); }
            if ($old) fclose($old);
        }
    }
    $path = $directory . '/session-' . $id . '.json';
    if (file_put_contents($path, json_encode(['expires' => $expires, 'requests' => 0]), LOCK_EX) === false) {
        voice_json(503, ['success' => false, 'message' => 'Voice session storage is unavailable.']);
    }
    @chmod($path, 0600);
    $value = $id . '.' . $expires;
    return $value . '.' . hash_hmac('sha256', $value, voice_secret($config));
}
function voice_locked_session(array $config): array
{
    $token = $_SERVER['HTTP_X_VOICE_TOKEN'] ?? '';
    if (!preg_match('/^([a-f0-9]{48})\.(\d+)\.([a-f0-9]{64})$/', $token, $parts)
        || (int) $parts[2] < time() || (int) $parts[2] > time() + 901
        || !hash_equals(hash_hmac('sha256', $parts[1] . '.' . $parts[2], voice_secret($config)), $parts[3])) {
        voice_json(401, ['success' => false, 'message' => 'Start a new voice conversation to continue.']);
    }
    $file = @fopen(voice_storage($config) . '/session-' . $parts[1] . '.json', 'r+');
    if (!$file || !flock($file, LOCK_EX)) voice_json(401, ['success' => false, 'message' => 'Voice session expired.']);
    $state = json_decode(stream_get_contents($file) ?: '{}', true);
    if (!is_array($state) || ($state['expires'] ?? 0) < time()) { fclose($file); voice_json(401, ['success' => false, 'message' => 'Voice session expired.']); }
    $state['requests'] = ($state['requests'] ?? 0) + 1;
    if ($state['requests'] > 100) { fclose($file); voice_json(429, ['success' => false, 'message' => 'Conversation action limit reached.']); }
    return [$file, $state];
}
function voice_save_session($file, array $state): void
{
    $json = json_encode($state);
    rewind($file); $ok = ftruncate($file, 0) && fwrite($file, $json) === strlen($json) && fflush($file);
    if (!$ok) { fclose($file); voice_json(503, ['success' => false, 'message' => 'Unable to save voice action state.']); }
}
function voice_finish($file, array $state, int $status, array $data): void
{
    voice_save_session($file, $state); flock($file, LOCK_UN); fclose($file); voice_json($status, $data);
}
function voice_calendly(array $config, string $method, string $path, ?array $body = null): array
{
    $token = trim((string) ($config['calendly_token'] ?? ''));
    if ($token === '' || preg_match('/[\r\n]/', $token)) return ['status' => 503, 'data' => []];
    $request = curl_init('https://api.calendly.com' . $path);
    $options = [CURLOPT_CUSTOMREQUEST => $method, CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json']];
    if ($body !== null) $options[CURLOPT_POSTFIELDS] = json_encode($body);
    curl_setopt_array($request, $options); $raw = curl_exec($request); $status = (int) curl_getinfo($request, CURLINFO_HTTP_CODE); curl_close($request);
    return ['status' => $status, 'data' => is_string($raw) ? (json_decode($raw, true) ?: []) : []];
}
function voice_capabilities(array $config): array
{
    $calendar = !empty($config['calendly_token']) && (!empty($config['calendly_event_type'])
        || preg_match('~^https://api\.calendly\.com/users/[a-f0-9-]{36}$~i', (string) ($config['calendly_user_uri'] ?? '')) === 1);
    return ['voice_booking' => ($config['calendly_booking_enabled'] ?? true) === true && $calendar,
        'calendar_availability' => $calendar,
        'email_sending' => ($config['email_sending_enabled'] ?? true) === true && function_exists('mail'),
        'handoff' => filter_var($config['handoff_email'] ?? '', FILTER_VALIDATE_EMAIL) !== false];
}

function voice_calendar_event_type(array $config): string
{
    // An explicit event always takes precedence and is validated by the booking handler.
    if (!empty($config['calendly_event_type'])) return (string) $config['calendly_event_type'];
    $user = (string) ($config['calendly_user_uri'] ?? '');
    if (!preg_match('~^https://api\.calendly\.com/users/[a-f0-9-]{36}$~i', $user)) return '';
    $page = null;
    for ($attempt = 0; $attempt < 5; $attempt++) {
        $query = ['user' => $user, 'active' => 'true', 'count' => 100];
        if ($page !== null) $query['page_token'] = $page;
        $response = voice_calendly($config, 'GET', '/event_types?' . http_build_query($query));
        if ($response['status'] !== 200) return '';
        foreach ($response['data']['collection'] ?? [] as $event) {
            if (!empty($event['active']) && (int) ($event['duration'] ?? 0) === 30
                && rtrim((string) ($event['scheduling_url'] ?? ''), '/') === 'https://calendly.com/team-brandmint/30min'
                && preg_match('~^https://api\.calendly\.com/event_types/[a-zA-Z0-9-]+$~', (string) ($event['uri'] ?? ''))) {
                return $event['uri'];
            }
        }
        $page = $response['data']['pagination']['next_page_token'] ?? null;
        if (!is_string($page) || $page === '') break;
    }
    return '';
}
