import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import multer from "multer";

import { requireAdmin, signAdminToken } from "./auth.js";
import { config } from "./config.js";
import { pool, query } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, "uploads");
const tourUploadsDir = path.join(uploadsRoot, "tours");

fs.mkdirSync(tourUploadsDir, { recursive: true });

const app = express();

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);
app.use("/uploads", express.static(uploadsRoot));
app.use(express.json({ limit: "2mb" }));

const allowedImageMimeTypes = new Set(["image/png", "image/jpeg"]);
const allowedImageExtensions = new Set([".png", ".jpg", ".jpeg"]);

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, tourUploadsDir);
    },
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const safeExtension = allowedImageExtensions.has(extension)
        ? extension
        : ".jpg";
      callback(null, `${Date.now()}-${randomUUID()}${safeExtension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isValidMime = allowedImageMimeTypes.has(file.mimetype);
    const isValidExtension = allowedImageExtensions.has(extension);

    if (isValidMime && isValidExtension) {
      callback(null, true);
      return;
    }

    callback(new Error("Only PNG, JPG, and JPEG images are allowed."));
  },
});

const tourSelect = `
  SELECT id, name, duration, price, category, description, image_url, inclusions, itinerary, created_at, updated_at
  FROM tours
`;

const serviceSelect = `
  SELECT id, title, description, icon, created_at, updated_at
  FROM services
`;

const enquirySelect = `
  SELECT id, name, email, phone, destination, message, travel_date, status, created_at
  FROM enquiries
`;

const parseJsonField = (value, fallback = null) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const mapTour = (row) => ({
  ...row,
  inclusions: parseJsonField(row.inclusions, null),
  itinerary: parseJsonField(row.itinerary, null),
});

const mapEnquiry = (row) => ({
  ...row,
  travel_date: row.travel_date
    ? new Date(row.travel_date).toISOString().slice(0, 10)
    : null,
});

const serializeJson = (value) => {
  if (value === null || value === undefined) return null;
  return JSON.stringify(value);
};

const validateTourPayload = (payload) => {
  if (!payload?.name?.trim()) return "Tour name is required.";
  if (!payload?.duration?.trim()) return "Tour duration is required.";
  if (!payload?.price?.trim()) return "Tour price is required.";
  if (!payload?.category?.trim()) return "Tour category is required.";
  return null;
};

const validateServicePayload = (payload) => {
  if (!payload?.title?.trim()) return "Service title is required.";
  return null;
};

const validEnquiryStatuses = new Set(["new", "contacted", "closed"]);

app.get("/api/health", async (_req, res, next) => {
  try {
    await query("SELECT 1 AS ok");
    res.json({ ok: true, database: config.db.database });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/login", async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const admins = await query(
      "SELECT id, email, name, password_hash FROM admins WHERE email = :email LIMIT 1",
      { email },
    );

    if (!Array.isArray(admins) || admins.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const admin = admins[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signAdminToken(admin);

    return res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/me", requireAdmin, async (req, res) => {
  res.json({ admin: req.admin });
});

app.get("/api/admin/dashboard", requireAdmin, async (_req, res, next) => {
  try {
    const [tourCountRows, serviceCountRows, enquiryCountRows, newCountRows] =
      await Promise.all([
        query("SELECT COUNT(*) AS count FROM tours"),
        query("SELECT COUNT(*) AS count FROM services"),
        query("SELECT COUNT(*) AS count FROM enquiries"),
        query("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'new'"),
      ]);

    res.json({
      tours: Number(tourCountRows[0]?.count ?? 0),
      services: Number(serviceCountRows[0]?.count ?? 0),
      enquiries: Number(enquiryCountRows[0]?.count ?? 0),
      newEnquiries: Number(newCountRows[0]?.count ?? 0),
    });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/admin/uploads/tour-image",
  requireAdmin,
  imageUpload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Please choose an image file." });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/uploads/tours/${req.file.filename}`;

    return res.status(201).json({
      url,
      filename: req.file.filename,
    });
  },
);

