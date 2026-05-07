<?php

declare(strict_types=1);

$config = require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

function json_response($data, int $status = 200)
{
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_SLASHES);
  exit;
}

function db(): PDO
{
  static $pdo = null;
  global $config;

  if ($pdo instanceof PDO) {
    return $pdo;
  }

  $dsn = sprintf(
    'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
    $config['db_host'],
    (int) $config['db_port'],
    $config['db_name'],
  );

  $pdo = new PDO($dsn, $config['db_user'], $config['db_password'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);

  return $pdo;
}

function read_json_body(): array
{
  $raw = file_get_contents('php://input');
  if ($raw === false || trim($raw) === '') {
    return [];
  }

  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : [];
}

function path_parts(): array
{
  $path = $_GET['path'] ?? '';

  if ($path === '') {
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '';
    $path = preg_replace('#^/?api/?#', '', $uriPath);
  }

  $path = trim((string) $path, '/');
  return $path === '' ? [] : explode('/', $path);
}

function uuid_v4(): string
{
  $data = random_bytes(16);
  $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
  $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function base64url_encode(string $value): string
{
  return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function base64url_decode(string $value)
{
  return base64_decode(strtr($value, '-_', '+/'));
}

function sign_token(array $admin): string
{
  global $config;

  $payload = [
    'adminId' => $admin['id'],
    'email' => $admin['email'],
    'exp' => time() + (7 * 24 * 60 * 60),
  ];

  $body = base64url_encode(json_encode($payload, JSON_UNESCAPED_SLASHES));
  $signature = base64url_encode(hash_hmac('sha256', $body, $config['jwt_secret'], true));

  return $body . '.' . $signature;
}

function verify_token(string $token): ?array
{
  global $config;

  $parts = explode('.', $token);
  if (count($parts) !== 2) {
    return null;
  }

  [$body, $signature] = $parts;
  $expected = base64url_encode(hash_hmac('sha256', $body, $config['jwt_secret'], true));

  if (!hash_equals($expected, $signature)) {
    return null;
  }

  $payloadJson = base64url_decode($body);
  if ($payloadJson === false) {
    return null;
  }

  $payload = json_decode($payloadJson, true);
  if (!is_array($payload) || (int) ($payload['exp'] ?? 0) < time()) {
    return null;
  }

  return $payload;
}

function bearer_token(): string
{
  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $auth = $_SERVER['HTTP_AUTHORIZATION']
    ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
    ?? $headers['Authorization']
    ?? $headers['authorization']
    ?? '';

  return strpos($auth, 'Bearer ') === 0 ? substr($auth, 7) : '';
}

function require_admin(): array
{
  $payload = verify_token(bearer_token());
  if (!$payload || empty($payload['adminId'])) {
    json_response(['message' => 'Unauthorized.'], 401);
  }

  $stmt = db()->prepare('SELECT id, email, name FROM admins WHERE id = ? LIMIT 1');
  $stmt->execute([$payload['adminId']]);
  $admin = $stmt->fetch();

  if (!$admin) {
    json_response(['message' => 'Unauthorized.'], 401);
  }

  return $admin;
}

function fetch_all(string $sql, array $params = []): array
{
  $stmt = db()->prepare($sql);
  $stmt->execute($params);
  return $stmt->fetchAll();
}

function fetch_one(string $sql, array $params = []): ?array
{
  $stmt = db()->prepare($sql);
  $stmt->execute($params);
  $row = $stmt->fetch();
  return $row ?: null;
}

function execute_sql(string $sql, array $params = []): int
{
  $stmt = db()->prepare($sql);
  $stmt->execute($params);
  return $stmt->rowCount();
}

function decode_json_field(?string $value)
{
  if ($value === null || $value === '') {
    return null;
  }

  $decoded = json_decode($value, true);
  return json_last_error() === JSON_ERROR_NONE ? $decoded : null;
}

function map_tour(array $row): array
{
  $row['inclusions'] = decode_json_field($row['inclusions'] ?? null);
  $row['itinerary'] = decode_json_field($row['itinerary'] ?? null);
  return $row;
}

function map_enquiry(array $row): array
{
  if (!empty($row['travel_date'])) {
    $row['travel_date'] = substr((string) $row['travel_date'], 0, 10);
  }

  return $row;
}

function tour_select(): string
{
  return 'SELECT id, name, duration, price, category, description, image_url, inclusions, itinerary, created_at, updated_at FROM tours';
}

function service_select(): string
{
  return 'SELECT id, title, description, icon, created_at, updated_at FROM services';
}

function enquiry_select(): string
{
  return 'SELECT id, name, email, phone, destination, message, travel_date, status, created_at FROM enquiries';
}

function validate_tour(array $payload): ?string
{
  if (trim((string) ($payload['name'] ?? '')) === '') return 'Tour name is required.';
  if (trim((string) ($payload['duration'] ?? '')) === '') return 'Tour duration is required.';
  if (trim((string) ($payload['price'] ?? '')) === '') return 'Tour price is required.';
  if (trim((string) ($payload['category'] ?? '')) === '') return 'Tour category is required.';
  return null;
}

try {
  $method = $_SERVER['REQUEST_METHOD'];
  $parts = path_parts();
  $path = implode('/', $parts);

  if ($method === 'GET' && $path === 'health') {
    db()->query('SELECT 1 AS ok');
    json_response(['ok' => true, 'database' => $config['db_name']]);
  }

  if ($method === 'POST' && $path === 'admin/login') {
    $body = read_json_body();
    $email = strtolower(trim((string) ($body['email'] ?? '')));
    $password = (string) ($body['password'] ?? '');

    if ($email === '' || $password === '') {
      json_response(['message' => 'Email and password are required.'], 400);
    }

    $admin = fetch_one('SELECT id, email, name, password_hash FROM admins WHERE email = ? LIMIT 1', [$email]);
    if (!$admin || !password_verify($password, $admin['password_hash'])) {
      json_response(['message' => 'Invalid email or password.'], 401);
    }

    json_response([
      'token' => sign_token($admin),
      'admin' => [
        'id' => $admin['id'],
        'email' => $admin['email'],
        'name' => $admin['name'],
      ],
    ]);
  }

  if ($method === 'GET' && $path === 'admin/me') {
    json_response(['admin' => require_admin()]);
  }

  if ($method === 'GET' && $path === 'admin/dashboard') {
    require_admin();
    json_response([
      'tours' => (int) fetch_one('SELECT COUNT(*) AS count FROM tours')['count'],
      'services' => (int) fetch_one('SELECT COUNT(*) AS count FROM services')['count'],
      'enquiries' => (int) fetch_one('SELECT COUNT(*) AS count FROM enquiries')['count'],
      'newEnquiries' => (int) fetch_one("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'new'")['count'],
    ]);
  }

  if ($method === 'POST' && $path === 'admin/uploads/tour-image') {
    require_admin();

    if (empty($_FILES['image']) || !is_uploaded_file($_FILES['image']['tmp_name'])) {
      json_response(['message' => 'Please choose an image file.'], 400);
    }

    $file = $_FILES['image'];
    $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
    $mimeType = mime_content_type($file['tmp_name']) ?: '';

    if (!in_array($extension, ['png', 'jpg', 'jpeg'], true) || !in_array($mimeType, ['image/png', 'image/jpeg'], true)) {
      json_response(['message' => 'Only PNG, JPG, and JPEG images are allowed.'], 400);
    }

    if ((int) $file['size'] > 4 * 1024 * 1024) {
      json_response(['message' => 'Image is too large. Please upload a file smaller than 4 MB.'], 400);
    }

    $id = uuid_v4();
    $content = file_get_contents($file['tmp_name']);
    $stmt = db()->prepare('INSERT INTO media_uploads (id, file_name, mime_type, byte_size, content) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$id, $file['name'], $mimeType, (int) $file['size'], $content]);

    json_response(['url' => '/api/uploads/' . $id, 'uploadId' => $id], 201);
  }

  if ($method === 'GET' && ($parts[0] ?? '') === 'uploads' && !empty($parts[1])) {
    $upload = fetch_one('SELECT file_name, mime_type, byte_size, content FROM media_uploads WHERE id = ? LIMIT 1', [$parts[1]]);
    if (!$upload) {
      json_response(['message' => 'Image not found.'], 404);
    }

    header('Content-Type: ' . $upload['mime_type']);
    header('Content-Length: ' . (string) $upload['byte_size']);
    header('Content-Disposition: inline; filename="' . rawurlencode($upload['file_name']) . '"');
    header('Cache-Control: public, max-age=31536000, immutable');
    echo $upload['content'];
    exit;
  }

  if ($method === 'GET' && $path === 'tours') {
    $rows = fetch_all(tour_select() . ' ORDER BY created_at DESC');
    json_response(['tours' => array_map('map_tour', $rows)]);
  }

  if ($method === 'GET' && ($parts[0] ?? '') === 'tours' && !empty($parts[1])) {
    $tour = fetch_one(tour_select() . ' WHERE id = ? LIMIT 1', [$parts[1]]);
    $tour ? json_response(['tour' => map_tour($tour)]) : json_response(['message' => 'Tour not found.'], 404);
  }

  if ($method === 'POST' && $path === 'admin/tours') {
    require_admin();
    $body = read_json_body();
    $error = validate_tour($body);
    if ($error) json_response(['message' => $error], 400);

    $id = uuid_v4();
    execute_sql(
      'INSERT INTO tours (id, name, duration, price, category, description, image_url, inclusions, itinerary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        $id,
        trim((string) $body['name']),
        trim((string) $body['duration']),
        trim((string) $body['price']),
        trim((string) $body['category']),
        $body['description'] ?? null,
        $body['image_url'] ?? null,
        isset($body['inclusions']) ? json_encode($body['inclusions'], JSON_UNESCAPED_SLASHES) : null,
        isset($body['itinerary']) ? json_encode($body['itinerary'], JSON_UNESCAPED_SLASHES) : null,
      ],
    );

    json_response(['tour' => map_tour(fetch_one(tour_select() . ' WHERE id = ? LIMIT 1', [$id]))], 201);
  }

  if ($method === 'PUT' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'tours' && !empty($parts[2])) {
    require_admin();
    $body = read_json_body();
    $error = validate_tour($body);
    if ($error) json_response(['message' => $error], 400);

    $count = execute_sql(
      'UPDATE tours SET name = ?, duration = ?, price = ?, category = ?, description = ?, image_url = ?, inclusions = ?, itinerary = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        trim((string) $body['name']),
        trim((string) $body['duration']),
        trim((string) $body['price']),
        trim((string) $body['category']),
        $body['description'] ?? null,
        $body['image_url'] ?? null,
        isset($body['inclusions']) ? json_encode($body['inclusions'], JSON_UNESCAPED_SLASHES) : null,
        isset($body['itinerary']) ? json_encode($body['itinerary'], JSON_UNESCAPED_SLASHES) : null,
        $parts[2],
      ],
    );

    if ($count < 1) json_response(['message' => 'Tour not found.'], 404);
    $updatedTour = fetch_one(tour_select() . ' WHERE id = ? LIMIT 1', [$parts[2]]);
    json_response(['tour' => map_tour($updatedTour)]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'tours' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM tours WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Tour not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'GET' && $path === 'services') {
    json_response(['services' => fetch_all(service_select() . ' ORDER BY created_at ASC')]);
  }

  if ($method === 'POST' && $path === 'admin/services') {
    require_admin();
    $body = read_json_body();
    $title = trim((string) ($body['title'] ?? ''));
    if ($title === '') json_response(['message' => 'Service title is required.'], 400);

    $id = uuid_v4();
    execute_sql('INSERT INTO services (id, title, description, icon) VALUES (?, ?, ?, ?)', [
      $id,
      $title,
      $body['description'] ?? null,
      $body['icon'] ?? 'Plane',
    ]);
    json_response(['service' => fetch_one(service_select() . ' WHERE id = ? LIMIT 1', [$id])], 201);
  }

  if ($method === 'PUT' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'services' && !empty($parts[2])) {
    require_admin();
    $body = read_json_body();
    $title = trim((string) ($body['title'] ?? ''));
    if ($title === '') json_response(['message' => 'Service title is required.'], 400);

    $count = execute_sql('UPDATE services SET title = ?, description = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      $title,
      $body['description'] ?? null,
      $body['icon'] ?? 'Plane',
      $parts[2],
    ]);
    if ($count < 1) json_response(['message' => 'Service not found.'], 404);
    $updatedService = fetch_one(service_select() . ' WHERE id = ? LIMIT 1', [$parts[2]]);
    json_response(['service' => $updatedService]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'services' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM services WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Service not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'POST' && $path === 'enquiries') {
    $body = read_json_body();
    $name = trim((string) ($body['name'] ?? ''));
    $phone = trim((string) ($body['phone'] ?? ''));
    if ($name === '' || $phone === '') json_response(['message' => 'Name and phone are required.'], 400);

    $id = uuid_v4();
    $status = in_array(($body['status'] ?? ''), ['new', 'contacted', 'closed'], true) ? $body['status'] : 'new';
    execute_sql('INSERT INTO enquiries (id, name, email, phone, destination, message, travel_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      $id,
      $name,
      $body['email'] ?? null,
      $phone,
      $body['destination'] ?? null,
      $body['message'] ?? null,
      $body['travel_date'] ?? null,
      $status,
    ]);
    json_response(['enquiry' => map_enquiry(fetch_one(enquiry_select() . ' WHERE id = ? LIMIT 1', [$id]))], 201);
  }

  if ($method === 'GET' && $path === 'admin/enquiries') {
    require_admin();
    $rows = fetch_all(enquiry_select() . ' ORDER BY created_at DESC');
    json_response(['enquiries' => array_map('map_enquiry', $rows)]);
  }

  if ($method === 'PATCH' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'enquiries' && !empty($parts[2]) && ($parts[3] ?? '') === 'status') {
    require_admin();
    $body = read_json_body();
    $status = (string) ($body['status'] ?? '');
    if (!in_array($status, ['new', 'contacted', 'closed'], true)) json_response(['message' => 'Invalid enquiry status.'], 400);

    $count = execute_sql('UPDATE enquiries SET status = ? WHERE id = ?', [$status, $parts[2]]);
    if ($count < 1) json_response(['message' => 'Enquiry not found.'], 404);
    $updatedEnquiry = fetch_one(enquiry_select() . ' WHERE id = ? LIMIT 1', [$parts[2]]);
    json_response(['enquiry' => map_enquiry($updatedEnquiry)]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'enquiries' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM enquiries WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Enquiry not found.'], 404) : json_response(null, 204);
  }

  json_response(['message' => 'Route not found.'], 404);
} catch (Throwable $error) {
  json_response(['message' => $error->getMessage()], 500);
}
