import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

import { pool, query } from "../db.js";

const [, , emailArg, passwordArg, nameArg] = process.argv;

const email = String(emailArg ?? "").trim().toLowerCase();
const password = String(passwordArg ?? "");
const name = String(nameArg ?? "Sandis Admin").trim();

if (!email || !password) {
  console.error(
    "Usage: npm run admin:create -- admin@example.com yourpassword \"Admin Name\"",
  );
  process.exit(1);
}

const main = async () => {
  const existing = await query(
    "SELECT id FROM admins WHERE email = :email LIMIT 1",
    { email },
  );

  const passwordHash = await bcrypt.hash(password, 12);

  if (Array.isArray(existing) && existing.length > 0) {
    await query(
      `
        UPDATE admins
        SET password_hash = :passwordHash, name = :name
        WHERE email = :email
      `,
      {
        email,
        name,
        passwordHash,
      },
    );

    console.log(`Updated admin account for ${email}`);
    return;
  }

  await query(
    `
      INSERT INTO admins (id, email, password_hash, name)
      VALUES (:id, :email, :passwordHash, :name)
    `,
    {
      id: randomUUID(),
      email,
      passwordHash,
      name,
    },
  );

  console.log(`Created admin account for ${email}`);
};

main()
  .catch((error) => {
    const message =
      error instanceof Error ? error.message : "Failed to create admin user.";
    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