app.get("/api/tours", async (_req, res, next) => {
  try {
    const rows = await query(`${tourSelect} ORDER BY created_at DESC`);
    res.json({ tours: rows.map(mapTour) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/tours/:id", async (req, res, next) => {
  try {
    const rows = await query(`${tourSelect} WHERE id = :id LIMIT 1`, {
      id: req.params.id,
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "Tour not found." });
    }

    return res.json({ tour: mapTour(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/tours", requireAdmin, async (req, res, next) => {
  try {
    const validationMessage = validateTourPayload(req.body);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const id = randomUUID();
    await query(
      `
        INSERT INTO tours (
          id, name, duration, price, category, description, image_url, inclusions, itinerary
        ) VALUES (
          :id, :name, :duration, :price, :category, :description, :image_url, :inclusions, :itinerary
        )
      `,
      {
        id,
        name: req.body.name.trim(),
        duration: req.body.duration.trim(),
        price: req.body.price.trim(),
        category: req.body.category.trim(),
        description: req.body.description ?? null,
        image_url: req.body.image_url ?? null,
        inclusions: serializeJson(req.body.inclusions),
        itinerary: serializeJson(req.body.itinerary),
      },
    );

    const rows = await query(`${tourSelect} WHERE id = :id LIMIT 1`, { id });
    res.status(201).json({ tour: mapTour(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/tours/:id", requireAdmin, async (req, res, next) => {
  try {
    const validationMessage = validateTourPayload(req.body);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const result = await query(
      `
        UPDATE tours
        SET
          name = :name,
          duration = :duration,
          price = :price,
          category = :category,
          description = :description,
          image_url = :image_url,
          inclusions = :inclusions,
          itinerary = :itinerary,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = :id
      `,
      {
        id: req.params.id,
        name: req.body.name.trim(),
        duration: req.body.duration.trim(),
        price: req.body.price.trim(),
        category: req.body.category.trim(),
        description: req.body.description ?? null,
        image_url: req.body.image_url ?? null,
        inclusions: serializeJson(req.body.inclusions),
        itinerary: serializeJson(req.body.itinerary),
      },
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Tour not found." });
    }

    const rows = await query(`${tourSelect} WHERE id = :id LIMIT 1`, {
      id: req.params.id,
    });
    return res.json({ tour: mapTour(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/tours/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await query("DELETE FROM tours WHERE id = :id", {
      id: req.params.id,
    });

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Tour not found." });
    }

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/api/services", async (_req, res, next) => {
  try {
    const rows = await query(`${serviceSelect} ORDER BY created_at ASC`);
    res.json({ services: rows });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/services", requireAdmin, async (req, res, next) => {
  try {
    const validationMessage = validateServicePayload(req.body);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const id = randomUUID();
    await query(
      `
        INSERT INTO services (id, title, description, icon)
        VALUES (:id, :title, :description, :icon)
      `,
      {
        id,
        title: req.body.title.trim(),
        description: req.body.description ?? null,
        icon: req.body.icon || "Plane",
      },
    );

    const rows = await query(`${serviceSelect} WHERE id = :id LIMIT 1`, { id });
    res.status(201).json({ service: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/services/:id", requireAdmin, async (req, res, next) => {
  try {
    const validationMessage = validateServicePayload(req.body);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const result = await query(
      `
        UPDATE services
        SET
          title = :title,
          description = :description,
          icon = :icon,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = :id
      `,
      {
        id: req.params.id,
        title: req.body.title.trim(),
        description: req.body.description ?? null,
        icon: req.body.icon || "Plane",
      },
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Service not found." });
    }

    const rows = await query(`${serviceSelect} WHERE id = :id LIMIT 1`, {
      id: req.params.id,
    });
    return res.json({ service: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/services/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await query("DELETE FROM services WHERE id = :id", {
      id: req.params.id,
    });

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Service not found." });
    }

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/enquiries", async (req, res, next) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const phone = String(req.body?.phone ?? "").trim();

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required." });
    }

    const id = randomUUID();
    await query(
      `
        INSERT INTO enquiries (
          id, name, email, phone, destination, message, travel_date, status
        ) VALUES (
          :id, :name, :email, :phone, :destination, :message, :travel_date, :status
        )
      `,
      {
        id,
        name,
        email: req.body.email ?? null,
        phone,
        destination: req.body.destination ?? null,
        message: req.body.message ?? null,
        travel_date: req.body.travel_date ?? null,
        status: validEnquiryStatuses.has(req.body.status) ? req.body.status : "new",
      },
    );

    const rows = await query(`${enquirySelect} WHERE id = :id LIMIT 1`, { id });
    res.status(201).json({ enquiry: mapEnquiry(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/enquiries", requireAdmin, async (_req, res, next) => {
  try {
    const rows = await query(`${enquirySelect} ORDER BY created_at DESC`);
    res.json({ enquiries: rows.map(mapEnquiry) });
  } catch (error) {
    next(error);
  }
});

app.patch(
  "/api/admin/enquiries/:id/status",
  requireAdmin,
  async (req, res, next) => {
    try {
      const status = String(req.body?.status ?? "");

      if (!validEnquiryStatuses.has(status)) {
        return res.status(400).json({ message: "Invalid enquiry status." });
      }

      const result = await query(
        "UPDATE enquiries SET status = :status WHERE id = :id",
        {
          id: req.params.id,
          status,
        },
      );

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Enquiry not found." });
      }

      const rows = await query(`${enquirySelect} WHERE id = :id LIMIT 1`, {
        id: req.params.id,
      });
      return res.json({ enquiry: mapEnquiry(rows[0]) });
    } catch (error) {
      next(error);
    }
  },
);

app.delete(
  "/api/admin/enquiries/:id",
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await query("DELETE FROM enquiries WHERE id = :id", {
        id: req.params.id,
      });

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Enquiry not found." });
      }

      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

app.use((error, _req, res, _next) => {
  const message =
    error instanceof Error ? error.message : "Unexpected server error.";
  console.error(message);
  res.status(500).json({ message });
});

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
