import mysql from "mysql2/promise";

import { config } from "./config.js";

export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  namedPlaceholders: true,
});

export const query = async (sql, params = {}) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};
