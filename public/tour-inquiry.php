<?php
declare(strict_types=1);

/**
 * AfghanTours inquiry handler (cPanel / PHP hosts).
 * Dual path: this script OR an external PUBLIC_FORM_ENDPOINT.
 * Static-only hosts will not execute PHP — configure FORM_ENDPOINT instead.
 *
 * Hardening: honeypot, length bounds, header-injection stripping, method check.
 * Deliverability of mail() is NOT proven until an inbox test (see docs/INQUIRY-TEST-PLAN.md).
 */

const TO_ADDRESS = 'info@afghantours.com';
const FROM_ADDRESS = 'info@afghantours.com';
const MAX_LEN = [
    'name' => 120,
    'email' => 160,
    'whatsapp' => 40,
    'country' => 80,
    'tour_name' => 200,
    'tour_slug' => 120,
    'tour_code' => 40,
    'tour_url' => 400,
    'departure' => 80,
    'travel_dates' => 200,
    'flexibility' => 120,
    'travelers' => 40,
    'group_size' => 40,
    'accommodation' => 200,
    'transport' => 200,
    'activities' => 400,
    'cultural_interests' => 400,
    'notes' => 4000,
    'message' => 4000,
    'audience' => 80,
    'flow' => 40,
    'subject' => 200,
    'source_url' => 400,
];

function wants_json(): bool {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    return str_contains($accept, 'application/json')
        || (($_POST['_response'] ?? '') === 'json')
        || (($_GET['format'] ?? '') === 'json');
}

function respond(int $code, string $message, bool $ok = false): never {
    http_response_code($code);
    if (wants_json()) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($ok) {
        header('Content-Type: text/html; charset=UTF-8');
        echo '<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Inquiry received | AfghanTours</title><style>body{margin:0;background:#0e1815;color:#fff;font:16px/1.6 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;padding:2rem}main{max-width:640px;background:#fffdf8;color:#101820;padding:2rem;border-radius:24px;text-align:center}a{display:inline-block;margin-top:1rem;background:#0e1815;color:#fff;text-decoration:none;padding:.75rem 1rem;border-radius:999px;font-weight:800}</style></head><body><main><h1>Thank you.</h1><p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p><p style="font-size:.9rem;opacity:.8">An inquiry is not a booking. We will reply using the contact details you provided.</p><a href="/contact/">Back to contact</a> <a href="/tours/">Tours</a></main></body></html>';
        exit;
    }
    header('Content-Type: text/plain; charset=UTF-8');
    echo $message;
    exit;
}

function field(string $name): string {
    $raw = trim((string)($_POST[$name] ?? ''));
    $max = MAX_LEN[$name] ?? 500;
    if (strlen($raw) > $max) {
        $raw = substr($raw, 0, $max);
    }
    return $raw;
}

/** Strip CR/LF and other header-injection vectors from values used in mail headers. */
function safe_header_value(string $value): string {
    return str_replace(["\r", "\n", "\0"], '', $value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, 'Method not allowed');
}

// Honeypot: bots often fill hidden fields.
if (field('website') !== '' || field('company_url') !== '') {
    // Silent success to avoid teaching bots.
    respond(204, '', true);
}

$name = field('name');
$email = field('email');
$whatsapp = field('whatsapp');
$tourName = field('tour_name') !== '' ? field('tour_name') : field('tourName');
if ($tourName === '') {
    $tourName = field('tour');
}
$flow = field('flow') !== '' ? field('flow') : 'general';

if ($name === '') {
    respond(400, 'Please provide your name.');
}
if ($email === '' && $whatsapp === '') {
    respond(400, 'Please provide an email address or WhatsApp number.');
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, 'Please provide a valid email address.');
}

$subjectTour = $tourName !== '' ? $tourName : ($flow === 'custom' ? 'Custom journey' : 'General contact');
$subject = safe_header_value('AfghanTours inquiry: ' . $subjectTour);
if (strlen($subject) > 180) {
    $subject = substr($subject, 0, 180);
}

$travelers = field('travelers') !== '' ? field('travelers') : field('group_size');

$lines = [
    'New AfghanTours website inquiry',
    '',
    'Flow: ' . $flow,
    'Tour: ' . $tourName,
    'Tour slug: ' . field('tour_slug'),
    'Tour code: ' . field('tour_code'),
    'Tour URL: ' . field('tour_url'),
    'Departure: ' . field('departure'),
    'Audience: ' . field('audience'),
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'WhatsApp: ' . $whatsapp,
    'Country: ' . field('country'),
    'Preferred dates: ' . field('travel_dates'),
    'Flexibility: ' . field('flexibility'),
    'Travelers: ' . $travelers,
    'Accommodation preference: ' . field('accommodation'),
    'Transport preference: ' . field('transport'),
    'Activities: ' . field('activities'),
    'Cultural interests: ' . field('cultural_interests'),
    '',
    'Notes / message:',
    field('notes') !== '' ? field('notes') : field('message'),
    '',
    'Source URL: ' . field('source_url'),
];

$replyTo = $email !== '' ? safe_header_value($email) : FROM_ADDRESS;
$headers = [
    'From: AfghanTours Website <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $replyTo,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: AfghanTours-Inquiry/WG2',
];

$sent = @mail(TO_ADDRESS, $subject, implode("\n", $lines), implode("\r\n", $headers));

if (!$sent) {
    respond(500, 'Your inquiry could not be sent from the server. Please email ' . TO_ADDRESS . ' or use WhatsApp.');
}

respond(200, 'Your inquiry has been submitted to AfghanTours. We will reply using the contact information you provided.', true);
