import { randomBytes, randomUUID } from "node:crypto";

import { query } from "./db.js";

const SESSION_DURATION_HOURS = Number(
  process.env.ADMIN_SESSION_HOURS ?? 24 * 7,
);

const createExpiryTimestamp = () => {
  const expiry = new Date(
    Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000,
  );
  return expiry.toISOString().slice(0, 19).replace("T", " ");
};

const purgeExpiredSessions = async () => {
  await query("DELETE FROM admin_sessions WHERE expires_at <= NOW()");
};

export const createAdminSession = async (admin) => {
  await purgeExpiredSessions();

  const token = randomBytes(48).toString("hex");
  await query(
    `
      INSERT INTO admin_sessions (id, admin_id, token, expires_at)
      VALUES (:id, :admin_id, :token, :expires_at)
    `,
    {
      id: randomUUID(),
      admin_id: admin.id,
      token,
      expires_at: createExpiryTimestamp(),
    },
  );

  return token;
};

export const invalidateAdminSession = async (token) => {
  if (!token) return;
  await query("DELETE FROM admin_sessions WHERE token = :token", { token });
};

export const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    await purgeExpiredSessions();

    const sessions = await query(
      `
        SELECT a.id, a.email, a.name
        FROM admin_sessions s
        INNER JOIN admins a ON a.id = s.admin_id
        WHERE s.token = :token AND s.expires_at > NOW()
        LIMIT 1
      `,
      { token },
    );

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return res.status(401).json({ message: "Admin session is invalid." });
    }

    req.admin = sessions[0];
    req.adminToken = token;
    return next();
  } catch {
    return res.status(401).json({ message: "Authentication failed." });
  }
};
