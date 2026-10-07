<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$rawBody = file_get_contents('php://input');
$body = json_decode($rawBody ?: '', true);

if (!is_array($body) || !isset($body['email']) || !is_string($body['email'])) {
    respond(400, ['success' => false, 'message' => 'Please enter a valid email address.']);
}

$email = strtolower(trim($body['email']));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['success' => false, 'message' => 'Please enter a valid email address.']);
}

if (!function_exists('curl_init')) {
    respond(500, ['success' => false, 'message' => 'Newsletter service is temporarily unavailable.']);
}

$payload = json_encode([
    'email' => $email,
    'emailConsent' => true,
    'whatsappConsent' => false,
    'role' => 'other',
    'interest' => 'learning',
    'language' => 'english',
], JSON_UNESCAPED_SLASHES);

$request = curl_init('https://hybridai.in/api/subscribe');
curl_setopt_array($request, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 10,
]);

$responseBody = curl_exec($request);
$curlError = curl_error($request);
$status = (int) curl_getinfo($request, CURLINFO_HTTP_CODE);
curl_close($request);

if ($responseBody === false || $curlError !== '') {
    respond(502, ['success' => false, 'message' => 'Unable to reach the AI Campus newsletter right now. Please try again.']);
}

$response = json_decode($responseBody, true);
$upstreamMessage = is_array($response) && isset($response['message']) && is_string($response['message'])
    ? $response['message']
    : null;

if ($status >= 200 && $status < 300) {
    respond(200, ['success' => true, 'message' => 'You’re subscribed to AI Campus updates.']);
}

if ($status === 409) {
    respond(200, ['success' => true, 'alreadySubscribed' => true, 'message' => $upstreamMessage ?: 'You’re already subscribed to AI Campus updates.']);
}

if ($status >= 400 && $status < 500) {
    respond(400, ['success' => false, 'message' => $upstreamMessage ?: 'Please check your email address and try again.']);
}

respond(502, ['success' => false, 'message' => 'Unable to subscribe right now. Please try again later.']);
