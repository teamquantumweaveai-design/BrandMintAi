<?php
declare(strict_types=1);
ini_set('display_errors', '0');
require __DIR__ . '/lib.php';
header('Cache-Control: no-store'); header('Referrer-Policy: no-referrer');
header('X-Content-Type-Options: nosniff'); header('X-Frame-Options: DENY');
header("Content-Security-Policy: default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
$config = voice_config();
$setup = (string) ($config['google_setup_token'] ?? '');
// This owner-only endpoint stays off until the owner installs its private config.
if (strlen($setup) < 32 || empty($config['google_client_id']) || empty($config['google_client_secret'])
    || ($config['google_owner_email'] ?? '') !== 'team.brandmint@gmail.com'
    || ($config['google_calendar_id'] ?? '') !== 'team.brandmint@gmail.com') { http_response_code(404); exit; }
if (($_SERVER['HTTPS'] ?? '') !== 'on' || strtolower($_SERVER['HTTP_HOST'] ?? '') !== 'brandmintai.io') { http_response_code(403); exit; }
$sessionDirectory = voice_storage($config) . '/google-oauth-sessions';
if (!is_dir($sessionDirectory) && !@mkdir($sessionDirectory, 0700, true)) { http_response_code(503); exit; }
session_save_path($sessionDirectory);
ini_set('session.use_strict_mode', '1');
session_name('bm_voice_google_setup');
session_set_cookie_params(['lifetime' => 0, 'path' => '/api/voice/google-connect.php', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
session_start();
function voice_google_setup_page(string $message, int $status = 200): void
{
    http_response_code($status); header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Ishani calendar connection</title><h1>Ishani calendar connection</h1><p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p></html>'; exit;
}
$redirect = 'https://brandmintai.io/api/voice/google-connect.php';
if (isset($_GET['code']) || isset($_GET['error'])) {
    $pending = $_SESSION['google_oauth'] ?? []; unset($_SESSION['google_oauth']);
    if (empty($pending) || ($pending['expires'] ?? 0) < time() || !is_string($_GET['state'] ?? null)
        || !hash_equals($pending['state'], $_GET['state'])) voice_google_setup_page('This authorization link expired. Start the owner connection again.', 400);
    if (isset($_GET['error']) || !is_string($_GET['code'] ?? null) || strlen($_GET['code']) > 4096) voice_google_setup_page('Google authorization was not completed. Nothing was connected.', 400);
    $token = voice_google_http('https://oauth2.googleapis.com/token', 'POST', [
        'code' => $_GET['code'], 'client_id' => $config['google_client_id'], 'client_secret' => $config['google_client_secret'],
        'redirect_uri' => $redirect, 'grant_type' => 'authorization_code', 'code_verifier' => $pending['verifier'],
    ], '', true);
    if ($token['status'] !== 200 || empty($token['data']['access_token']) || empty($token['data']['refresh_token'])) voice_google_setup_page('Google did not provide an offline authorization. Start again and approve calendar access.', 400);
    $access = (string) $token['data']['access_token'];
    $profile = voice_google_http('https://openidconnect.googleapis.com/v1/userinfo', 'GET', null, $access);
    if ($profile['status'] !== 200 || ($profile['data']['email_verified'] ?? false) !== true
        || strtolower($profile['data']['email'] ?? '') !== $config['google_owner_email']) voice_google_setup_page('Sign in as team.brandmint@gmail.com. The other account was not connected.', 403);
    $scopes = explode(' ', (string) ($token['data']['scope'] ?? ''));
    foreach (['https://www.googleapis.com/auth/calendar.events.owned', 'https://www.googleapis.com/auth/calendar.freebusy'] as $scope) {
        if (!in_array($scope, $scopes, true)) voice_google_setup_page('Both calendar event and availability permissions are needed. No connection was saved.', 403);
    }
    $availability = voice_google_http('https://www.googleapis.com/calendar/v3/freeBusy', 'POST', [
        'timeMin' => gmdate('c'), 'timeMax' => gmdate('c', time() + 86400),
        'items' => [['id' => $config['google_calendar_id']]],
    ], $access);
    $calendar = $availability['data']['calendars'][$config['google_calendar_id']] ?? [];
    if ($availability['status'] !== 200 || !isset($calendar['busy']) || !empty($calendar['errors'])) voice_google_setup_page('Google Calendar availability could not be verified. Enable Google Calendar API in this client project and approve calendar availability access, then reconnect.', 503);
    $saved = voice_google_write_private(voice_storage($config) . '/google-calendar-grant.json', [
        'refresh_token' => $token['data']['refresh_token'], 'owner_email' => $config['google_owner_email'],
        'calendar_id' => $config['google_calendar_id'], 'created_at' => time(),
    ]);
    if (!$saved) voice_google_setup_page('Could not save private calendar authorization. Nothing was connected.', 503);
    $_SESSION['google_connected'] = true; session_regenerate_id(true);
    header('Location: ' . $redirect . '?connected=1', true, 303); exit;
}
if (isset($_GET['connected']) && !empty($_SESSION['google_connected'])) {
    unset($_SESSION['google_connected']);
    voice_google_setup_page('Google authorization saved privately for team.brandmint@gmail.com. The owner must also confirm that Calendly checks this same calendar and enable Google booking in the private voice config. No appointment was created.');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    voice_origin();
    $nonce = $_SESSION['google_form_nonce'] ?? ''; unset($_SESSION['google_form_nonce']);
    if (!is_string($_POST['nonce'] ?? null) || $nonce === '' || !hash_equals($nonce, $_POST['nonce'])
        || !is_string($_POST['setup_token'] ?? null) || !hash_equals($setup, $_POST['setup_token'])) voice_google_setup_page('Owner authorization failed. Reload and try again.', 403);
    session_regenerate_id(true);
    $verifier = rtrim(strtr(base64_encode(random_bytes(48)), '+/', '-_'), '=');
    $state = bin2hex(random_bytes(32));
    $_SESSION['google_oauth'] = ['state' => $state, 'verifier' => $verifier, 'expires' => time() + 600];
    $url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
        'client_id' => $config['google_client_id'], 'redirect_uri' => $redirect, 'response_type' => 'code',
        'scope' => 'openid email https://www.googleapis.com/auth/calendar.events.owned https://www.googleapis.com/auth/calendar.freebusy',
        'access_type' => 'offline', 'prompt' => 'consent', 'login_hint' => $config['google_owner_email'],
        'state' => $state, 'code_challenge' => rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '='), 'code_challenge_method' => 'S256',
    ]);
    header('Location: ' . $url, true, 303); exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') { header('Allow: GET, POST'); http_response_code(405); exit; }
$_SESSION['google_form_nonce'] = bin2hex(random_bytes(32));
header('Content-Type: text/html; charset=utf-8');
echo '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect Ishani calendar</title><h1>Connect Ishani calendar</h1><p>Owner setup for team.brandmint@gmail.com. This authorizes the website to check availability and create confirmed consultation invitations.</p><form method="post"><input type="hidden" name="nonce" value="' . $_SESSION['google_form_nonce'] . '"><label>Private setup token <input type="password" name="setup_token" required autocomplete="off"></label><button type="submit">Connect company Google Calendar</button></form></html>';
