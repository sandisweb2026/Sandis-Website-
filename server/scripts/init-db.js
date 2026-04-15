import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.resolve(__dirname, "../mysql/schema.sql");

const main = async () => {
  const sql = await fs.readFile(schemaPath, "utf8");
  const statements = sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }

  console.log("MySQL schema initialized successfully.");
};

main()
  .catch((error) => {
    const message =
      error instanceof Error ? error.message : "Schema initialization failed.";
    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
