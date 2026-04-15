import dotenv from "dotenv";

dotenv.config();

export const config = {
  apiPort: Number(process.env.API_PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "sandis-change-this-secret",
  db: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "sandis",
    connectionLimit: 10,
  },
};
