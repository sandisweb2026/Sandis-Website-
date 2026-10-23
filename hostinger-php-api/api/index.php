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

const ENQUIRY_SUBMISSION_KEY = 'd0800d02-8089-408a-8028-d05c953746a6';
const VALID_BANNER_PAGES = ['home', 'holidays', 'holiday-detail', 'about', 'contact', 'gallery'];
const VALID_ENQUIRY_STATUSES = ['new', 'contacted', 'closed'];

function json_response($data, int $status = 200): void
{
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');

  if ($status === 204) {
    exit;
  }

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

function to_trimmed_string($value): string
{
  return trim((string) ($value ?? ''));
}

function to_nullable_string($value): ?string
{
  $trimmed = to_trimmed_string($value);
  return $trimmed === '' ? null : $trimmed;
}

function to_int($value, int $fallback = 0): int
{
  $parsed = filter_var($value, FILTER_VALIDATE_INT);
  return $parsed === false ? $fallback : (int) $parsed;
}

function normalize_boolean_input($value, bool $fallback = true): bool
{
  if ($value === null || $value === '') {
    return $fallback;
  }

  if (is_bool($value)) {
    return $value;
  }

  $normalized = strtolower(trim((string) $value));
  return in_array($normalized, ['1', 'true', 'yes', 'on'], true);
}

function to_db_boolean(bool $value): int
{
  return $value ? 1 : 0;
}

function from_db_boolean($value): bool
{
  return (int) $value === 1;
}

function slugify(string $value): string
{
  $value = strtolower(trim($value));
  $value = preg_replace('/[^\p{L}\p{N}\s-]+/u', '', $value) ?? '';
  $value = preg_replace('/[\s_-]+/', '-', $value) ?? '';
  $value = trim($value, '-');
  return $value === '' ? 'item' : $value;
}

function ensure_unique_slug(string $table, string $column, string $desiredSlug, ?string $excludeId = null): string
{
  $base = slugify($desiredSlug);
  $candidate = $base;
  $counter = 1;

  while (true) {
    $sql = "SELECT id FROM {$table} WHERE {$column} = ?";
    $params = [$candidate];

    if ($excludeId !== null) {
      $sql .= ' AND id != ?';
      $params[] = $excludeId;
    }

    $sql .= ' LIMIT 1';

    $row = fetch_one($sql, $params);
    if (!$row) {
      return $candidate;
    }

    $candidate = $base . '-' . $counter;
    $counter += 1;
  }
}

function decode_json_field(?string $value)
{
  if ($value === null || $value === '') {
    return null;
  }

  $decoded = json_decode($value, true);
  return json_last_error() === JSON_ERROR_NONE ? $decoded : null;
}

function normalize_string_list($value): array
{
  if (!is_array($value)) {
    return [];
  }

  $result = [];
  foreach ($value as $item) {
    $trimmed = to_trimmed_string($item);
    if ($trimmed !== '') {
      $result[] = $trimmed;
    }
  }

  return $result;
}

function normalize_itinerary($value): array
{
  if (!is_array($value)) {
    return [];
  }

  $result = [];
  foreach ($value as $index => $item) {
    if (!is_array($item)) {
      continue;
    }

    $day = to_trimmed_string($item['day'] ?? $item['day_label'] ?? ('Day ' . ($index + 1)));
    $title = to_trimmed_string($item['title'] ?? '');
    $description = to_trimmed_string($item['description'] ?? '');

    if ($title === '' && $description === '') {
      continue;
    }

    $result[] = [
      'day' => $day,
      'title' => $title,
      'description' => $description === '' ? null : $description,
    ];
  }

  return $result;
}

function normalize_gallery_items($value): array
{
  if (!is_array($value)) {
    return [];
  }

  $result = [];
  foreach ($value as $index => $item) {
    if (is_string($item)) {
      $imageUrl = to_trimmed_string($item);
      if ($imageUrl === '') {
        continue;
      }

      $result[] = [
        'image_url' => $imageUrl,
        'title' => null,
        'alt_text' => null,
        'display_order' => $index,
        'is_active' => true,
      ];
      continue;
    }

    if (!is_array($item)) {
      continue;
    }

    $imageUrl = to_trimmed_string($item['image_url'] ?? $item['url'] ?? '');
    if ($imageUrl === '') {
      continue;
    }

    $result[] = [
      'image_url' => $imageUrl,
      'title' => to_nullable_string($item['title'] ?? null),
      'alt_text' => to_nullable_string($item['alt_text'] ?? null),
      'display_order' => to_int($item['display_order'] ?? $index, $index),
      'is_active' => normalize_boolean_input($item['is_active'] ?? true, true),
    ];
  }

  return $result;
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

function map_banner(array $row): array
{
  return [
    'id' => $row['id'],
    'page_key' => $row['page_key'],
    'title' => $row['title'],
    'subtitle' => $row['subtitle'],
    'image_url' => $row['image_url'],
    'mobile_image_url' => $row['mobile_image_url'],
    'cta_label' => $row['cta_label'],
    'cta_link' => $row['cta_link'],
    'display_order' => (int) ($row['display_order'] ?? 0),
    'is_active' => from_db_boolean($row['is_active']),
    'created_at' => $row['created_at'],
    'updated_at' => $row['updated_at'],
  ];
}

function map_category(array $row): array
{
  return [
    'id' => $row['id'],
    'name' => $row['name'],
    'slug' => $row['slug'],
    'description' => $row['description'],
    'display_order' => (int) ($row['display_order'] ?? 0),
    'is_active' => from_db_boolean($row['is_active']),
    'created_at' => $row['created_at'],
    'updated_at' => $row['updated_at'],
  ];
}

function map_gallery_image(array $row): array
{
  return [
    'id' => $row['id'],
    'image_url' => $row['image_url'],
    'title' => $row['title'],
    'category' => $row['category'],
    'alt_text' => $row['alt_text'],
    'display_order' => (int) ($row['display_order'] ?? 0),
    'is_active' => from_db_boolean($row['is_active']),
    'created_at' => $row['created_at'],
    'updated_at' => $row['updated_at'],
  ];
}

function package_base_select(): string
{
  return "
    SELECT
      p.id,
      p.title,
      p.slug,
      p.location,
      p.banner_image_url,
      (
        SELECT pgi.image_url
        FROM package_gallery_images pgi
        WHERE pgi.package_id = p.id
          AND pgi.is_active = 1
        ORDER BY pgi.display_order ASC, pgi.created_at ASC
        LIMIT 1
      ) AS hero_image_url,
      p.short_description,
      p.duration,
      p.trip_type,
      p.price_label,
      p.about_tour,
      p.good_for_title,
      p.good_for_description,
      p.vehicles_title,
      p.vehicles_description,
      p.attraction_title,
      p.attraction_description,
      p.comfort_title,
      p.comfort_description,
      p.whatsapp_enquiry_message,
      p.email_enquiry_subject,
      p.email_enquiry_message,
      p.seo_title,
      p.seo_description,
      p.is_active,
      p.created_at,
      p.updated_at,
      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      c.description AS category_description
    FROM holiday_packages p
    INNER JOIN holiday_categories c ON c.id = p.category_id
  ";
}

function map_package_base(array $row): array
{
  return [
    'id' => $row['id'],
    'title' => $row['title'],
    'slug' => $row['slug'],
    'location' => $row['location'],
    'banner_image_url' => $row['banner_image_url'],
    'hero_image_url' => $row['hero_image_url'] ?? null,
    'short_description' => $row['short_description'],
    'duration' => $row['duration'],
    'trip_type' => $row['trip_type'],
    'price_label' => $row['price_label'],
    'about_tour' => $row['about_tour'],
    'good_for_title' => $row['good_for_title'],
    'good_for_description' => $row['good_for_description'],
    'vehicles_title' => $row['vehicles_title'],
    'vehicles_description' => $row['vehicles_description'],
    'attraction_title' => $row['attraction_title'],
    'attraction_description' => $row['attraction_description'],
    'comfort_title' => $row['comfort_title'],
    'comfort_description' => $row['comfort_description'],
    'whatsapp_enquiry_message' => $row['whatsapp_enquiry_message'],
    'email_enquiry_subject' => $row['email_enquiry_subject'],
    'email_enquiry_message' => $row['email_enquiry_message'],
    'seo_title' => $row['seo_title'],
    'seo_description' => $row['seo_description'],
    'is_active' => from_db_boolean($row['is_active']),
    'created_at' => $row['created_at'],
    'updated_at' => $row['updated_at'],
    'category' => [
      'id' => $row['category_id'],
      'name' => $row['category_name'],
      'slug' => $row['category_slug'],
      'description' => $row['category_description'],
    ],
  ];
}

function pick_hero_image_url(array $row, array $collections): ?string
{
  if (!empty($row['banner_image_url'])) {
    return $row['banner_image_url'];
  }

  foreach ($collections['gallery_images'] as $item) {
    if (($item['is_active'] ?? false) !== false) {
      return $item['image_url'];
    }
  }

  return null;
}

function fetch_package_collections(string $packageId): array
{
  $itineraryRows = fetch_all(
    'SELECT day_label, title, description, display_order FROM package_itinerary WHERE package_id = ? ORDER BY display_order ASC, created_at ASC',
    [$packageId],
  );
  $highlightsRows = fetch_all(
    'SELECT item_text FROM package_highlights WHERE package_id = ? ORDER BY display_order ASC, created_at ASC',
    [$packageId],
  );
  $includedRows = fetch_all(
    'SELECT item_text FROM package_included_items WHERE package_id = ? ORDER BY display_order ASC, created_at ASC',
    [$packageId],
  );
  $excludedRows = fetch_all(
    'SELECT item_text FROM package_excluded_items WHERE package_id = ? ORDER BY display_order ASC, created_at ASC',
    [$packageId],
  );
  $termsRows = fetch_all(
    'SELECT item_text FROM package_terms WHERE package_id = ? ORDER BY display_order ASC, created_at ASC',
    [$packageId],
  );
  $galleryRows = fetch_all(
    'SELECT id, image_url, title, alt_text, display_order, is_active FROM package_gallery_images WHERE package_id = ? ORDER BY display_order ASC, created_at ASC',
    [$packageId],
  );

  return [
    'itinerary' => array_map(static function (array $item): array {
      return [
        'day' => $item['day_label'],
        'title' => $item['title'],
        'description' => $item['description'],
        'display_order' => (int) ($item['display_order'] ?? 0),
      ];
    }, $itineraryRows),
    'highlights' => array_map(static fn(array $item): string => $item['item_text'], $highlightsRows),
    'included_items' => array_map(static fn(array $item): string => $item['item_text'], $includedRows),
    'excluded_items' => array_map(static fn(array $item): string => $item['item_text'], $excludedRows),
    'terms' => array_map(static fn(array $item): string => $item['item_text'], $termsRows),
    'gallery_images' => array_map(static function (array $item): array {
      return [
        'id' => $item['id'],
        'image_url' => $item['image_url'],
        'title' => $item['title'],
        'alt_text' => $item['alt_text'],
        'display_order' => (int) ($item['display_order'] ?? 0),
        'is_active' => from_db_boolean($item['is_active']),
      ];
    }, $galleryRows),
  ];
}

function build_package_response(array $row): array
{
  $collections = fetch_package_collections($row['id']);

  return array_merge(
    map_package_base($row),
    ['hero_image_url' => pick_hero_image_url($row, $collections)],
    $collections,
  );
}

function query_single_package_by_id(string $id): ?array
{
  return fetch_one(package_base_select() . ' WHERE p.id = ? LIMIT 1', [$id]);
}

function query_single_package_by_slug(string $slug, bool $includeInactive = false): ?array
{
  $sql = package_base_select() . ' WHERE p.slug = ?';
  $params = [$slug];

  if (!$includeInactive) {
    $sql .= ' AND p.is_active = 1';
  }

  $sql .= ' LIMIT 1';
  return fetch_one($sql, $params);
}

function replace_package_collections(string $packageId, array $payload): void
{
  execute_sql('DELETE FROM package_itinerary WHERE package_id = ?', [$packageId]);
  execute_sql('DELETE FROM package_highlights WHERE package_id = ?', [$packageId]);
  execute_sql('DELETE FROM package_included_items WHERE package_id = ?', [$packageId]);
  execute_sql('DELETE FROM package_excluded_items WHERE package_id = ?', [$packageId]);
  execute_sql('DELETE FROM package_terms WHERE package_id = ?', [$packageId]);
  execute_sql('DELETE FROM package_gallery_images WHERE package_id = ?', [$packageId]);

  foreach ($payload['itinerary'] as $index => $item) {
    execute_sql(
      'INSERT INTO package_itinerary (id, package_id, day_label, title, description, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [
        uuid_v4(),
        $packageId,
        $item['day'],
        $item['title'],
        $item['description'],
        $index,
      ],
    );
  }

  foreach ($payload['highlights'] as $index => $itemText) {
    execute_sql(
      'INSERT INTO package_highlights (id, package_id, item_text, display_order) VALUES (?, ?, ?, ?)',
      [uuid_v4(), $packageId, $itemText, $index],
    );
  }

  foreach ($payload['included_items'] as $index => $itemText) {
    execute_sql(
      'INSERT INTO package_included_items (id, package_id, item_text, display_order) VALUES (?, ?, ?, ?)',
      [uuid_v4(), $packageId, $itemText, $index],
    );
  }

  foreach ($payload['excluded_items'] as $index => $itemText) {
    execute_sql(
      'INSERT INTO package_excluded_items (id, package_id, item_text, display_order) VALUES (?, ?, ?, ?)',
      [uuid_v4(), $packageId, $itemText, $index],
    );
  }

  foreach ($payload['terms'] as $index => $itemText) {
    execute_sql(
      'INSERT INTO package_terms (id, package_id, item_text, display_order) VALUES (?, ?, ?, ?)',
      [uuid_v4(), $packageId, $itemText, $index],
    );
  }

  foreach ($payload['gallery_images'] as $index => $item) {
    execute_sql(
      'INSERT INTO package_gallery_images (id, package_id, image_url, title, alt_text, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        uuid_v4(),
        $packageId,
        $item['image_url'],
        $item['title'],
        $item['alt_text'],
        to_int($item['display_order'] ?? $index, $index),
        to_db_boolean((bool) $item['is_active']),
      ],
    );
  }
}

