<?php
declare(strict_types=1);
if (!isset($file, $state, $config, $action, $args)) { http_response_code(404); exit; }

// Fixed company destination: this endpoint can never act as an arbitrary email relay.
function voice_email_quota(array $config, string $recipient): bool {
    $file = @fopen(voice_storage($config) . '/email-quota.json', 'c+');
    if (!$file || !flock($file, LOCK_EX)) return false;
    $quota = json_decode(stream_get_contents($file) ?: '{}', true) ?: [];
    $day = gmdate('Y-m-d');
    if (($quota['day'] ?? '') !== $day) $quota = ['day' => $day, 'total' => 0, 'recipients' => []];
    $hash = hash_hmac('sha256', strtolower($recipient), voice_secret($config));
    $allowed = $quota['total'] < max(1, min(500, (int) ($config['email_daily_limit'] ?? 100))) && ($quota['recipients'][$hash] ?? 0) < 3;
    if ($allowed) { $quota['total']++; $quota['recipients'][$hash] = ($quota['recipients'][$hash] ?? 0) + 1; }
    $json = json_encode($quota); rewind($file);
    $saved = ftruncate($file, 0) && fwrite($file, $json) === strlen($json) && fflush($file);
    flock($file, LOCK_UN); fclose($file); return $allowed && $saved;
}
function voice_send_email(array $config, array $draft): bool {
    $from = 'connect@brandmintai.io';
    $body = str_replace(["\r\n", "\r"], "\n", $draft['body']);
    $body .= "\n\n--\nVisitor email: " . $draft['reply_to'] . "\nSent by Ishani at the visitor's confirmed request. Reply to this email to contact the visitor.\n";
    $headers = "From: BrandMint AI <" . $from . ">\r\nReply-To: " . $draft['reply_to'] . "\r\n"
        . "Date: " . gmdate('r') . "\r\nMessage-ID: <" . $draft['id'] . "@brandmintai.io>\r\n"
        . "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64";
    return mail('connect@brandmintai.io', '=?UTF-8?B?' . base64_encode($draft['subject']) . '?=', chunk_split(base64_encode($body), 76, "\r\n"), $headers);
}

if (in_array($action, ['prepare_email', 'confirm_email'], true)) {
    if (!$capabilities['email_sending']) voice_finish($file, $state, 503, ['success' => false, 'message' => 'Company email sending is unavailable. Keep the email as a draft; do not claim it was sent.']);
    if ($action === 'prepare_email') {
        if (!empty($state['email_attempted'])) voice_finish($file, $state, 409, ['success' => false, 'message' => 'An email was already attempted in this conversation. Do not send another automatically.']);
        $to = trim((string) ($args['to'] ?? '')); $subject = trim((string) ($args['subject'] ?? '')); $body = trim((string) ($args['body'] ?? ''));
        $replyTo = trim((string) ($args['reply_to'] ?? ''));
        if (strtolower($to) !== 'connect@brandmintai.io' || !filter_var($replyTo, FILTER_VALIDATE_EMAIL) || strlen($replyTo) > 254 || strlen($subject) < 1 || strlen($subject) > 200
            || preg_match('/[\r\n\x00]/', $to . $replyTo . $subject) || strlen($body) < 1 || strlen($body) > 6000 || strpos($body, "\x00") !== false) {
            voice_finish($file, $state, 400, ['success' => false, 'message' => 'The recipient must be connect@brandmintai.io. Collect a valid visitor email for Reply-To, a subject under 200 bytes and a message under 6000 bytes.']);
        }
        $id = bin2hex(random_bytes(16));
        $to = 'connect@brandmintai.io';
        $state['email_draft'] = ['id' => $id, 'to' => $to, 'reply_to' => $replyTo, 'subject' => $subject, 'body' => $body, 'expires' => time() + 300];
        voice_finish($file, $state, 200, ['success' => true, 'proposal_id' => $id, 'email' => ['to' => $to, 'reply_to' => $replyTo, 'subject' => $subject, 'body' => $body],
            'sender' => 'connect@brandmintai.io', 'message' => 'Read back the company recipient, visitor Reply-To email, subject and exact message. Explain the website sends it on their behalf and replies go to their address. Ask explicit permission to SEND. Nothing is sent before confirm_email after approval.']);
    }
    $draft = $state['email_draft'] ?? [];
    if (!$draft || ($args['proposal_id'] ?? '') !== $draft['id'] || ($args['confirmed'] ?? false) !== true || $draft['expires'] < time()) voice_finish($file, $state, 400, ['success' => false, 'message' => 'A current email draft and explicit approval of its recipient and exact message are required.']);
    if (!empty($state['email_attempted'])) voice_finish($file, $state, 409, ['success' => false, 'message' => 'This email was already attempted. Do not retry; check with the sender.']);
    if (!voice_email_quota($config, $draft['reply_to'])) voice_finish($file, $state, 429, ['success' => false, 'message' => 'The email sending limit is reached. Keep the draft and contact the team.']);
    $state['email_attempted'] = true; unset($state['email_draft']); voice_save_session($file, $state);
    $sent = voice_send_email($config, $draft);
    voice_metric($config, $sent ? 'email_accepted' : 'email_failed');
    voice_finish($file, $state, $sent ? 200 : 502, ['success' => $sent, 'accepted' => $sent,
        'reference' => $draft['id'],
        'message' => $sent ? 'The website mail server accepted the confirmed message to connect@brandmintai.io for delivery, with the visitor email as Reply-To. Inbox delivery is not verified.' : 'Email delivery could not be verified. Do not retry automatically; the team should check the mailbox first.']);
}
