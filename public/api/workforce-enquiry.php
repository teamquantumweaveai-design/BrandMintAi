<?php
declare(strict_types=1);

// Saves AI Workforce enquiries (/ai-workforce/) and emails the team.
// Enquiries go to workforce-enquiries.jsonl next to public_html, so they can't be opened from the web.

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const NOTIFY_EMAIL = 'connect@brandmintai.io';
const FROM_EMAIL = 'connect@brandmintai.io';
const CONSENT_VERSION = '2026-10-30-v1';

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function invalid(): void
{
    respond(400, ['error' => 'Please review the required fields and try again.']);
}

function text_field(array $body, string $key, int $min, int $max): string
{
    $value = $body[$key] ?? null;
    if (!is_string($value)) {
        invalid();
    }
    $value = trim($value);
    $length = mb_strlen($value);
    if ($length < $min || $length > $max) {
        invalid();
    }
    return $value;
}

function list_field(array $body, string $key, int $min, int $max): array
{
    $value = $body[$key] ?? null;
    if (!is_array($value) || !array_is_list($value) || count($value) < $min || count($value) > $max) {
        invalid();
    }
    foreach ($value as $item) {
        if (!is_string($item) || mb_strlen($item) > 150) {
            invalid();
        }
    }
    return $value;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Method not allowed.']);
}
// Browsers send Origin on cross-site requests; reject other sites calling this from a visitor's browser.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== strtok($host, ':')) {
    respond(403, ['error' => 'Request not allowed.']);
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
    respond(415, ['error' => 'Invalid request.']);
}
$raw = file_get_contents('php://input', false, null, 0, 16001) ?: '';
if (strlen($raw) > 16000) {
    respond(413, ['error' => 'Please shorten your answers.']);
}
$body = json_decode($raw, true);
if (!is_array($body)) {
    invalid();
}

$id = text_field($body, 'id', 36, 36);
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $id)) {
    invalid();
}
$reference = 'BM-' . strtoupper(substr($id, 0, 8));

// Bots fill the hidden field. Answer as if it worked, and keep nothing.
if (($body['trap'] ?? '') !== '') {
    respond(200, ['reference' => $reference]);
}

$method = text_field($body, 'method', 1, 20);
$contact = text_field($body, 'contact', 6, 180);
if (!in_array($method, ['WhatsApp', 'Phone', 'Email'], true) || ($body['consent'] ?? null) !== true) {
    invalid();
}
if ($method === 'Email' && !filter_var($contact, FILTER_VALIDATE_EMAIL)) {
    invalid();
}

$enquiry = [
    'id' => $id,
    'reference' => $reference,
    'created' => gmdate('c'),
    'status' => 'New',
    'consentVersion' => CONSENT_VERSION,
    'business' => text_field($body, 'business', 2, 160),
    'industry' => text_field($body, 'industry', 1, 100),
    'website' => text_field($body, 'website', 0, 250),
    'problems' => list_field($body, 'problems', 1, 3),
    'goal' => text_field($body, 'goal', 5, 1500),
    'kind' => text_field($body, 'kind', 1, 150),
    'roles' => list_field($body, 'roles', 1, 20),
    'coordination' => text_field($body, 'coordination', 0, 150),
    'channels' => list_field($body, 'channels', 1, 20),
    'languages' => list_field($body, 'languages', 1, 20),
    'volume' => text_field($body, 'volume', 0, 100),
    'existing' => text_field($body, 'existing', 0, 1000),
    'tasks' => list_field($body, 'tasks', 1, 20),
    'handoff' => list_field($body, 'handoff', 1, 20),
    'mode' => text_field($body, 'mode', 1, 150),
    'tools' => list_field($body, 'tools', 0, 20),
    'information' => list_field($body, 'information', 0, 20),
    'timing' => text_field($body, 'timing', 0, 100),
    'budget' => text_field($body, 'budget', 0, 100),
    'notes' => text_field($body, 'notes', 0, 2000),
    'name' => text_field($body, 'name', 2, 120),
    'method' => $method,
    'contact' => $contact,
    'marketing' => ($body['marketing'] ?? false) === true,
];

$line = json_encode($enquiry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
$saved = @file_put_contents(dirname(__DIR__, 2) . '/workforce-enquiries.jsonl', $line, FILE_APPEND | LOCK_EX) !== false;
if (!$saved) {
    error_log('Workforce enquiry ' . $reference . ' could not be written to the enquiries file.');
}

// Email to the team. Subject and headers contain only fixed text and the reference, so nothing can inject headers.
$lines = [];
foreach ($enquiry as $key => $value) {
    $lines[] = $key . ': ' . (is_array($value) ? implode(', ', $value) : (is_bool($value) ? ($value ? 'yes' : 'no') : $value));
}
$headers = ['From: BrandMint AI Website <' . FROM_EMAIL . '>', 'Content-Type: text/plain; charset=UTF-8'];
$mailed = @mail(NOTIFY_EMAIL, 'New AI Workforce enquiry ' . $reference, implode("\n", $lines), implode("\r\n", $headers));
if (!$mailed) {
    error_log('Workforce enquiry ' . $reference . ' email notification failed.');
}

if (!$saved && !$mailed) {
    respond(503, ['error' => 'We could not save your enquiry. Your answers are still here; please try again or message us on WhatsApp.']);
}
respond(200, ['reference' => $reference]);
