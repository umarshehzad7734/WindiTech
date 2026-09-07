<?php
/**
 * Windii Technologies — contact form handler for Apache/PHP shared hosting.
 *
 * This is the static-export counterpart to src/app/api/contact/route.ts. It
 * deliberately mirrors that route's behaviour so the React form works against
 * either backend without changes:
 *
 *   - the same validation rules as src/lib/validation.ts (zod)
 *   - the same honeypot handling: a filled trap returns 200 and discards, so a
 *     bot never learns which field is the trap
 *   - the same rate limiting: 5 submissions per IP per 10 minutes -> 429
 *   - the same JSON shapes: {"ok":true} / {"ok":false,"message":...,"errors":{...}}
 *
 * Requires PHP 7.4+.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $message, array $errors = [], int $status = 400): void
{
    $body = ['ok' => false, 'message' => $message];
    if ($errors) {
        $body['errors'] = $errors;
    }
    respond($status, $body);
}

/** Best-effort client identifier, matching clientKey() in src/lib/rate-limit.ts. */
function client_key(): string
{
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($parts[0]);
    }
    if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        return $_SERVER['HTTP_X_REAL_IP'];
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Fixed-window rate limiter backed by a file in the system temp directory.
 * Same policy as the Node version; like it, this is per-server and resets if
 * the file is cleared.
 */
function check_rate_limit(string $key, int $max, int $windowSec): array
{
    $path = sys_get_temp_dir() . '/windii-contact-rate.json';
    $now = time();

    $handle = @fopen($path, 'c+');
    if ($handle === false) {
        // Can't enforce a limit without a writable temp dir — fail open rather
        // than block real enquiries.
        return ['allowed' => true, 'retry_after' => 0];
    }

    @flock($handle, LOCK_EX);
    $raw = stream_get_contents($handle);
    $data = $raw ? json_decode($raw, true) : [];
    if (!is_array($data)) {
        $data = [];
    }

    // Drop expired entries so the file cannot grow without bound.
    foreach ($data as $k => $entry) {
        if (!isset($entry['reset_at']) || $entry['reset_at'] <= $now) {
            unset($data[$k]);
        }
    }

    $allowed = true;
    $retryAfter = 0;
    $id = hash('sha256', $key);

    if (!isset($data[$id])) {
        $data[$id] = ['count' => 1, 'reset_at' => $now + $windowSec];
    } elseif ($data[$id]['count'] >= $max) {
        $allowed = false;
        $retryAfter = max(1, $data[$id]['reset_at'] - $now);
    } else {
        $data[$id]['count']++;
    }

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($data));
    fflush($handle);
    @flock($handle, LOCK_UN);
    fclose($handle);

    return ['allowed' => $allowed, 'retry_after' => $retryAfter];
}

/** Strips CR/LF so user input can never inject extra mail headers. */
function header_safe(string $value): string
{
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $value));
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/* -------------------------------------------------------------------------- */
/* Request handling                                                            */
/* -------------------------------------------------------------------------- */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail('Method not allowed.', [], 405);
}

$configPath = __DIR__ . '/contact-config.php';
if (!is_file($configPath)) {
    error_log('[contact] contact-config.php is missing.');
    fail('We could not send your message. Please try again, or email us directly.', [], 502);
}
$config = require $configPath;

$rate = check_rate_limit(
    client_key(),
    (int) ($config['rate_limit_max'] ?? 5),
    (int) ($config['rate_limit_window_sec'] ?? 600)
);
if (!$rate['allowed']) {
    header('Retry-After: ' . $rate['retry_after']);
    fail(
        'Too many enquiries from this connection. Please try again shortly, or email us directly.',
        [],
        429
    );
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '', true);
if (!is_array($payload)) {
    fail('Malformed request.');
}

$field = static function (string $name) use ($payload): string {
    $value = $payload[$name] ?? '';
    return is_string($value) ? trim($value) : '';
};

$name    = $field('name');
$email   = $field('email');
$company = $field('company');
$phone   = $field('phone');
$subject = $field('subject');
$message = $field('message');
$website = $field('website'); // honeypot

/* Validation — kept in step with src/lib/validation.ts. */
$errors = [];

if (mb_strlen($name) < 2) {
    $errors['name'] = 'Please enter your name.';
} elseif (mb_strlen($name) > 100) {
    $errors['name'] = 'Name must be 100 characters or fewer.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
} elseif (mb_strlen($email) > 254) {
    $errors['email'] = 'Email address is too long.';
}

if (mb_strlen($company) > 120) {
    $errors['company'] = 'Company must be 120 characters or fewer.';
}

if (mb_strlen($phone) > 40) {
    $errors['phone'] = 'Phone must be 40 characters or fewer.';
}

if (mb_strlen($subject) < 3) {
    $errors['subject'] = 'Please enter a subject.';
} elseif (mb_strlen($subject) > 150) {
    $errors['subject'] = 'Subject must be 150 characters or fewer.';
}

