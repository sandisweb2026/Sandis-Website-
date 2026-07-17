-- Sandis Tours Hostinger default data
-- Import this file after sandis.sql in phpMyAdmin.
-- It adds the default holiday package categories and the admin login.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO holiday_categories (id, name, slug, description, display_order, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Group Tour', 'group-tour', 'Curated fixed-departure and group holiday tours', 1, 1),
  ('22222222-2222-2222-2222-222222222222', 'Maharashtra', 'maharashtra', 'Holiday packages across Maharashtra', 2, 1),
  ('33333333-3333-3333-3333-333333333333', 'India', 'india', 'Domestic tours across India', 3, 1),
  ('44444444-4444-4444-4444-444444444444', 'International Trip', 'international-trip', 'International holiday packages', 4, 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  slug = VALUES(slug),
  description = VALUES(description),
  display_order = VALUES(display_order),
  is_active = VALUES(is_active);

INSERT INTO admins (id, email, password_hash, name)
VALUES (
  UUID(),
  'admin@sandis.com',
  '$2b$12$P.DKT0V9W2HtqlGPDLXAzOMaPsv7SxzG22esyIUS48JQjgM0WEp2K',
  'Sandis Admin'
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  name = VALUES(name);

SET FOREIGN_KEY_CHECKS = 1;
