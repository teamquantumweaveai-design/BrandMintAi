<?php
declare(strict_types=1);

// Onboarding details sent from /meta-growth/thank-you/ after a paid plan.
// Accepted only for a real Razorpay payment. Each submission is added to the team's Google Sheet
// and kept in onboarding.jsonl next to public_html as a backup.

require __DIR__ . '/lib.php';

const TONES = ['Warm and friendly', 'Expert and reassuring', 'Playful and bold', 'Calm and premium'];
const LANGUAGES = ['English', 'English with some Hindi (Hinglish)', 'Hindi'];

function invalid(): void
{
    respond(400, ['success' => false, 'message' => 'Please review the required fields and try again.']);
}

function text_field(array $body, string $key, int $min, int $max): string
{
    $value = $body[$key] ?? '';
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

function choice_field(array $body, string $key, array $allowed): string
{
    $value = $body[$key] ?? $allowed[0];
    if (!in_array($value, $allowed, true)) {
        invalid();
    }
    return $value;
}

// Sheet rows go to a Google Apps Script web app (see docs/meta-growth-onboarding.md).
function push_to_sheet(array $config, array $row): bool
{
    if (empty($config['sheets_url']) || empty($config['sheets_token']) || !function_exists('curl_init')) {
        return false;
    }
    $request = curl_init($config['sheets_url']);
    curl_setopt_array($request, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['token' => $config['sheets_token'], 'row' => $row], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        // Apps Script answers a POST with a redirect to the result.
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 3,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 20,
    ]);
    $responseBody = curl_exec($request);
    $status = (int) curl_getinfo($request, CURLINFO_HTTP_CODE);
    curl_close($request);

    $data = is_string($responseBody) ? json_decode($responseBody, true) : null;
    if ($status !== 200 || ($data['ok'] ?? false) !== true) {
        error_log('Onboarding sheet update failed with HTTP ' . $status . ': ' . (is_string($responseBody) ? substr($responseBody, 0, 300) : 'no response'));
        return false;
    }
    return true;
}

$body = require_post_json(16000);
$paymentId = is_string($body['payment_id'] ?? null) ? $body['payment_id'] : '';
if (!preg_match('/^pay_[A-Za-z0-9]{8,30}$/', $paymentId)) {
    respond(400, ['success' => false, 'message' => 'We couldn’t find your payment. Please message us on WhatsApp.']);
}

$details = [
    'business_name' => text_field($body, 'business_name', 0, 160),
    'link' => text_field($body, 'link', 0, 250),
    'business_type' => text_field($body, 'business_type', 0, 150),
    'area' => text_field($body, 'area', 0, 150),
    'sell' => text_field($body, 'sell', 3, 1500),
    'buyers' => text_field($body, 'buyers', 3, 1500),
    'why_you' => text_field($body, 'why_you', 0, 1500),
    'offers' => text_field($body, 'offers', 0, 1500),
    'tone' => choice_field($body, 'tone', TONES),
    'language' => choice_field($body, 'language', LANGUAGES),
    'never' => text_field($body, 'never', 0, 1500),
];

// Only paying customers can submit: the payment must exist in Razorpay and be paid.
$config = razorpay_config();
$payment = razorpay_request('GET', 'payments/' . rawurlencode($paymentId), $config);
if (!in_array($payment['status'] ?? '', ['captured', 'authorized'], true)) {
    respond(400, ['success' => false, 'message' => 'We couldn’t confirm this payment. Please message us on WhatsApp.']);
}
$planKey = '';
if (!empty($payment['order_id'])) {
    $order = razorpay_request('GET', 'orders/' . rawurlencode($payment['order_id']), $config);
    $planKey = $order['notes']['plan'] ?? '';
}

$record = [
    'submitted' => gmdate('c'),
    'payment_id' => $paymentId,
    'plan' => SOCIAL_GROWTH_PLANS[$planKey]['name'] ?? '',
    'email' => (string) ($payment['email'] ?? ''),
    'phone' => (string) ($payment['contact'] ?? ''),
] + $details;

$line = json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
$saved = @file_put_contents(dirname(__DIR__, 3) . '/onboarding.jsonl', $line, FILE_APPEND | LOCK_EX) !== false;
if (!$saved) {
    error_log('Onboarding for ' . $paymentId . ' could not be written to the onboarding file.');
}
$sheeted = push_to_sheet($config, array_values($record));

if (!$saved && !$sheeted) {
    respond(503, ['success' => false, 'message' => 'We couldn’t save your details. Your answers are still here; please try again or message us on WhatsApp.']);
}
respond(200, ['success' => true]);
