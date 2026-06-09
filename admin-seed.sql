INSERT INTO admins (id, email, password_hash, name)
VALUES (
  UUID(),
  'admin@sandis.com',
  '$2b$12$a68nKds1hkKzlVLWOvKL9eJTD1XShThM3xyx9f7EfwjOMuA.2ixuK',
  'Sandis Admin'
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  name = VALUES(name);
