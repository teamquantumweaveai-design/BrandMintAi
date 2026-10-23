<?php
declare(strict_types=1);
ini_set('display_errors', '0'); require __DIR__ . '/lib.php';
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') { header('Allow: GET'); voice_json(405, ['success' => false]); }
$config = voice_config(); $key = (string) ($config['metrics_token'] ?? '');
$authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (strlen($key) < 32 || !hash_equals('Bearer ' . $key, $authorization)) voice_json(401, ['success' => false, 'message' => 'Valid private insights token required.']);
$path = voice_storage($config) . '/metrics.json';
$file = @fopen($path, 'r+'); $data = [];
if ($file && flock($file, LOCK_EX)) {
    $data = json_decode(stream_get_contents($file) ?: '{}', true) ?: [];
    $cutoff = gmdate('Y-m-d', time() - 90 * 86400);
    foreach (array_keys($data) as $day) if ($day < $cutoff) unset($data[$day]);
    rewind($file); ftruncate($file, 0); fwrite($file, json_encode($data)); fflush($file);
    flock($file, LOCK_UN);
}
if ($file) fclose($file);
krsort($data);
voice_json(200, ['success' => true, 'timezone' => 'UTC', 'retention_days' => 90, 'daily' => $data,
    'notes' => 'Anonymous aggregate counts only. Embedded calendar completions are browser reports; booking_confirmed is a server-confirmed Calendly API booking. Connection errors before a server session starts cannot be counted.']);
