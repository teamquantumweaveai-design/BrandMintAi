<?php
declare(strict_types=1);
ini_set('display_errors', '0');
require __DIR__ . '/lib.php';
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Allow: POST'); voice_json(405, ['success' => false]); }
voice_origin();
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) voice_json(415, ['success' => false]);
$raw = file_get_contents('php://input', false, null, 0, 8193);
if (!is_string($raw) || strlen($raw) > 8192) voice_json(413, ['success' => false]);
$body = json_decode($raw, true);
if (!is_array($body)) voice_json(400, ['success' => false]);
$config = voice_config();
[$file, $state] = voice_locked_session($config);
$action = $body['action'] ?? '';
$args = is_array($body['args'] ?? null) ? $body['args'] : [];
$capabilities = voice_capabilities($config);
if ($action === 'capabilities') voice_finish($file, $state, 200, ['success' => true] + $capabilities);
if ($action === 'discard_proposal') {
    foreach (['booking_draft', 'handoff_draft'] as $field) {
        if (!empty($state[$field]) && ($state[$field]['id'] ?? '') === ($args['proposal_id'] ?? '')) unset($state[$field]);
    }
    voice_finish($file, $state, 200, ['success' => true]);
}

if ($action === 'metric') {
    $event = $args['event'] ?? '';
    $allowed = ['connected', 'connection_failed', 'ended', 'knowledge_miss', 'unanswered_pricing', 'unanswered_service', 'unanswered_other', 'navigation', 'embedded_booking_completed', 'language_en', 'language_hi', 'language_kn'];
    if (!in_array($event, $allowed, true)) voice_finish($file, $state, 400, ['success' => false]);
    // Single-occurrence lifecycle metrics cannot be replayed within the same session.
    $repeatable = in_array($event, ['knowledge_miss', 'navigation', 'unanswered_pricing', 'unanswered_service', 'unanswered_other'], true);
    if ($repeatable || empty($state['metrics'][$event])) voice_metric($config, $event, $event === 'connected' ? (int) ($args['latency_ms'] ?? 0) : null);
    $state['metrics'][$event] = true;
    voice_finish($file, $state, 200, ['success' => true]);
}

