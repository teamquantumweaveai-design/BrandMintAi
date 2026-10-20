<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';

$body = require_post_json();
$orderId = is_string($body['razorpay_order_id'] ?? null) ? $body['razorpay_order_id'] : '';
$paymentId = is_string($body['razorpay_payment_id'] ?? null) ? $body['razorpay_payment_id'] : '';
$signature = is_string($body['razorpay_signature'] ?? null) ? $body['razorpay_signature'] : '';

if ($orderId === '' || $paymentId === '' || $signature === '') {
    respond(400, ['success' => false, 'message' => 'Missing payment details.']);
}

$config = razorpay_config();
$expected = hash_hmac('sha256', $orderId . '|' . $paymentId, $config['key_secret']);
if (!hash_equals($expected, $signature)) {
    respond(400, ['success' => false, 'message' => 'We couldn’t confirm this payment. If money was deducted, message us on WhatsApp with your payment ID: ' . $paymentId]);
}

// Read the plan from the order we created, not from the browser.
$order = razorpay_request('GET', 'orders/' . rawurlencode($orderId), $config);
$planKey = $order['notes']['plan'] ?? '';

respond(200, [
    'success' => true,
    'plan' => isset(SOCIAL_GROWTH_PLANS[$planKey]) ? $planKey : '',
    'payment_id' => $paymentId,
]);
