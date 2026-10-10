<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Geçersiz istek.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Basit bot koruması: görünmez alan doluysa isteği sessizce kabul et.
if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['ok' => true]);
    exit;
}

$clean = static function ($value) {
    return trim(str_replace(["\r", "\n"], ' ', (string)$value));
};

$strlen = static function ($value) {
    $value = (string)$value;
    if (function_exists('mb_strlen')) return mb_strlen($value, 'UTF-8');
    if (function_exists('iconv_strlen')) return iconv_strlen($value, 'UTF-8');
    return strlen($value);
};

$adSoyad = $clean($_POST['adSoyad'] ?? '');
$firma   = $clean($_POST['firma'] ?? '');
$telefon = $clean($_POST['telefon'] ?? '');
$email   = filter_var($clean($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$urun    = $clean($_POST['urun'] ?? '');
$adet    = $clean($_POST['adet'] ?? '');
$mesaj   = trim((string)($_POST['mesaj'] ?? ''));
$kvkk    = isset($_POST['kvkk']);

$phoneValid = preg_match('/^[0-9\s()+\-]{10,}$/', $telefon) === 1;

if (
    $strlen($adSoyad) < 3 || $strlen($adSoyad) > 120 ||
    $strlen($firma) < 2 || $strlen($firma) > 160 ||
    !$phoneValid ||
    !$email ||
    $strlen($urun) < 2 || $strlen($urun) > 120 ||
    $strlen($adet) < 1 || $strlen($adet) > 40 ||
    $strlen($mesaj) < 10 || $strlen($mesaj) > 4000 ||
    !$kvkk
) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Lütfen zorunlu alanları kontrol edin.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$to = 'info@renkliis.com';
$subject = 'Web Sitesi Teklif Talebi - Renkli İş';
$body = "Yeni bir web sitesi teklif talebi geldi.\n\n" .
    "Ad Soyad: {$adSoyad}\n" .
    "Firma: {$firma}\n" .
    "Telefon: {$telefon}\n" .
    "E-posta: {$email}\n" .
    "Ürün: {$urun}\n" .
    "Tahmini Adet: {$adet}\n\n" .
    "Mesaj:\n{$mesaj}\n\n" .
    "KVKK onayı: Evet\n" .
    "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'bilinmiyor');

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Renkli İş Web Sitesi <info@renkliis.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail(
    $to,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers)
);

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Sunucu e-posta gönderimini kabul etmedi.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true]);