if (in_array($action, ['get_consultation_slots', 'prepare_consultation', 'confirm_consultation'], true)) {
    if (!$capabilities['voice_booking']) voice_finish($file, $state, 503, ['success' => false, 'fallback' => 'calendar', 'message' => 'Voice booking is not connected yet. Use the embedded Calendly calendar.']);
    $eventType = voice_calendar_event_type($config);
    if (!preg_match('~^https://api\.calendly\.com/event_types/[a-zA-Z0-9-]+$~', $eventType)) voice_finish($file, $state, 503, ['success' => false, 'message' => 'Calendar event configuration needs review.']);
    // Validate the configured event really is the BrandMint link, never the unrelated connected account.
    $type = voice_calendly($config, 'GET', substr($eventType, strlen('https://api.calendly.com')));
    $resource = $type['data']['resource'] ?? [];
    if ($type['status'] !== 200 || rtrim($resource['scheduling_url'] ?? '', '/') !== 'https://calendly.com/team-brandmint/30min'
        || empty($resource['active'])) voice_finish($file, $state, 503, ['success' => false, 'fallback' => 'calendar', 'message' => 'The BrandMint calendar connection needs review. Use the calendar instead.']);
    if ($action === 'get_consultation_slots') {
        $requested = isset($args['date']) ? strtotime((string) $args['date'] . 'T00:00:00Z') : false;
        $start = max(time() + 60, $requested ?: time() + 60);
        if ($start > time() + 90 * 86400) voice_finish($file, $state, 400, ['success' => false, 'message' => 'Choose a date within the next 90 days.']);
        $end = $start + 7 * 86400 - 60;
        $response = voice_calendly($config, 'GET', '/event_type_available_times?' . http_build_query([
            'event_type' => $eventType, 'start_time' => gmdate('Y-m-d\TH:i:s\Z', $start), 'end_time' => gmdate('Y-m-d\TH:i:s\Z', $end),
        ]));
        if ($response['status'] !== 200) voice_finish($file, $state, 502, ['success' => false, 'fallback' => 'calendar', 'message' => 'Unable to check live availability. Use the calendar.']);
        $slots = [];
        foreach ($response['data']['collection'] ?? [] as $slot) {
            if (($slot['status'] ?? '') === 'available' && strtotime($slot['start_time'] ?? '') > time()) $slots[] = $slot['start_time'];
        }
        $state['slots'] = array_slice($slots, 0, 200); $state['slots_checked'] = time();
        voice_finish($file, $state, 200, ['success' => true, 'event_type' => $eventType, 'slots_utc' => array_slice($slots, 0, 24), 'duration_minutes' => 30, 'message' => 'Use only these actual available slots. Ask which timezone the visitor wants; do not assume.']);
    }
    if ($action === 'prepare_consultation') {
        if (!empty($state['booking_result']) || !empty($state['booking_attempted'])) voice_finish($file, $state, 409, ['success' => false, 'message' => 'A booking was already attempted in this conversation. Check its status before starting another.']);
        $name = trim((string) ($args['name'] ?? '')); $email = trim((string) ($args['email'] ?? ''));
        $time = (string) ($args['start_time'] ?? ''); $timezone = (string) ($args['timezone'] ?? '');
        if (strlen($name) < 2 || strlen($name) > 150 || preg_match('/[\r\n]/', $name) || !filter_var($email, FILTER_VALIDATE_EMAIL)
            || !in_array($timezone, timezone_identifiers_list(DateTimeZone::ALL_WITH_BC), true) || !in_array($time, $state['slots'] ?? [], true)
            || ($state['slots_checked'] ?? 0) < time() - 600) {
            voice_finish($file, $state, 400, ['success' => false, 'message' => 'Use a freshly checked available slot, valid name/email, and an IANA timezone.']);
        }
        foreach ($resource['custom_questions'] ?? [] as $question) {
            if (!empty($question['enabled']) && !empty($question['required'])) voice_finish($file, $state, 409, ['success' => false, 'fallback' => 'calendar', 'message' => 'This event has required custom questions. Complete them in the embedded calendar.']);
        }
        if (!empty($resource['is_paid']) || !empty($resource['payment'])) voice_finish($file, $state, 409, ['success' => false, 'fallback' => 'calendar', 'message' => 'This event requires payment. Complete the secure calendar checkout.']);
        $payload = ['event_type' => $eventType, 'start_time' => $time, 'invitee' => ['name' => $name, 'email' => $email, 'timezone' => $timezone]];
        $locations = $resource['locations'] ?? [];
        if (count($locations) > 1) voice_finish($file, $state, 409, ['success' => false, 'fallback' => 'calendar', 'message' => 'Choose a meeting location in the calendar.']);
        if ($locations) {
            $kind = $locations[0]['kind'] ?? '';
            if (!in_array($kind, ['zoom_conference', 'google_conference', 'microsoft_teams_conference', 'webex_conference', 'gotomeeting_conference'], true)) {
                voice_finish($file, $state, 409, ['success' => false, 'fallback' => 'calendar', 'message' => 'This event needs additional location details. Use the calendar.']);
            }
            $payload['location'] = ['kind' => $kind];
        }
        $proposal = bin2hex(random_bytes(16));
        $state['booking_draft'] = ['id' => $proposal, 'expires' => time() + 300, 'payload' => $payload];
        voice_finish($file, $state, 200, ['success' => true, 'proposal_id' => $proposal, 'summary' => $payload, 'message' => 'Read back the exact date, time, timezone, name and email, and ask permission to book and send the invitation. Call confirm_consultation only after the visitor explicitly agrees.']);
    }
    $draft = $state['booking_draft'] ?? [];
    if (($args['proposal_id'] ?? '') !== ($draft['id'] ?? '') || empty($draft) || ($args['confirmed'] ?? false) !== true) voice_finish($file, $state, 400, ['success' => false, 'message' => 'Explicit confirmation of a prepared booking is required.']);
    if (!empty($state['booking_result'])) voice_finish($file, $state, 200, ['success' => true, 'booking' => $state['booking_result'], 'already_booked' => true]);
    if (!empty($state['booking_attempted'])) voice_finish($file, $state, 409, ['success' => false, 'message' => 'The booking outcome needs checking. Do not retry or create a duplicate; check your Calendly email or contact the team.']);
    if (($draft['expires'] ?? 0) < time()) voice_finish($file, $state, 409, ['success' => false, 'message' => 'Booking confirmation expired. Check slots again.']);
    // Check the chosen slot again immediately before writing.
    $selected = strtotime($draft['payload']['start_time']);
    $available = voice_calendly($config, 'GET', '/event_type_available_times?' . http_build_query([
        'event_type' => $eventType, 'start_time' => gmdate('Y-m-d\TH:i:s\Z', $selected - 1), 'end_time' => gmdate('Y-m-d\TH:i:s\Z', $selected + 1800),
    ]));
    $valid = false;
    foreach ($available['data']['collection'] ?? [] as $slot) if (($slot['status'] ?? '') === 'available' && ($slot['start_time'] ?? '') === $draft['payload']['start_time']) $valid = true;
    if ($available['status'] !== 200 || !$valid) voice_finish($file, $state, 409, ['success' => false, 'message' => 'That slot is no longer available. Check new availability.']);
    $state['booking_attempted'] = true;
    voice_save_session($file, $state); // Persist before POST: uncertain failures must not be blindly retried.
    $result = voice_calendly($config, 'POST', '/invitees', $draft['payload']);
    $booked = $result['data']['resource'] ?? [];
    if ($result['status'] >= 200 && $result['status'] < 300 && ($booked['status'] ?? '') === 'active' && !empty($booked['event'])) {
        $state['booking_result'] = ['event' => $booked['event'], 'start_time' => $draft['payload']['start_time'],
            'timezone' => $draft['payload']['invitee']['timezone'], 'cancel_url' => $booked['cancel_url'] ?? '', 'reschedule_url' => $booked['reschedule_url'] ?? ''];
        unset($state['booking_draft']['payload']); // Do not retain invitee contact details after confirmation.
        voice_metric($config, 'booking_confirmed');
        voice_finish($file, $state, 200, ['success' => true, 'booking' => $state['booking_result']]);
    }
    if ($result['status'] >= 400 && $result['status'] < 500 && $result['status'] !== 408) {
        unset($state['booking_attempted'], $state['booking_draft']);
        voice_finish($file, $state, 409, ['success' => false, 'fallback' => 'calendar', 'message' => 'Calendly did not accept the booking. Recheck details or use the calendar; no confirmation was received.']);
    }
    voice_finish($file, $state, 502, ['success' => false, 'message' => 'Booking confirmation could not be verified. Do not retry: check your email or ask the team to check Calendly first.']);
}

