<?php
declare(strict_types=1);
// Included by the voice endpoints only. Credentials and OAuth grants stay outside public_html.
function voice_google_grant(array $config): array
{
    if (empty($config['google_client_id']) || empty($config['google_client_secret'])
        || ($config['google_owner_email'] ?? '') !== 'team.brandmint@gmail.com'
        || ($config['google_calendar_id'] ?? '') !== 'team.brandmint@gmail.com') return [];
    $path = voice_storage($config) . '/google-calendar-grant.json';
    $grant = is_file($path) ? json_decode((string) file_get_contents($path), true) : [];
    return is_array($grant) && !empty($grant['refresh_token'])
        && ($grant['owner_email'] ?? '') === $config['google_owner_email']
        && ($grant['calendar_id'] ?? '') === $config['google_calendar_id'] ? $grant : [];
}
function voice_google_enabled(array $config): bool
{
    return ($config['google_booking_enabled'] ?? false) === true
        && ($config['google_shared_calendar_confirmed'] ?? false) === true
        && (($config['google_create_meet'] ?? false) === true || !empty($config['google_meeting_location']))
        && (bool) voice_google_grant($config);
}
function voice_google_http(string $url, string $method, ?array $body = null, string $access = '', bool $form = false): array
{
    // URLs are constructed by this integration, never supplied by a visitor.
    $request = curl_init($url);
    $headers = ['Content-Type: ' . ($form ? 'application/x-www-form-urlencoded' : 'application/json')];
    if ($access !== '') $headers[] = 'Authorization: Bearer ' . $access;
    $options = [CURLOPT_CUSTOMREQUEST => $method, CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 20, CURLOPT_HTTPHEADER => $headers];
    if ($body !== null) $options[CURLOPT_POSTFIELDS] = $form ? http_build_query($body) : json_encode($body);
    curl_setopt_array($request, $options); $raw = curl_exec($request);
    $status = (int) curl_getinfo($request, CURLINFO_HTTP_CODE); curl_close($request);
    return ['status' => $status, 'data' => is_string($raw) ? (json_decode($raw, true) ?: []) : []];
}
function voice_google_token(array $config): string
{
    static $tokens = [];
    $grant = voice_google_grant($config);
    if (!$grant) return '';
    $key = hash('sha256', $config['google_client_id'] . $grant['refresh_token']);
    if (isset($tokens[$key])) return $tokens[$key];
    $result = voice_google_http('https://oauth2.googleapis.com/token', 'POST', [
        'client_id' => $config['google_client_id'], 'client_secret' => $config['google_client_secret'],
        'refresh_token' => $grant['refresh_token'], 'grant_type' => 'refresh_token',
    ], '', true);
    return $tokens[$key] = $result['status'] === 200 ? (string) ($result['data']['access_token'] ?? '') : '';
}
function voice_google_busy(array $config, int $start, int $end): ?array
{
    $access = voice_google_token($config);
    if ($access === '') return null;
    $result = voice_google_http('https://www.googleapis.com/calendar/v3/freeBusy', 'POST', [
        'timeMin' => gmdate('c', $start), 'timeMax' => gmdate('c', $end),
        'items' => [['id' => $config['google_calendar_id']]],
    ], $access);
    $calendar = $result['data']['calendars'][$config['google_calendar_id']] ?? null;
    if ($result['status'] !== 200 || !is_array($calendar) || !empty($calendar['errors']) || !isset($calendar['busy']) || !is_array($calendar['busy'])) return null;
    $busy = [];
    foreach ($calendar['busy'] as $item) {
        $from = strtotime($item['start'] ?? ''); $to = strtotime($item['end'] ?? '');
        if (!$from || !$to || $to <= $from) return null;
        $busy[] = [$from, $to];
    }
    return $busy;
}
function voice_google_free(array $busy, int $start): bool
{
    foreach ($busy as [$from, $to]) if ($from < $start + 1800 && $to > $start) return false;
    return true;
}
function voice_google_reserved(array $config, int $start): ?bool
{
    $path = voice_storage($config) . '/google-booking-ledger.json';
    $ledger = is_file($path) ? json_decode((string) file_get_contents($path), true) : [];
    if (!is_array($ledger)) return null;
    return isset($ledger[hash('sha256', $config['google_calendar_id'] . ':' . $start)]);
}
function voice_google_mark_slot(array $config, int $start, string $id, ?string $outcome): bool
{
    // Caller holds the shared consultation-write lock.
    $path = voice_storage($config) . '/google-booking-ledger.json';
    $ledger = is_file($path) ? json_decode((string) file_get_contents($path), true) : [];
    if (!is_array($ledger)) return false;
    $key = hash('sha256', $config['google_calendar_id'] . ':' . $start);
    if (isset($ledger[$key]) && ($ledger[$key]['event_id'] ?? '') !== $id) return false;
    if ($outcome === null) unset($ledger[$key]);
    else $ledger[$key] = ['event_id' => $id, 'start' => $start, 'day' => gmdate('Y-m-d'), 'outcome' => $outcome];
    return voice_google_write_private($path, $ledger);
}
function voice_booking_provider(array $config, array $args, array $state, string $action): string
{
    // A prepared review pins its provider; config changes cannot redirect an approved booking.
    if ($action === 'confirm_consultation') return (string) ($state['booking_draft']['provider'] ?? 'calendly');
    $requested = $args['provider'] ?? ($action === 'prepare_consultation' ? ($state['slot_provider'] ?? 'auto') : ($config['voice_booking_provider'] ?? 'auto'));
    if (!in_array($requested, ['auto', 'google', 'calendly'], true)) return 'invalid';
    if ($requested !== 'auto') return $requested;
    $caps = voice_capabilities($config);
    return $caps['calendly_booking'] ? 'calendly' : ($caps['google_booking'] ? 'google' : 'calendly');
}
function voice_booking_lock(array $config)
{
    // Both providers use this lock; one website worker may commit a consultation at a time.
    $lock = @fopen(voice_storage($config) . '/consultation-write.lock', 'c+');
    if (!$lock || !flock($lock, LOCK_EX)) return false;
    @chmod(voice_storage($config) . '/consultation-write.lock', 0600);
    return $lock;
}
function voice_google_booking(array $config, $file, array $state, string $action, array $args): void
{
    if (!voice_google_enabled($config)) voice_finish($file, $state, 503, ['success' => false, 'fallback' => 'calendar', 'message' => 'Google Calendar booking is not connected. Use the existing Calendly form.']);
    // Reuse BrandMint's actual Calendly working hours, notice period and event rules.
    $eventType = voice_calendar_event_type($config);
    if (!preg_match('~^https://api\.calendly\.com/event_types/[a-zA-Z0-9-]+$~', $eventType)) voice_finish($file, $state, 503, ['success' => false, 'message' => 'The consultation schedule needs configuration.']);
    $type = voice_calendly($config, 'GET', substr($eventType, strlen('https://api.calendly.com')));
    $resource = $type['data']['resource'] ?? [];
    if ($type['status'] !== 200 || empty($resource['active']) || (int) ($resource['duration'] ?? 0) !== 30
        || rtrim($resource['scheduling_url'] ?? '', '/') !== 'https://calendly.com/team-brandmint/30min') voice_finish($file, $state, 503, ['success' => false, 'message' => 'The BrandMint consultation schedule could not be verified.']);
    // Never bypass payment or required questions by switching providers.
    if (!empty($resource['is_paid']) || !empty($resource['payment'])) voice_finish($file, $state, 409, ['success' => false, 'fallback' => 'calendar', 'message' => 'This consultation needs payment. Complete the secure Calendly form.']);
    foreach ($resource['custom_questions'] ?? [] as $question) if (!empty($question['enabled']) && !empty($question['required'])) voice_finish($file, $state, 409, ['success' => false, 'fallback' => 'calendar', 'message' => 'The consultation has required questions. Complete the existing Calendly form.']);
    if ($action === 'get_consultation_slots') {
        $timezone = (string) ($args['timezone'] ?? 'Asia/Kolkata');
        if (!in_array($timezone, timezone_identifiers_list(DateTimeZone::ALL_WITH_BC), true)) voice_finish($file, $state, 400, ['success' => false, 'message' => 'Use a valid IANA timezone.']);
        $day = isset($args['date']) ? DateTimeImmutable::createFromFormat('!Y-m-d', (string) $args['date'], new DateTimeZone($timezone)) : false;
        if (isset($args['date']) && (!$day || $day->format('Y-m-d') !== $args['date'])) voice_finish($file, $state, 400, ['success' => false, 'message' => 'Use a valid YYYY-MM-DD date.']);
        $start = max(time() + 60, $day ? $day->getTimestamp() : time() + 60);
        $end = $day ? $day->modify('+1 day')->getTimestamp() : $start + 7 * 86400 - 60;
        if ($start > time() + 90 * 86400 || $end <= $start) voice_finish($file, $state, 400, ['success' => false, 'message' => 'Choose a future date within 90 days.']);
        $available = voice_calendly($config, 'GET', '/event_type_available_times?' . http_build_query(['event_type' => $eventType,
            'start_time' => gmdate('c', $start), 'end_time' => gmdate('c', $end)]));
        $busy = voice_google_busy($config, $start, $end);
        if ($available['status'] !== 200 || $busy === null) voice_finish($file, $state, 502, ['success' => false, 'message' => 'Could not verify both calendars. Do not offer or book an unverified time.']);
        $slots = [];
        foreach ($available['data']['collection'] ?? [] as $slot) {
            $time = strtotime($slot['start_time'] ?? '');
            if (($slot['status'] ?? '') === 'available' && $time >= $start && $time + 1800 <= $end && voice_google_free($busy, $time)
                && voice_google_reserved($config, $time) === false) $slots[] = gmdate('Y-m-d\TH:i:s\Z', $time);
        }
        $state['slots'] = array_slice(array_values(array_unique($slots)), 0, 200); $state['slots_checked'] = time(); $state['slot_provider'] = 'google';
        voice_finish($file, $state, 200, ['success' => true, 'provider' => 'google', 'automatic_booking' => true, 'timezone' => $timezone,
            'slots_utc' => array_slice($state['slots'], 0, 24), 'slots_local' => array_map(fn($slot) => (new DateTimeImmutable($slot))->setTimezone(new DateTimeZone($timezone))->format('Y-m-d H:i T'), array_slice($state['slots'], 0, 24)),
            'duration_minutes' => 30, 'message' => 'These slots were checked against BrandMint working hours and Google Calendar. Use prepare_consultation, read the Google Calendar date/time/name/email back and ask approval before confirm_consultation. No appointment exists yet.']);
    }
    if ($action === 'prepare_consultation') {
        if (!empty($state['booking_result']) || !empty($state['booking_attempted'])) voice_finish($file, $state, 409, ['success' => false, 'message' => 'A booking was already attempted. Do not create another.']);
        $name = trim((string) ($args['name'] ?? '')); $email = trim((string) ($args['email'] ?? ''));
        $time = (string) ($args['start_time'] ?? ''); $timezone = (string) ($args['timezone'] ?? 'Asia/Kolkata');
        if (strlen($name) < 2 || strlen($name) > 150 || preg_match('/[\r\n]/', $name) || !filter_var($email, FILTER_VALIDATE_EMAIL)
            || !in_array($timezone, timezone_identifiers_list(DateTimeZone::ALL_WITH_BC), true)
            || ($state['slot_provider'] ?? '') !== 'google' || !in_array($time, $state['slots'] ?? [], true) || ($state['slots_checked'] ?? 0) < time() - 600) voice_finish($file, $state, 400, ['success' => false, 'message' => 'Check current Google slots, then provide valid name, email and timezone.']);
        $payload = ['start_time' => $time, 'invitee' => ['name' => $name, 'email' => $email, 'timezone' => $timezone]];
        $id = bin2hex(random_bytes(16));
        $state['booking_draft'] = ['id' => $id, 'provider' => 'google', 'expires' => time() + 300, 'payload' => $payload];
        voice_finish($file, $state, 200, ['success' => true, 'provider' => 'google', 'proposal_id' => $id, 'summary' => $payload,
            'message' => 'Read the exact Google Calendar appointment details back. Ask: Do you confirm booking this consultation and sending the invitation? Wait for approval before confirm_consultation.']);
    }
    $draft = $state['booking_draft'] ?? [];
    if (empty($draft) || ($draft['provider'] ?? '') !== 'google' || ($args['proposal_id'] ?? '') !== ($draft['id'] ?? '') || ($args['confirmed'] ?? false) !== true) voice_finish($file, $state, 400, ['success' => false, 'message' => 'Explicit approval of the current prepared Google booking is required.']);
    if (!empty($state['booking_result'])) voice_finish($file, $state, 200, ['success' => true, 'booking' => $state['booking_result'], 'already_booked' => true]);
    if (!empty($state['booking_attempted'])) voice_finish($file, $state, 409, ['success' => false, 'message' => 'Booking outcome needs checking. Do not retry or switch providers.']);
    if (($draft['expires'] ?? 0) < time()) voice_finish($file, $state, 409, ['success' => false, 'message' => 'The reviewed booking expired. Check slots and review again.']);
    $lock = voice_booking_lock($config);
    if (!$lock) voice_finish($file, $state, 503, ['success' => false, 'message' => 'Booking is busy. Nothing was submitted.']);
    $selected = strtotime($draft['payload']['start_time']);
    $available = voice_calendly($config, 'GET', '/event_type_available_times?' . http_build_query(['event_type' => $eventType,
        'start_time' => gmdate('c', $selected - 1), 'end_time' => gmdate('c', $selected + 1800)]));
    $valid = false;
    foreach ($available['data']['collection'] ?? [] as $slot) if (($slot['status'] ?? '') === 'available' && strtotime($slot['start_time'] ?? '') === $selected) $valid = true;
    $busy = voice_google_busy($config, $selected, $selected + 1800);
    if ($available['status'] !== 200 || !$valid || $busy === null || !voice_google_free($busy, $selected)) voice_finish($file, $state, 409, ['success' => false, 'message' => 'This time is unavailable or could not be verified. Nothing was submitted. Check new availability.']);
    // A private slot ledger covers concurrent visitors and unknown network outcomes.
    $ledgerPath = voice_storage($config) . '/google-booking-ledger.json';
    $ledger = is_file($ledgerPath) ? json_decode((string) file_get_contents($ledgerPath), true) : [];
    if (!is_array($ledger)) voice_finish($file, $state, 503, ['success' => false, 'message' => 'Booking records need review. Nothing was submitted.']);
    $slotKey = hash('sha256', $config['google_calendar_id'] . ':' . $selected);
    if (isset($ledger[$slotKey])) voice_finish($file, $state, 409, ['success' => false, 'message' => 'A booking already exists or needs checking for that time. Do not retry or switch providers.']);
    $today = gmdate('Y-m-d'); $attempts = 0;
    foreach ($ledger as $key => $entry) { if (($entry['start'] ?? 0) < time() - 604800) unset($ledger[$key]); elseif (($entry['day'] ?? '') === $today) $attempts++; }
    if ($attempts >= (int) ($config['google_daily_booking_limit'] ?? 100)) voice_finish($file, $state, 429, ['success' => false, 'message' => 'Online booking limit reached. Contact the team.']);
    $eventId = 'bm' . $draft['id'];
    $ledger[$slotKey] = ['event_id' => $eventId, 'start' => $selected, 'day' => $today, 'outcome' => 'unknown'];
    if (!voice_google_write_private($ledgerPath, $ledger)) voice_finish($file, $state, 503, ['success' => false, 'message' => 'Could not save booking state. Nothing was submitted.']);
    $state['booking_attempted'] = true; voice_save_session($file, $state);
    $invitee = $draft['payload']['invitee'];
    $payload = ['id' => $eventId, 'summary' => 'BrandMint AI consultation',
        'start' => ['dateTime' => gmdate('c', $selected), 'timeZone' => $invitee['timezone']],
        'end' => ['dateTime' => gmdate('c', $selected + 1800), 'timeZone' => $invitee['timezone']],
        'attendees' => [['email' => $invitee['email'], 'displayName' => $invitee['name']]], 'transparency' => 'opaque'];
    // Only an explicitly configured business location is used; never invent a meeting link.
    if (!empty($config['google_meeting_location'])) $payload['location'] = (string) $config['google_meeting_location'];
    if (($config['google_create_meet'] ?? false) === true) $payload['conferenceData'] = ['createRequest' => [
        'requestId' => $eventId, 'conferenceSolutionKey' => ['type' => 'hangoutsMeet'],
    ]];
    $result = voice_google_http('https://www.googleapis.com/calendar/v3/calendars/' . rawurlencode($config['google_calendar_id']) . '/events?sendUpdates=all&conferenceDataVersion=1', 'POST', $payload, voice_google_token($config));
    $event = $result['data'];
    if ($result['status'] >= 200 && $result['status'] < 300 && ($event['id'] ?? '') === $eventId && ($event['status'] ?? '') === 'confirmed'
        && strtotime($event['start']['dateTime'] ?? '') === $selected && strtotime($event['end']['dateTime'] ?? '') === $selected + 1800) {
        $ledger[$slotKey]['outcome'] = 'confirmed'; voice_google_write_private($ledgerPath, $ledger);
        $state['booking_result'] = ['provider' => 'google', 'event' => $eventId, 'start_time' => $draft['payload']['start_time'], 'timezone' => $invitee['timezone']];
        if (preg_match('~^https://meet\.google\.com/[a-z-]+$~', (string) ($event['hangoutLink'] ?? ''))) $state['booking_result']['meeting_url'] = $event['hangoutLink'];
        unset($state['booking_draft']['payload']); voice_metric($config, 'booking_confirmed');
        voice_finish($file, $state, 200, ['success' => true, 'booking' => $state['booking_result'], 'message' => 'Google Calendar confirmed this appointment. Guest notifications were requested; inbox delivery and attendance acceptance are not verified.']);
    }
    // A definitive rejected request can be reviewed anew. Conflicts, throttling,
    // timeouts and server errors remain unknown and must never trigger a second POST.
    if (in_array($result['status'], [400, 401, 403, 404, 422], true)) {
        unset($ledger[$slotKey]); voice_google_write_private($ledgerPath, $ledger);
        unset($state['booking_attempted'], $state['booking_draft']);
        voice_finish($file, $state, 409, ['success' => false, 'message' => 'Google rejected the booking. No appointment confirmation was received. Ask the team to check the connection.']);
    }
    voice_finish($file, $state, 502, ['success' => false, 'message' => 'Google booking outcome is unknown. Do not retry or switch providers. Ask the team to check Google Calendar first.']);
}
function voice_google_write_private(string $path, array $data): bool
{
    $temporary = $path . '.' . bin2hex(random_bytes(8)) . '.tmp';
    $json = json_encode($data);
    $saved = is_string($json) && file_put_contents($temporary, $json, LOCK_EX) === strlen($json);
    if ($saved) { @chmod($temporary, 0600); $saved = rename($temporary, $path); }
    if (!$saved) @unlink($temporary);
    return $saved;
}
