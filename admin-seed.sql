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