if ($action === 'prepare_handoff') {
    if (!$capabilities['handoff']) voice_finish($file, $state, 503, ['success' => false, 'message' => 'Team handoff email is not connected yet.']);
    $summary = trim((string) ($args['summary'] ?? ''));
    if (strlen($summary) < 20 || strlen($summary) > 3000) voice_finish($file, $state, 400, ['success' => false, 'message' => 'Provide a short business-needs summary under 3000 bytes.']);
    $id = bin2hex(random_bytes(16)); $state['handoff_draft'] = ['id' => $id, 'summary' => $summary, 'expires' => time() + 300];
    voice_finish($file, $state, 200, ['success' => true, 'proposal_id' => $id, 'summary' => $summary, 'message' => 'Read or show this summary and ask explicit permission to email it to the BrandMint team. Do not send until the visitor agrees.']);
}
if ($action === 'confirm_handoff') {
    $draft = $state['handoff_draft'] ?? [];
    if (!$capabilities['handoff'] || empty($draft) || ($args['proposal_id'] ?? '') !== $draft['id'] || ($args['consented'] ?? false) !== true
        || $draft['expires'] < time()) voice_finish($file, $state, 400, ['success' => false, 'message' => 'A current summary and explicit permission to share it are required.']);
    if (!empty($state['handoff_sent'])) voice_finish($file, $state, 200, ['success' => true, 'already_sent' => true]);
    if (!empty($state['handoff_attempted'])) voice_finish($file, $state, 409, ['success' => false, 'message' => 'Summary delivery needs checking. Do not send it again.']);
    $to = (string) $config['handoff_email']; $from = (string) ($config['handoff_from'] ?? 'voice@brandmintai.io');
    if (!function_exists('mail')) voice_finish($file, $state, 503, ['success' => false, 'message' => 'Team email transport is not configured on this server.']);
    if (!filter_var($from, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $to . $from)) voice_finish($file, $state, 503, ['success' => false, 'message' => 'Team email configuration needs review.']);
    $state['handoff_attempted'] = true; voice_save_session($file, $state);
    $bodyText = "Visitor explicitly consented to share this summary.\n\n" . $draft['summary'] . "\n\nBooking: " . ($state['booking_result']['event'] ?? 'Not confirmed in this voice session');
    $sent = mail($to, 'BrandMint voice consultation summary', $bodyText, "From: " . $from . "\r\nContent-Type: text/plain; charset=UTF-8");
    if (!$sent) voice_finish($file, $state, 502, ['success' => false, 'message' => 'The mail server did not accept the summary. Please contact the team directly.']);
    $state['handoff_sent'] = true; unset($state['handoff_draft']['summary']); voice_metric($config, 'handoff_accepted');
    voice_finish($file, $state, 200, ['success' => true, 'message' => 'The configured mail server accepted the consented summary for delivery. Do not claim inbox delivery is verified.']);
}
voice_finish($file, $state, 400, ['success' => false, 'message' => 'Unknown voice action.']);
