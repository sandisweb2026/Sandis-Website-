-- Sandis Tours CMS schema
-- Import this file in phpMyAdmin or run it through your MySQL client.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS admins (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  admin_id CHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_sessions_token (token),
  KEY idx_admin_sessions_admin (admin_id),
  KEY idx_admin_sessions_expiry (expires_at),
  CONSTRAINT fk_admin_sessions_admin FOREIGN KEY (admin_id)
    REFERENCES admins (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tours (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  duration VARCHAR(120) NOT NULL,
  price VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NULL,
  image_url TEXT NULL,
  inclusions JSON NULL,
  itinerary JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  icon VARCHAR(80) NOT NULL DEFAULT 'Plane',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_uploads (
  id CHAR(36) NOT NULL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  byte_size INT NOT NULL,
  content LONGBLOB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiries (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(191) NULL,
  phone VARCHAR(50) NOT NULL,
  destination VARCHAR(255) NULL,
  message TEXT NULL,
  travel_date DATE NULL,
  status ENUM('new', 'contacted', 'closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banners (
  id CHAR(36) NOT NULL PRIMARY KEY,
  page_key VARCHAR(60) NOT NULL,
  title VARCHAR(255) NULL,
  subtitle TEXT NULL,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT NULL,
  cta_label VARCHAR(120) NULL,
  cta_link VARCHAR(255) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_banners_page_order (page_key, is_active, display_order)
);

CREATE TABLE IF NOT EXISTS holiday_categories (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  description TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_holiday_categories_name (name),
  UNIQUE KEY uq_holiday_categories_slug (slug)
);

CREATE TABLE IF NOT EXISTS holiday_packages (
  id CHAR(36) NOT NULL PRIMARY KEY,
  category_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  location VARCHAR(255) NULL,
  banner_image_url TEXT NULL,
  short_description TEXT NULL,
  duration VARCHAR(120) NULL,
  trip_type VARCHAR(120) NULL,
  price_label VARCHAR(120) NULL,
  about_tour TEXT NULL,
  good_for_title VARCHAR(120) NULL,
  good_for_description TEXT NULL,
  vehicles_title VARCHAR(120) NULL,
  vehicles_description TEXT NULL,
  attraction_title VARCHAR(120) NULL,
  attraction_description TEXT NULL,
  comfort_title VARCHAR(120) NULL,
  comfort_description TEXT NULL,
  whatsapp_enquiry_message TEXT NULL,
  email_enquiry_subject VARCHAR(255) NULL,
  email_enquiry_message TEXT NULL,
  seo_title VARCHAR(255) NULL,
  seo_description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_holiday_packages_slug (slug),
  KEY idx_holiday_packages_category (category_id),
  KEY idx_holiday_packages_active (is_active),
  CONSTRAINT fk_holiday_packages_category FOREIGN KEY (category_id)
    REFERENCES holiday_categories (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS package_itinerary (
  id CHAR(36) NOT NULL PRIMARY KEY,
  package_id CHAR(36) NOT NULL,
  day_label VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_package_itinerary_package (package_id, display_order),
  CONSTRAINT fk_package_itinerary_package FOREIGN KEY (package_id)
    REFERENCES holiday_packages (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS package_highlights (
  id CHAR(36) NOT NULL PRIMARY KEY,
  package_id CHAR(36) NOT NULL,
  item_text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_package_highlights_package (package_id, display_order),
  CONSTRAINT fk_package_highlights_package FOREIGN KEY (package_id)
    REFERENCES holiday_packages (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS package_included_items (
  id CHAR(36) NOT NULL PRIMARY KEY,
  package_id CHAR(36) NOT NULL,
  item_text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_package_included_package (package_id, display_order),
  CONSTRAINT fk_package_included_package FOREIGN KEY (package_id)
    REFERENCES holiday_packages (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS package_excluded_items (
  id CHAR(36) NOT NULL PRIMARY KEY,
  package_id CHAR(36) NOT NULL,
  item_text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_package_excluded_package (package_id, display_order),
  CONSTRAINT fk_package_excluded_package FOREIGN KEY (package_id)
    REFERENCES holiday_packages (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS package_terms (
  id CHAR(36) NOT NULL PRIMARY KEY,
  package_id CHAR(36) NOT NULL,
  item_text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_package_terms_package (package_id, display_order),
  CONSTRAINT fk_package_terms_package FOREIGN KEY (package_id)
    REFERENCES holiday_packages (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS package_gallery_images (
  id CHAR(36) NOT NULL PRIMARY KEY,
  package_id CHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  title VARCHAR(255) NULL,
  alt_text VARCHAR(255) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_package_gallery_package (package_id, is_active, display_order),
  CONSTRAINT fk_package_gallery_package FOREIGN KEY (package_id)
    REFERENCES holiday_packages (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id CHAR(36) NOT NULL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255) NULL,
  category VARCHAR(120) NULL,
  alt_text VARCHAR(255) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_gallery_images_active (is_active, display_order)
);

CREATE TABLE IF NOT EXISTS settings (
  id CHAR(36) NOT NULL PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL,
  setting_value TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_settings_key (setting_key)
);

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


SET FOREIGN_KEY_CHECKS = 1;