function parse_package_payload(array $body): array
{
  $title = to_trimmed_string($body['title'] ?? $body['package_title'] ?? '');
  $categoryId = to_trimmed_string($body['category_id'] ?? $body['categoryId'] ?? '');

  if ($title === '') {
    return ['error' => 'Package title is required.'];
  }

  if ($categoryId === '') {
    return ['error' => 'Category is required.'];
  }

  return [
    'value' => [
      'title' => $title,
      'slug' => to_trimmed_string($body['slug'] ?? ''),
      'category_id' => $categoryId,
      'location' => to_nullable_string($body['location'] ?? null),
      'banner_image_url' => to_nullable_string($body['banner_image_url'] ?? null),
      'short_description' => to_nullable_string($body['short_description'] ?? null),
      'duration' => to_nullable_string($body['duration'] ?? null),
      'trip_type' => to_nullable_string($body['trip_type'] ?? null),
      'price_label' => to_nullable_string($body['price_label'] ?? $body['price'] ?? null),
      'about_tour' => to_nullable_string($body['about_tour'] ?? null),
      'good_for_title' => to_nullable_string($body['good_for_title'] ?? null),
      'good_for_description' => to_nullable_string($body['good_for_description'] ?? null),
      'vehicles_title' => to_nullable_string($body['vehicles_title'] ?? null),
      'vehicles_description' => to_nullable_string($body['vehicles_description'] ?? null),
      'attraction_title' => to_nullable_string($body['attraction_title'] ?? null),
      'attraction_description' => to_nullable_string($body['attraction_description'] ?? null),
      'comfort_title' => to_nullable_string($body['comfort_title'] ?? null),
      'comfort_description' => to_nullable_string($body['comfort_description'] ?? null),
      'whatsapp_enquiry_message' => to_nullable_string($body['whatsapp_enquiry_message'] ?? null),
      'email_enquiry_subject' => to_nullable_string($body['email_enquiry_subject'] ?? null),
      'email_enquiry_message' => to_nullable_string($body['email_enquiry_message'] ?? null),
      'seo_title' => to_nullable_string($body['seo_title'] ?? null),
      'seo_description' => to_nullable_string($body['seo_description'] ?? null),
      'is_active' => normalize_boolean_input($body['is_active'] ?? true, true),
      'itinerary' => normalize_itinerary($body['itinerary'] ?? []),
      'highlights' => normalize_string_list($body['highlights'] ?? []),
      'included_items' => normalize_string_list($body['included_items'] ?? $body['whats_included'] ?? []),
      'excluded_items' => normalize_string_list($body['excluded_items'] ?? $body['whats_excluded'] ?? []),
      'terms' => normalize_string_list($body['terms'] ?? $body['terms_and_conditions'] ?? []),
      'gallery_images' => normalize_gallery_items($body['gallery_images'] ?? $body['gallery'] ?? []),
    ],
  ];
}