if (mb_strlen($message) < 20) {
    $errors['message'] = 'Please give us at least 20 characters so we can help.';
} elseif (mb_strlen($message) > 5000) {
    $errors['message'] = 'Message must be 5000 characters or fewer.';
}

if ($errors) {
    fail('Please correct the highlighted fields and try again.', $errors);
}

// Honeypot: a filled hidden field means a bot. Answer 200 so it learns nothing.
if ($website !== '') {
    respond(200, ['ok' => true]);
}

/* -------------------------------------------------------------------------- */
/* Compose                                                                     */
/* -------------------------------------------------------------------------- */

$domain    = 'windiitechnologies.com';
$toEmail   = $config['to_email'] ?? 'info@windiitechnologies.com';
$fromEmail = $config['from_email'] ?? ('no-reply@' . $domain);
$fromName  = header_safe((string) ($config['from_name'] ?? 'Windii Technologies'));

$rows = [
    'Name'    => $name,
    'Email'   => $email,
    'Company' => $company !== '' ? $company : '—',
    'Phone'   => $phone !== '' ? $phone : '—',
    'Subject' => $subject,
];

$mailSubject = header_safe('[' . $domain . '] ' . $subject);

$textLines = ['New enquiry from ' . $domain, ''];
foreach ($rows as $label => $value) {
    $textLines[] = $label . ': ' . $value;
}
$textLines[] = '';
$textLines[] = 'Message:';
$textLines[] = $message;
$textBody = implode("\r\n", $textLines);

$rowsHtml = '';
foreach ($rows as $label => $value) {
    $rowsHtml .= '<tr>'
        . '<td style="padding:12px 24px;border-bottom:1px solid #e6ecef;color:#556672;width:110px;vertical-align:top">' . e($label) . '</td>'
        . '<td style="padding:12px 24px;border-bottom:1px solid #e6ecef;color:#0b0f12;font-weight:500">' . e($value) . '</td>'
        . '</tr>';
}

$htmlBody = '<!doctype html><html lang="en"><body style="margin:0;background:#f4f7f8;padding:24px;font-family:-apple-system,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#0b0f12">'
    . '<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #cfd8de;border-radius:12px;overflow:hidden">'
    . '<div style="background:#060809;padding:20px 24px">'
    . '<p style="margin:0;color:#00e58c;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:600">New website enquiry</p>'
    . '<p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:600">Windii Technologies</p>'
    . '</div>'
    . '<table style="width:100%;border-collapse:collapse;font-size:14px">' . $rowsHtml . '</table>'
    . '<div style="padding:20px 24px">'
    . '<p style="margin:0 0 8px;color:#556672;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:600">Message</p>'
    . '<p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">' . e($message) . '</p>'
    . '</div></div>'
    . '<p style="max-width:600px;margin:16px auto 0;color:#7a8b96;font-size:12px">Sent from the contact form on ' . e($domain) . '.</p>'
    . '</body></html>';

/* -------------------------------------------------------------------------- */
/* Send                                                                        */
/* -------------------------------------------------------------------------- */

$transport = $config['transport'] ?? 'mail';
$sent = false;
$failure = '';

if ($transport === 'resend') {
    $apiKey = (string) ($config['resend_api_key'] ?? '');
    if ($apiKey === '') {
        $failure = 'transport is "resend" but resend_api_key is empty';
    } elseif (!function_exists('curl_init')) {
        $failure = 'cURL is not available on this host';
    } else {
        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode([
                'from'     => $fromName . ' <' . $fromEmail . '>',
                'to'       => [$toEmail],
                'reply_to' => $email,
                'subject'  => $mailSubject,
                'text'     => $textBody,
                'html'     => $htmlBody,
            ]),
        ]);
        $response = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        if ($response === false) {
            $failure = 'curl error: ' . curl_error($ch);
        } elseif ($code >= 200 && $code < 300) {
            $sent = true;
        } else {
            $failure = 'resend responded ' . $code . ': ' . substr((string) $response, 0, 300);
        }
        curl_close($ch);
    }
} else {
    $boundary = 'windii-' . bin2hex(random_bytes(12));

    $headers = [
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . header_safe($name) . ' <' . header_safe($email) . '>',
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];

    $body = "--$boundary\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $textBody . "\r\n\r\n"
        . "--$boundary\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $htmlBody . "\r\n\r\n"
        . "--$boundary--";

    // -f sets the envelope sender, which materially improves deliverability.
    $sent = @mail(
        $toEmail,
        $mailSubject,
        $body,
        implode("\r\n", $headers),
        '-f' . $fromEmail
    );
    if (!$sent) {
        $failure = 'mail() returned false';
    }
}

if (!$sent) {
    // Log server-side; never leak transport details to the browser.
    error_log('[contact] send failed: ' . $failure);
    fail('We could not send your message. Please try again, or email us directly.', [], 502);
}

respond(200, ['ok' => true]);
