import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";

import { requireAdmin, signAdminToken } from "./auth.js";
import { query } from "./db.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);
app.use(express.json({ limit: "2mb" }));

const allowedImageMimeTypes = new Set(["image/png", "image/jpeg"]);
const allowedImageExtensions = new Set([".png", ".jpg", ".jpeg"]);

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const extension = file.originalname
      .slice(file.originalname.lastIndexOf("."))
      .toLowerCase();
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

app.get("/", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sandis API</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f7f3ea;
            color: #1f2937;
          }
          .wrap {
            max-width: 760px;
            margin: 48px auto;
            padding: 24px;
          }
          .card {
            background: #ffffff;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
          }
          h1 {
            margin: 0 0 12px;
            font-size: 28px;
          }
          p {
            line-height: 1.6;
          }
          a {
            color: #c96a00;
            text-decoration: none;
            font-weight: 600;
          }
          ul {
            padding-left: 18px;
          }
          code {
            background: #f4f4f5;
            padding: 2px 6px;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <h1>Sandis API is running</h1>
            <p>
              This address is the backend server, so opening <code>localhost:4000</code>
              will not show the website homepage.
            </p>
            <p>
              Open the frontend in your browser at
              <a href="http://localhost:8082" target="_blank" rel="noreferrer">http://localhost:8082</a>.
            </p>
            <ul>
              <li>API health check: <a href="/api/health">/api/health</a></li>
              <li>Admin login: open the frontend, then go to <code>/admin/login</code></li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.get("/api/health", async (_req, res, next) => {
  try {
    await query("SELECT 1 AS ok");
    res.json({ ok: true, database: process.env.DB_NAME });
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
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Please choose an image file." });
      }

      const uploadId = randomUUID();

      await query(
        `
          INSERT INTO media_uploads (id, file_name, mime_type, byte_size, content)
          VALUES (:id, :file_name, :mime_type, :byte_size, :content)
        `,
        {
          id: uploadId,
          file_name: req.file.originalname,
          mime_type: req.file.mimetype,
          byte_size: req.file.size,
          content: req.file.buffer,
        },
      );

      return res.status(201).json({
        url: `/api/uploads/${uploadId}`,
        uploadId,
      });
    } catch (error) {
      return next(error);
    }
  },
);

app.get("/api/uploads/:id", async (req, res, next) => {
  try {
    const rows = await query(
      `
        SELECT id, file_name, mime_type, byte_size, content
        FROM media_uploads
        WHERE id = :id
        LIMIT 1
      `,
      { id: req.params.id },
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "Image not found." });
    }

    const upload = rows[0];
    res.setHeader("Content-Type", upload.mime_type);
    res.setHeader("Content-Length", String(upload.byte_size));
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(upload.file_name)}"`,
    );
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(upload.content);
  } catch (error) {
    return next(error);
  }
});

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
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image is too large. Please upload a file smaller than 4 MB.",
    });
  }

  const message =
    error instanceof Error ? error.message : "Unexpected server error.";
  console.error(message);
  return res.status(500).json({ message });
});

export default app;