function validate_tour(array $payload): ?string
{
  if (to_trimmed_string($payload['name'] ?? '') === '') return 'Tour name is required.';
  if (to_trimmed_string($payload['duration'] ?? '') === '') return 'Tour duration is required.';
  if (to_trimmed_string($payload['price'] ?? '') === '') return 'Tour price is required.';
  if (to_trimmed_string($payload['category'] ?? '') === '') return 'Tour category is required.';
  return null;
}

function validate_service(array $payload): ?string
{
  if (to_trimmed_string($payload['title'] ?? '') === '') return 'Service title is required.';
  return null;
}

try {
  $method = $_SERVER['REQUEST_METHOD'];
  $parts = path_parts();
  $path = implode('/', $parts);

  if ($method === 'GET' && $path === '') {
    json_response([
      'ok' => true,
      'message' => 'Sandis API is running.',
      'health' => '/api/health',
    ]);
  }

  if ($method === 'GET' && $path === 'health') {
    db()->query('SELECT 1 AS ok');
    json_response(['ok' => true, 'database' => $config['db_name']]);
  }

  if ($method === 'POST' && $path === 'admin/login') {
    $body = read_json_body();
    $email = strtolower(to_trimmed_string($body['email'] ?? ''));
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

  if ($method === 'POST' && $path === 'admin/logout') {
    require_admin();
    json_response(null, 204);
  }

  if ($method === 'GET' && $path === 'admin/dashboard') {
    require_admin();
    json_response([
      'packages' => (int) fetch_one('SELECT COUNT(*) AS count FROM holiday_packages')['count'],
      'categories' => (int) fetch_one('SELECT COUNT(*) AS count FROM holiday_categories')['count'],
      'banners' => (int) fetch_one('SELECT COUNT(*) AS count FROM banners')['count'],
      'galleryImages' => (int) fetch_one('SELECT COUNT(*) AS count FROM gallery_images')['count'],
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
    $rows = fetch_all('SELECT id, name, duration, price, category, description, image_url, inclusions, itinerary, created_at, updated_at FROM tours ORDER BY created_at DESC');
    json_response(['tours' => array_map('map_tour', $rows)]);
  }

  if ($method === 'GET' && ($parts[0] ?? '') === 'tours' && !empty($parts[1])) {
    $tour = fetch_one('SELECT id, name, duration, price, category, description, image_url, inclusions, itinerary, created_at, updated_at FROM tours WHERE id = ? LIMIT 1', [$parts[1]]);
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
        to_trimmed_string($body['name']),
        to_trimmed_string($body['duration']),
        to_trimmed_string($body['price']),
        to_trimmed_string($body['category']),
        $body['description'] ?? null,
        $body['image_url'] ?? null,
        isset($body['inclusions']) ? json_encode($body['inclusions'], JSON_UNESCAPED_SLASHES) : null,
        isset($body['itinerary']) ? json_encode($body['itinerary'], JSON_UNESCAPED_SLASHES) : null,
      ],
    );

    json_response(['tour' => map_tour(fetch_one('SELECT id, name, duration, price, category, description, image_url, inclusions, itinerary, created_at, updated_at FROM tours WHERE id = ? LIMIT 1', [$id]))], 201);
  }

  if ($method === 'PUT' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'tours' && !empty($parts[2])) {
    require_admin();
    $body = read_json_body();
    $error = validate_tour($body);
    if ($error) json_response(['message' => $error], 400);

    $count = execute_sql(
      'UPDATE tours SET name = ?, duration = ?, price = ?, category = ?, description = ?, image_url = ?, inclusions = ?, itinerary = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        to_trimmed_string($body['name']),
        to_trimmed_string($body['duration']),
        to_trimmed_string($body['price']),
        to_trimmed_string($body['category']),
        $body['description'] ?? null,
        $body['image_url'] ?? null,
        isset($body['inclusions']) ? json_encode($body['inclusions'], JSON_UNESCAPED_SLASHES) : null,
        isset($body['itinerary']) ? json_encode($body['itinerary'], JSON_UNESCAPED_SLASHES) : null,
        $parts[2],
      ],
    );

    if ($count < 1) json_response(['message' => 'Tour not found.'], 404);
    json_response(['tour' => map_tour(fetch_one('SELECT id, name, duration, price, category, description, image_url, inclusions, itinerary, created_at, updated_at FROM tours WHERE id = ? LIMIT 1', [$parts[2]]))]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'tours' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM tours WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Tour not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'GET' && $path === 'services') {
    json_response(['services' => fetch_all('SELECT id, title, description, icon, created_at, updated_at FROM services ORDER BY created_at ASC')]);
  }

  if ($method === 'POST' && $path === 'admin/services') {
    require_admin();
    $body = read_json_body();
    $error = validate_service($body);
    if ($error) json_response(['message' => $error], 400);

    $id = uuid_v4();
    execute_sql('INSERT INTO services (id, title, description, icon) VALUES (?, ?, ?, ?)', [
      $id,
      to_trimmed_string($body['title']),
      $body['description'] ?? null,
      $body['icon'] ?? 'Plane',
    ]);
    json_response(['service' => fetch_one('SELECT id, title, description, icon, created_at, updated_at FROM services WHERE id = ? LIMIT 1', [$id])], 201);
  }

  if ($method === 'PUT' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'services' && !empty($parts[2])) {
    require_admin();
    $body = read_json_body();
    $error = validate_service($body);
    if ($error) json_response(['message' => $error], 400);

    $count = execute_sql('UPDATE services SET title = ?, description = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      to_trimmed_string($body['title']),
      $body['description'] ?? null,
      $body['icon'] ?? 'Plane',
      $parts[2],
    ]);
    if ($count < 1) json_response(['message' => 'Service not found.'], 404);
    json_response(['service' => fetch_one('SELECT id, title, description, icon, created_at, updated_at FROM services WHERE id = ? LIMIT 1', [$parts[2]])]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'services' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM services WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Service not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'POST' && $path === 'enquiries') {
    $body = read_json_body();
    $submissionKey = to_trimmed_string($body['submission_key'] ?? '');
    $name = to_trimmed_string($body['name'] ?? '');
    $phone = to_trimmed_string($body['phone'] ?? '');

    if ($submissionKey !== ENQUIRY_SUBMISSION_KEY) {
      json_response(['message' => 'Invalid enquiry submission.'], 403);
    }

    if ($name === '' || $phone === '') {
      json_response(['message' => 'Name and phone are required.'], 400);
    }

    $status = in_array(($body['status'] ?? ''), VALID_ENQUIRY_STATUSES, true) ? $body['status'] : 'new';
    $id = uuid_v4();
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
    json_response(['enquiry' => map_enquiry(fetch_one('SELECT id, name, email, phone, destination, message, travel_date, status, created_at FROM enquiries WHERE id = ? LIMIT 1', [$id]))], 201);
  }

  if ($method === 'GET' && $path === 'admin/enquiries') {
    require_admin();
    $rows = fetch_all('SELECT id, name, email, phone, destination, message, travel_date, status, created_at FROM enquiries ORDER BY created_at DESC');
    json_response(['enquiries' => array_map('map_enquiry', $rows)]);
  }

  if ($method === 'PATCH' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'enquiries' && !empty($parts[2]) && ($parts[3] ?? '') === 'status') {
    require_admin();
    $body = read_json_body();
    $status = (string) ($body['status'] ?? '');

    if (!in_array($status, VALID_ENQUIRY_STATUSES, true)) {
      json_response(['message' => 'Invalid enquiry status.'], 400);
    }

    $count = execute_sql('UPDATE enquiries SET status = ? WHERE id = ?', [$status, $parts[2]]);
    if ($count < 1) json_response(['message' => 'Enquiry not found.'], 404);
    json_response(['enquiry' => map_enquiry(fetch_one('SELECT id, name, email, phone, destination, message, travel_date, status, created_at FROM enquiries WHERE id = ? LIMIT 1', [$parts[2]]))]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'enquiries' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM enquiries WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Enquiry not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'GET' && $path === 'banners') {
    $pageKey = to_trimmed_string($_GET['page'] ?? '');
    $onlyActive = normalize_boolean_input($_GET['active'] ?? null, true);

    if ($pageKey !== '' && !in_array($pageKey, VALID_BANNER_PAGES, true)) {
      json_response(['message' => 'Invalid page key.'], 400);
    }

    $sql = 'SELECT id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active, created_at, updated_at FROM banners WHERE 1 = 1';
    $params = [];

    if ($pageKey !== '') {
      $sql .= ' AND page_key = ?';
      $params[] = $pageKey;
    }

    if ($onlyActive) {
      $sql .= ' AND is_active = 1';
    }

    $sql .= ' ORDER BY display_order ASC, created_at DESC';

    $rows = fetch_all($sql, $params);
    json_response(['banners' => array_map('map_banner', $rows)]);
  }

  if ($method === 'GET' && $path === 'admin/banners') {
    require_admin();
    $rows = fetch_all('SELECT id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active, created_at, updated_at FROM banners ORDER BY page_key ASC, display_order ASC, created_at DESC');
    json_response(['banners' => array_map('map_banner', $rows)]);
  }

  if ($method === 'POST' && $path === 'admin/banners') {
    require_admin();
    $body = read_json_body();

    $pageKey = to_trimmed_string($body['page_key'] ?? '');
    $imageUrl = to_trimmed_string($body['image_url'] ?? '');

    if (!in_array($pageKey, VALID_BANNER_PAGES, true)) {
      json_response(['message' => 'Valid page key is required.'], 400);
    }

    if ($imageUrl === '') {
      json_response(['message' => 'Banner image is required.'], 400);
    }

    $id = uuid_v4();
    execute_sql(
      'INSERT INTO banners (id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        $id,
        $pageKey,
        to_nullable_string($body['title'] ?? null),
        to_nullable_string($body['subtitle'] ?? null),
        $imageUrl,
        to_nullable_string($body['mobile_image_url'] ?? null),
        to_nullable_string($body['cta_label'] ?? null),
        to_nullable_string($body['cta_link'] ?? null),
        to_int($body['display_order'] ?? 0, 0),
        to_db_boolean(normalize_boolean_input($body['is_active'] ?? true, true)),
      ],
    );

    json_response(['banner' => map_banner(fetch_one('SELECT id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active, created_at, updated_at FROM banners WHERE id = ? LIMIT 1', [$id]))], 201);
  }

  if ($method === 'PUT' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'banners' && !empty($parts[2])) {
    require_admin();
    $body = read_json_body();

    $pageKey = to_trimmed_string($body['page_key'] ?? '');
    $imageUrl = to_trimmed_string($body['image_url'] ?? '');

    if (!in_array($pageKey, VALID_BANNER_PAGES, true)) {
      json_response(['message' => 'Valid page key is required.'], 400);
    }

    if ($imageUrl === '') {
      json_response(['message' => 'Banner image is required.'], 400);
    }

    $count = execute_sql(
      'UPDATE banners SET page_key = ?, title = ?, subtitle = ?, image_url = ?, mobile_image_url = ?, cta_label = ?, cta_link = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        $pageKey,
        to_nullable_string($body['title'] ?? null),
        to_nullable_string($body['subtitle'] ?? null),
        $imageUrl,
        to_nullable_string($body['mobile_image_url'] ?? null),
        to_nullable_string($body['cta_label'] ?? null),
        to_nullable_string($body['cta_link'] ?? null),
        to_int($body['display_order'] ?? 0, 0),
        to_db_boolean(normalize_boolean_input($body['is_active'] ?? true, true)),
        $parts[2],
      ],
    );

    if ($count < 1) {
      json_response(['message' => 'Banner not found.'], 404);
    }

    json_response(['banner' => map_banner(fetch_one('SELECT id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active, created_at, updated_at FROM banners WHERE id = ? LIMIT 1', [$parts[2]]))]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'banners' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM banners WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Banner not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'GET' && $path === 'categories') {
    $includeInactive = normalize_boolean_input($_GET['include_inactive'] ?? null, false);
    $sql = 'SELECT id, name, slug, description, display_order, is_active, created_at, updated_at FROM holiday_categories';

    if (!$includeInactive) {
      $sql .= ' WHERE is_active = 1';
    }

    $sql .= ' ORDER BY display_order ASC, name ASC';

    $rows = fetch_all($sql);
    json_response(['categories' => array_map('map_category', $rows)]);
  }

  if ($method === 'GET' && $path === 'admin/categories') {
    require_admin();
    $rows = fetch_all('SELECT id, name, slug, description, display_order, is_active, created_at, updated_at FROM holiday_categories ORDER BY display_order ASC, name ASC');
    json_response(['categories' => array_map('map_category', $rows)]);
  }

  if ($method === 'POST' && $path === 'admin/categories') {
    require_admin();
    $body = read_json_body();
    $name = to_trimmed_string($body['name'] ?? '');

    if ($name === '') {
      json_response(['message' => 'Category name is required.'], 400);
    }

    $slug = ensure_unique_slug('holiday_categories', 'slug', to_trimmed_string($body['slug'] ?? $name));
    $id = uuid_v4();

    execute_sql(
      'INSERT INTO holiday_categories (id, name, slug, description, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [
        $id,
        $name,
        $slug,
        to_nullable_string($body['description'] ?? null),
        to_int($body['display_order'] ?? 0, 0),
        to_db_boolean(normalize_boolean_input($body['is_active'] ?? true, true)),
      ],
    );

    json_response(['category' => map_category(fetch_one('SELECT id, name, slug, description, display_order, is_active, created_at, updated_at FROM holiday_categories WHERE id = ? LIMIT 1', [$id]))], 201);
  }

  if ($method === 'PUT' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'categories' && !empty($parts[2])) {
    require_admin();
    $body = read_json_body();
    $name = to_trimmed_string($body['name'] ?? '');

    if ($name === '') {
      json_response(['message' => 'Category name is required.'], 400);
    }

    $slug = ensure_unique_slug('holiday_categories', 'slug', to_trimmed_string($body['slug'] ?? $name), $parts[2]);
    $count = execute_sql(
      'UPDATE holiday_categories SET name = ?, slug = ?, description = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        $name,
        $slug,
        to_nullable_string($body['description'] ?? null),
        to_int($body['display_order'] ?? 0, 0),
        to_db_boolean(normalize_boolean_input($body['is_active'] ?? true, true)),
        $parts[2],
      ],
    );

    if ($count < 1) {
      json_response(['message' => 'Category not found.'], 404);
    }

    json_response(['category' => map_category(fetch_one('SELECT id, name, slug, description, display_order, is_active, created_at, updated_at FROM holiday_categories WHERE id = ? LIMIT 1', [$parts[2]]))]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'categories' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM holiday_categories WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Category not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'GET' && $path === 'packages') {
    $categorySlug = to_trimmed_string($_GET['category'] ?? '');
    $includeInactive = normalize_boolean_input($_GET['include_inactive'] ?? null, false);

    $sql = package_base_select() . ' WHERE 1 = 1';
    $params = [];

    if ($categorySlug !== '') {
      $sql .= ' AND c.slug = ?';
      $params[] = $categorySlug;
    }

    if (!$includeInactive) {
      $sql .= ' AND p.is_active = 1';
    }

    $sql .= ' ORDER BY c.display_order ASC, p.created_at DESC';

    $rows = fetch_all($sql, $params);
    json_response(['packages' => array_map('map_package_base', $rows)]);
  }

  if ($method === 'GET' && ($parts[0] ?? '') === 'packages' && !empty($parts[1])) {
    $row = query_single_package_by_slug($parts[1]);

    if (!$row) {
      json_response(['message' => 'Holiday package not found.'], 404);
    }

    json_response(['package' => build_package_response($row)]);
  }

  if ($method === 'GET' && $path === 'admin/packages') {
    require_admin();
    $rows = fetch_all(package_base_select() . ' ORDER BY c.display_order ASC, p.created_at DESC');
    json_response(['packages' => array_map('map_package_base', $rows)]);
  }

  if ($method === 'GET' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'packages' && !empty($parts[2])) {
    require_admin();
    $row = query_single_package_by_id($parts[2]);

    if (!$row) {
      json_response(['message' => 'Holiday package not found.'], 404);
    }

    json_response(['package' => build_package_response($row)]);
  }

  if ($method === 'POST' && $path === 'admin/packages') {
    require_admin();
    $parsed = parse_package_payload(read_json_body());
    if (isset($parsed['error'])) {
      json_response(['message' => $parsed['error']], 400);
    }

    $payload = $parsed['value'];
    $category = fetch_one('SELECT id FROM holiday_categories WHERE id = ? LIMIT 1', [$payload['category_id']]);
    if (!$category) {
      json_response(['message' => 'Invalid category selected.'], 400);
    }

    $id = uuid_v4();
    $slug = ensure_unique_slug('holiday_packages', 'slug', $payload['slug'] !== '' ? $payload['slug'] : $payload['title']);

    execute_sql(
      'INSERT INTO holiday_packages (id, category_id, title, slug, location, banner_image_url, short_description, duration, trip_type, price_label, about_tour, good_for_title, good_for_description, vehicles_title, vehicles_description, attraction_title, attraction_description, comfort_title, comfort_description, whatsapp_enquiry_message, email_enquiry_subject, email_enquiry_message, seo_title, seo_description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        $id,
        $payload['category_id'],
        $payload['title'],
        $slug,
        $payload['location'],
        $payload['banner_image_url'],
        $payload['short_description'],
        $payload['duration'],
        $payload['trip_type'],
        $payload['price_label'],
        $payload['about_tour'],
        $payload['good_for_title'],
        $payload['good_for_description'],
        $payload['vehicles_title'],
        $payload['vehicles_description'],
        $payload['attraction_title'],
        $payload['attraction_description'],
        $payload['comfort_title'],
        $payload['comfort_description'],
        $payload['whatsapp_enquiry_message'],
        $payload['email_enquiry_subject'],
        $payload['email_enquiry_message'],
        $payload['seo_title'],
        $payload['seo_description'],
        to_db_boolean($payload['is_active']),
      ],
    );

    replace_package_collections($id, $payload);
    json_response(['package' => build_package_response(query_single_package_by_id($id))], 201);
  }

  if ($method === 'PUT' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'packages' && !empty($parts[2])) {
    require_admin();
    $existing = query_single_package_by_id($parts[2]);
    if (!$existing) {
      json_response(['message' => 'Holiday package not found.'], 404);
    }

    $parsed = parse_package_payload(read_json_body());
    if (isset($parsed['error'])) {
      json_response(['message' => $parsed['error']], 400);
    }

    $payload = $parsed['value'];
    $category = fetch_one('SELECT id FROM holiday_categories WHERE id = ? LIMIT 1', [$payload['category_id']]);
    if (!$category) {
      json_response(['message' => 'Invalid category selected.'], 400);
    }

    $slug = ensure_unique_slug('holiday_packages', 'slug', $payload['slug'] !== '' ? $payload['slug'] : $payload['title'], $parts[2]);

    $count = execute_sql(
      'UPDATE holiday_packages SET category_id = ?, title = ?, slug = ?, location = ?, banner_image_url = ?, short_description = ?, duration = ?, trip_type = ?, price_label = ?, about_tour = ?, good_for_title = ?, good_for_description = ?, vehicles_title = ?, vehicles_description = ?, attraction_title = ?, attraction_description = ?, comfort_title = ?, comfort_description = ?, whatsapp_enquiry_message = ?, email_enquiry_subject = ?, email_enquiry_message = ?, seo_title = ?, seo_description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        $payload['category_id'],
        $payload['title'],
        $slug,
        $payload['location'],
        $payload['banner_image_url'],
        $payload['short_description'],
        $payload['duration'],
        $payload['trip_type'],
        $payload['price_label'],
        $payload['about_tour'],
        $payload['good_for_title'],
        $payload['good_for_description'],
        $payload['vehicles_title'],
        $payload['vehicles_description'],
        $payload['attraction_title'],
        $payload['attraction_description'],
        $payload['comfort_title'],
        $payload['comfort_description'],
        $payload['whatsapp_enquiry_message'],
        $payload['email_enquiry_subject'],
        $payload['email_enquiry_message'],
        $payload['seo_title'],
        $payload['seo_description'],
        to_db_boolean($payload['is_active']),
        $parts[2],
      ],
    );

    if ($count < 1) {
      json_response(['message' => 'Holiday package not found.'], 404);
    }

    replace_package_collections($parts[2], $payload);
    json_response(['package' => build_package_response(query_single_package_by_id($parts[2]))]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'packages' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM holiday_packages WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Holiday package not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'GET' && $path === 'gallery-images') {
    $category = to_trimmed_string($_GET['category'] ?? '');
    $includeInactive = normalize_boolean_input($_GET['include_inactive'] ?? null, false);

    $sql = 'SELECT id, image_url, title, category, alt_text, display_order, is_active, created_at, updated_at FROM gallery_images WHERE 1 = 1';
    $params = [];

    if ($category !== '') {
      $sql .= ' AND category = ?';
      $params[] = $category;
    }

    if (!$includeInactive) {
      $sql .= ' AND is_active = 1';
    }

    $sql .= ' ORDER BY display_order ASC, created_at DESC';

    $rows = fetch_all($sql, $params);
    json_response(['images' => array_map('map_gallery_image', $rows)]);
  }

  if ($method === 'GET' && $path === 'admin/gallery-images') {
    require_admin();
    $rows = fetch_all('SELECT id, image_url, title, category, alt_text, display_order, is_active, created_at, updated_at FROM gallery_images ORDER BY display_order ASC, created_at DESC');
    json_response(['images' => array_map('map_gallery_image', $rows)]);
  }

  if ($method === 'POST' && $path === 'admin/gallery-images') {
    require_admin();
    $body = read_json_body();
    $imageUrl = to_trimmed_string($body['image_url'] ?? '');

    if ($imageUrl === '') {
      json_response(['message' => 'Image URL is required.'], 400);
    }

    $id = uuid_v4();
    execute_sql(
      'INSERT INTO gallery_images (id, image_url, title, category, alt_text, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        $id,
        $imageUrl,
        to_nullable_string($body['title'] ?? null),
        to_nullable_string($body['category'] ?? null),
        to_nullable_string($body['alt_text'] ?? null),
        to_int($body['display_order'] ?? 0, 0),
        to_db_boolean(normalize_boolean_input($body['is_active'] ?? true, true)),
      ],
    );

    json_response(['image' => map_gallery_image(fetch_one('SELECT id, image_url, title, category, alt_text, display_order, is_active, created_at, updated_at FROM gallery_images WHERE id = ? LIMIT 1', [$id]))], 201);
  }

  if ($method === 'PUT' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'gallery-images' && !empty($parts[2])) {
    require_admin();
    $body = read_json_body();
    $imageUrl = to_trimmed_string($body['image_url'] ?? '');

    if ($imageUrl === '') {
      json_response(['message' => 'Image URL is required.'], 400);
    }

    $count = execute_sql(
      'UPDATE gallery_images SET image_url = ?, title = ?, category = ?, alt_text = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        $imageUrl,
        to_nullable_string($body['title'] ?? null),
        to_nullable_string($body['category'] ?? null),
        to_nullable_string($body['alt_text'] ?? null),
        to_int($body['display_order'] ?? 0, 0),
        to_db_boolean(normalize_boolean_input($body['is_active'] ?? true, true)),
        $parts[2],
      ],
    );

    if ($count < 1) {
      json_response(['message' => 'Gallery image not found.'], 404);
    }

    json_response(['image' => map_gallery_image(fetch_one('SELECT id, image_url, title, category, alt_text, display_order, is_active, created_at, updated_at FROM gallery_images WHERE id = ? LIMIT 1', [$parts[2]]))]);
  }

  if ($method === 'DELETE' && ($parts[0] ?? '') === 'admin' && ($parts[1] ?? '') === 'gallery-images' && !empty($parts[2])) {
    require_admin();
    $count = execute_sql('DELETE FROM gallery_images WHERE id = ?', [$parts[2]]);
    $count < 1 ? json_response(['message' => 'Gallery image not found.'], 404) : json_response(null, 204);
  }

  if ($method === 'GET' && $path === 'settings/public') {
    $rows = fetch_all('SELECT setting_key, setting_value FROM settings');
    $settings = [];
    foreach ($rows as $row) {
      $settings[$row['setting_key']] = $row['setting_value'];
    }
    json_response(['settings' => $settings]);
  }

  if ($method === 'GET' && $path === 'admin/settings') {
    require_admin();
    $rows = fetch_all('SELECT id, setting_key, setting_value, created_at, updated_at FROM settings ORDER BY setting_key ASC');
    json_response(['settings' => $rows]);
  }

  if ($method === 'POST' && $path === 'admin/settings') {
    require_admin();
    $body = read_json_body();
    $settingKey = to_trimmed_string($body['setting_key'] ?? '');

    if ($settingKey === '') {
      json_response(['message' => 'Setting key is required.'], 400);
    }

    $settingValue = $body['setting_value'] ?? null;
    $existing = fetch_one('SELECT id FROM settings WHERE setting_key = ? LIMIT 1', [$settingKey]);

    if ($existing) {
      execute_sql('UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?', [$settingValue, $settingKey]);
    } else {
      execute_sql('INSERT INTO settings (id, setting_key, setting_value) VALUES (?, ?, ?)', [uuid_v4(), $settingKey, $settingValue]);
    }

    json_response(['setting' => fetch_one('SELECT id, setting_key, setting_value, created_at, updated_at FROM settings WHERE setting_key = ? LIMIT 1', [$settingKey])], 201);
  }

  json_response(['message' => 'Route not found.'], 404);
} catch (Throwable $error) {
  json_response(['message' => $error->getMessage()], 500);
}
