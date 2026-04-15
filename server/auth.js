import jwt from "jsonwebtoken";

import { config } from "./config.js";
import { query } from "./db.js";

export const signAdminToken = (admin) =>
  jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
    },
    config.jwtSecret,
    { expiresIn: "7d" },
  );

export const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const admins = await query(
      "SELECT id, email, name FROM admins WHERE id = :id LIMIT 1",
      { id: payload.adminId },
    );

    if (!Array.isArray(admins) || admins.length === 0) {
      return res.status(401).json({ message: "Admin session is invalid." });
    }

    req.admin = admins[0];
    return next();
  } catch {
    return res.status(401).json({ message: "Authentication failed." });
  }
};
