import app from "./app.js";
import { config } from "./config.js";
import { pool, query } from "./db.js";

const server = app.listen(config.apiPort, async () => {
  try {
    await query("SELECT 1");
    console.log(
      `Sandis API running on http://localhost:${config.apiPort} using database ${config.db.database}`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database connection failed.";
    console.error(`Server started but MySQL connection failed: ${message}`);
  }
});

const shutdown = async () => {
  server.close();
  await pool.end();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
