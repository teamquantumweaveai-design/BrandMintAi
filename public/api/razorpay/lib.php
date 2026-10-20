<?php
declare(strict_types=1);

// Shared helpers for the Social Growth System checkout. Not an endpoint.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

// Prices are fixed here, never taken from the browser. Amounts are in paise and include 18% GST.
const SOCIAL_GROWTH_PLANS = [
    'starter' => ['name' => 'Starter Social', 'base' => 399900],
    'growth'  => ['name' => 'Growth Social',  'base' => 699900],
    'scale'   => ['name' => 'Scale Social',   'base' => 999900],
];
const GST_PERCENT = 18;

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function require_post_json(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['success' => false, 'message' => 'Method not allowed.']);
    }
    $body = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($body)) {
        respond(400, ['success' => false, 'message' => 'Invalid request.']);
    }
    return $body;
}

// Keys live outside the web root, in razorpay-config.php next to public_html:
//   <?php return ['key_id' => 'rzp_live_xxx', 'key_secret' => 'xxx'];
function razorpay_config(): array
{
    $candidates = array_filter([
        getenv('RAZORPAY_CONFIG') ?: null,
        dirname(__DIR__, 3) . '/razorpay-config.php',
    ]);
    foreach ($candidates as $path) {
        if (is_readable($path)) {
            $config = require $path;
            if (is_array($config) && !empty($config['key_id']) && !empty($config['key_secret'])) {
                return $config;
            }
        }
    }
    respond(503, ['success' => false, 'message' => 'Online payment isn’t available right now. Please message us on WhatsApp and we’ll send you a payment link.']);
}

function razorpay_request(string $method, string $path, array $config, ?array $body = null): array
{
    if (!function_exists('curl_init')) {
        respond(500, ['success' => false, 'message' => 'Payment service is temporarily unavailable.']);
    }
    $request = curl_init('https://api.razorpay.com/v1/' . $path);
    $options = [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_USERPWD => $config['key_id'] . ':' . $config['key_secret'],
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
    ];
    if ($body !== null) {
        $options[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_SLASHES);
    }
    curl_setopt_array($request, $options);
    $responseBody = curl_exec($request);
    $status = (int) curl_getinfo($request, CURLINFO_HTTP_CODE);
    curl_close($request);

    $data = is_string($responseBody) ? json_decode($responseBody, true) : null;
    if ($status < 200 || $status >= 300 || !is_array($data)) {
        error_log('Razorpay ' . $method . ' ' . $path . ' failed with HTTP ' . $status . ': ' . (is_string($responseBody) ? $responseBody : 'no response'));
        respond(502, ['success' => false, 'message' => 'We couldn’t reach the payment service. Please try again in a moment.']);
    }
    return $data;
}
