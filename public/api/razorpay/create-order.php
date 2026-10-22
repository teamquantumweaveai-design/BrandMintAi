<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';

$body = require_post_json();
$planKey = is_string($body['plan'] ?? null) ? $body['plan'] : '';
if (!isset(SOCIAL_GROWTH_PLANS[$planKey])) {
    respond(400, ['success' => false, 'message' => 'Please choose a plan.']);
}

$plan = SOCIAL_GROWTH_PLANS[$planKey];
$gst = intdiv($plan['base'] * GST_PERCENT, 100);
$amount = $plan['base'] + $gst;
$config = razorpay_config();

$order = razorpay_request('POST', 'orders', $config, [
    'amount' => $amount,
    'currency' => 'INR',
    'receipt' => 'sg_' . $planKey . '_' . time(),
    'notes' => [
        'product' => 'Social Growth System',
        'plan' => $planKey,
        'plan_name' => $plan['name'],
        'base_amount_paise' => (string) $plan['base'],
        'gst_paise' => (string) $gst,
    ],
]);

respond(200, [
    'success' => true,
    'key_id' => $config['key_id'],
    'order_id' => $order['id'],
    'amount' => $amount,
    'currency' => 'INR',
    'description' => $plan['name'] . ' · first month (incl. 18% GST)',
]);
