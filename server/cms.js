import { randomUUID } from "node:crypto";

import { requireAdmin } from "./auth.js";
import { query } from "./db.js";

const validBannerPages = new Set([
  "home",
  "holidays",
  "holiday-detail",
  "about",
  "contact",
  "gallery",
]);

const toTrimmedString = (value) => String(value ?? "").trim();

const toNullableString = (value) => {
  const normalized = toTrimmedString(value);
  return normalized || null;
};

const toInteger = (value, fallback = 0) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const normalizeBooleanInput = (value, fallback = true) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
};

const toDbBoolean = (value) => (value ? 1 : 0);

const fromDbBoolean = (value) => Number(value) === 1;

const slugify = (value) =>
  toTrimmedString(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const uploadImageToDatabase = async (file) => {
  const uploadId = randomUUID();

  await query(
    `
      INSERT INTO media_uploads (id, file_name, mime_type, byte_size, content)
      VALUES (:id, :file_name, :mime_type, :byte_size, :content)
    `,
    {
      id: uploadId,
      file_name: file.originalname,
      mime_type: file.mimetype,
      byte_size: file.size,
      content: file.buffer,
    },
  );

  return {
    uploadId,
    url: `/api/uploads/${uploadId}`,
  };
};

const normalizeStringList = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => toTrimmedString(item))
    .filter(Boolean);
};

const normalizeItinerary = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;

      const day = toTrimmedString(item.day || item.day_label || `Day ${index + 1}`);
      const title = toTrimmedString(item.title);
      const description = toTrimmedString(item.description);

      if (!title && !description) return null;

      return {
        day,
        title,
        description: description || null,
      };
    })
    .filter(Boolean);
};

const normalizeGalleryItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (typeof item === "string") {
        const imageUrl = toTrimmedString(item);
        if (!imageUrl) return null;

        return {
          image_url: imageUrl,
          title: null,
          alt_text: null,
          display_order: index,
          is_active: true,
        };
      }

      if (!item || typeof item !== "object") return null;

      const imageUrl = toTrimmedString(item.image_url || item.url);
      if (!imageUrl) return null;

      return {
        image_url: imageUrl,
        title: toNullableString(item.title),
        alt_text: toNullableString(item.alt_text),
        display_order: toInteger(item.display_order, index),
        is_active: normalizeBooleanInput(item.is_active, true),
      };
    })
    .filter(Boolean);
};

const pickHeroImageUrl = (row, collections) => {
  if (row.banner_image_url) {
    return row.banner_image_url;
  }

  const activeGalleryImage = collections.gallery_images.find(
    (item) => item.is_active !== false,
  );

  return activeGalleryImage?.image_url ?? null;
};

const mapBanner = (row) => ({
  id: row.id,
  page_key: row.page_key,
  title: row.title,
  subtitle: row.subtitle,
  image_url: row.image_url,
  mobile_image_url: row.mobile_image_url,
  cta_label: row.cta_label,
  cta_link: row.cta_link,
  display_order: Number(row.display_order ?? 0),
  is_active: fromDbBoolean(row.is_active),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const mapCategory = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  display_order: Number(row.display_order ?? 0),
  is_active: fromDbBoolean(row.is_active),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const mapPackageBase = (row) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  location: row.location,
  banner_image_url: row.banner_image_url,
  hero_image_url: row.hero_image_url ?? null,
  short_description: row.short_description,
  duration: row.duration,
  trip_type: row.trip_type,
  price_label: row.price_label,
  about_tour: row.about_tour,
  good_for_title: row.good_for_title,
  good_for_description: row.good_for_description,
  vehicles_title: row.vehicles_title,
  vehicles_description: row.vehicles_description,
  attraction_title: row.attraction_title,
  attraction_description: row.attraction_description,
  comfort_title: row.comfort_title,
  comfort_description: row.comfort_description,
  whatsapp_enquiry_message: row.whatsapp_enquiry_message,
  email_enquiry_subject: row.email_enquiry_subject,
  email_enquiry_message: row.email_enquiry_message,
  seo_title: row.seo_title,
  seo_description: row.seo_description,
  is_active: fromDbBoolean(row.is_active),
  created_at: row.created_at,
  updated_at: row.updated_at,
  category: {
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug,
    description: row.category_description,
  },
});

const mapGalleryImage = (row) => ({
  id: row.id,
  image_url: row.image_url,
  title: row.title,
  category: row.category,
  alt_text: row.alt_text,
  display_order: Number(row.display_order ?? 0),
  is_active: fromDbBoolean(row.is_active),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const packageBaseSelect = `
  SELECT
    p.id,
    p.title,
    p.slug,
    p.location,
    p.banner_image_url,
    (
      SELECT pgi.image_url
      FROM package_gallery_images pgi
      WHERE pgi.package_id = p.id
        AND pgi.is_active = 1
      ORDER BY pgi.display_order ASC, pgi.created_at ASC
      LIMIT 1
    ) AS hero_image_url,
    p.short_description,
    p.duration,
    p.trip_type,
    p.price_label,
    p.about_tour,
    p.good_for_title,
    p.good_for_description,
    p.vehicles_title,
    p.vehicles_description,
    p.attraction_title,
    p.attraction_description,
    p.comfort_title,
    p.comfort_description,
    p.whatsapp_enquiry_message,
    p.email_enquiry_subject,
    p.email_enquiry_message,
    p.seo_title,
    p.seo_description,
    p.is_active,
    p.created_at,
    p.updated_at,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    c.description AS category_description
  FROM holiday_packages p
  INNER JOIN holiday_categories c ON c.id = p.category_id
`;

const fetchPackageCollections = async (packageId) => {
  const [itineraryRows, highlightsRows, includedRows, excludedRows, termsRows, galleryRows] =
    await Promise.all([
      query(
        `
          SELECT day_label, title, description, display_order
          FROM package_itinerary
          WHERE package_id = :package_id
          ORDER BY display_order ASC, created_at ASC
        `,
        { package_id: packageId },
      ),
      query(
        `
          SELECT item_text, display_order
          FROM package_highlights
          WHERE package_id = :package_id
          ORDER BY display_order ASC, created_at ASC
        `,
        { package_id: packageId },
      ),
      query(
        `
          SELECT item_text, display_order
          FROM package_included_items
          WHERE package_id = :package_id
          ORDER BY display_order ASC, created_at ASC
        `,
        { package_id: packageId },
      ),
      query(
        `
          SELECT item_text, display_order
          FROM package_excluded_items
          WHERE package_id = :package_id
          ORDER BY display_order ASC, created_at ASC
        `,
        { package_id: packageId },
      ),
      query(
        `
          SELECT item_text, display_order
          FROM package_terms
          WHERE package_id = :package_id
          ORDER BY display_order ASC, created_at ASC
        `,
        { package_id: packageId },
      ),
      query(
        `
          SELECT id, image_url, title, alt_text, display_order, is_active
          FROM package_gallery_images
          WHERE package_id = :package_id
          ORDER BY display_order ASC, created_at ASC
        `,
        { package_id: packageId },
      ),
    ]);

  return {
    itinerary: itineraryRows.map((item) => ({
      day: item.day_label,
      title: item.title,
      description: item.description,
      display_order: Number(item.display_order ?? 0),
    })),
    highlights: highlightsRows.map((item) => item.item_text),
    included_items: includedRows.map((item) => item.item_text),
    excluded_items: excludedRows.map((item) => item.item_text),
    terms: termsRows.map((item) => item.item_text),
    gallery_images: galleryRows.map((item) => ({
      id: item.id,
      image_url: item.image_url,
      title: item.title,
      alt_text: item.alt_text,
      display_order: Number(item.display_order ?? 0),
      is_active: fromDbBoolean(item.is_active),
    })),
  };
};

const buildPackageResponse = async (row) => {
  const collections = await fetchPackageCollections(row.id);

  return {
    ...mapPackageBase(row),
    hero_image_url: pickHeroImageUrl(row, collections),
    ...collections,
  };
};

const ensureUniqueSlug = async (tableName, columnName, desiredSlug, excludeId) => {
  const base = slugify(desiredSlug || "item");
  let candidate = base || "item";
  let counter = 1;

  while (true) {
    const rows = await query(
      `
        SELECT id
        FROM ${tableName}
        WHERE ${columnName} = :slug
        ${excludeId ? "AND id != :exclude_id" : ""}
        LIMIT 1
      `,
      excludeId
        ? { slug: candidate, exclude_id: excludeId }
        : { slug: candidate },
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return candidate;
    }

    candidate = `${base}-${counter}`;
    counter += 1;
  }
};

const replacePackageCollections = async (packageId, payload) => {
  await Promise.all([
    query("DELETE FROM package_itinerary WHERE package_id = :package_id", {
      package_id: packageId,
    }),
    query("DELETE FROM package_highlights WHERE package_id = :package_id", {
      package_id: packageId,
    }),
    query("DELETE FROM package_included_items WHERE package_id = :package_id", {
      package_id: packageId,
    }),
    query("DELETE FROM package_excluded_items WHERE package_id = :package_id", {
      package_id: packageId,
    }),
    query("DELETE FROM package_terms WHERE package_id = :package_id", {
      package_id: packageId,
    }),
    query("DELETE FROM package_gallery_images WHERE package_id = :package_id", {
      package_id: packageId,
    }),
  ]);

  for (let index = 0; index < payload.itinerary.length; index += 1) {
    const item = payload.itinerary[index];

    await query(
      `
        INSERT INTO package_itinerary (id, package_id, day_label, title, description, display_order)
        VALUES (:id, :package_id, :day_label, :title, :description, :display_order)
      `,
      {
        id: randomUUID(),
        package_id: packageId,
        day_label: item.day,
        title: item.title,
        description: item.description,
        display_order: index,
      },
    );
  }

  for (let index = 0; index < payload.highlights.length; index += 1) {
    await query(
      `
        INSERT INTO package_highlights (id, package_id, item_text, display_order)
        VALUES (:id, :package_id, :item_text, :display_order)
      `,
      {
        id: randomUUID(),
        package_id: packageId,
        item_text: payload.highlights[index],
        display_order: index,
      },
    );
  }

  for (let index = 0; index < payload.included_items.length; index += 1) {
    await query(
      `
        INSERT INTO package_included_items (id, package_id, item_text, display_order)
        VALUES (:id, :package_id, :item_text, :display_order)
      `,
      {
        id: randomUUID(),
        package_id: packageId,
        item_text: payload.included_items[index],
        display_order: index,
      },
    );
  }

  for (let index = 0; index < payload.excluded_items.length; index += 1) {
    await query(
      `
        INSERT INTO package_excluded_items (id, package_id, item_text, display_order)
        VALUES (:id, :package_id, :item_text, :display_order)
      `,
      {
        id: randomUUID(),
        package_id: packageId,
        item_text: payload.excluded_items[index],
        display_order: index,
      },
    );
  }

  for (let index = 0; index < payload.terms.length; index += 1) {
    await query(
      `
        INSERT INTO package_terms (id, package_id, item_text, display_order)
        VALUES (:id, :package_id, :item_text, :display_order)
      `,
      {
        id: randomUUID(),
        package_id: packageId,
        item_text: payload.terms[index],
        display_order: index,
      },
    );
  }

  for (let index = 0; index < payload.gallery_images.length; index += 1) {
    const item = payload.gallery_images[index];

    await query(
      `
        INSERT INTO package_gallery_images (
          id,
          package_id,
          image_url,
          title,
          alt_text,
          display_order,
          is_active
        ) VALUES (
          :id,
          :package_id,
          :image_url,
          :title,
          :alt_text,
          :display_order,
          :is_active
        )
      `,
      {
        id: randomUUID(),
        package_id: packageId,
        image_url: item.image_url,
        title: item.title,
        alt_text: item.alt_text,
        display_order: toInteger(item.display_order, index),
        is_active: toDbBoolean(normalizeBooleanInput(item.is_active, true)),
      },
    );
  }
};

const parsePackagePayload = (body = {}) => {
  const title = toTrimmedString(body.title || body.package_title);
  const categoryId = toTrimmedString(body.category_id || body.categoryId);

  if (!title) {
    return { error: "Package title is required." };
  }

  if (!categoryId) {
    return { error: "Category is required." };
  }

  return {
    value: {
      title,
      slug: toTrimmedString(body.slug),
      category_id: categoryId,
      location: toNullableString(body.location),
      banner_image_url: toNullableString(body.banner_image_url),
      short_description: toNullableString(body.short_description),
      duration: toNullableString(body.duration),
      trip_type: toNullableString(body.trip_type),
      price_label: toNullableString(body.price_label || body.price),
      about_tour: toNullableString(body.about_tour),
      good_for_title: toNullableString(body.good_for_title),
      good_for_description: toNullableString(body.good_for_description),
      vehicles_title: toNullableString(body.vehicles_title),
      vehicles_description: toNullableString(body.vehicles_description),
      attraction_title: toNullableString(body.attraction_title),
      attraction_description: toNullableString(body.attraction_description),
      comfort_title: toNullableString(body.comfort_title),
      comfort_description: toNullableString(body.comfort_description),
      whatsapp_enquiry_message: toNullableString(body.whatsapp_enquiry_message),
      email_enquiry_subject: toNullableString(body.email_enquiry_subject),
      email_enquiry_message: toNullableString(body.email_enquiry_message),
      seo_title: toNullableString(body.seo_title),
      seo_description: toNullableString(body.seo_description),
      is_active: normalizeBooleanInput(body.is_active, true),
      itinerary: normalizeItinerary(body.itinerary),
      highlights: normalizeStringList(body.highlights),
      included_items: normalizeStringList(
        body.included_items ?? body.whats_included,
      ),
      excluded_items: normalizeStringList(
        body.excluded_items ?? body.whats_excluded,
      ),
      terms: normalizeStringList(
        body.terms ?? body.terms_and_conditions,
      ),
      gallery_images: normalizeGalleryItems(body.gallery_images ?? body.gallery),
    },
  };
};

const querySinglePackageById = async (id) => {
  const rows = await query(
    `${packageBaseSelect} WHERE p.id = :id LIMIT 1`,
    { id },
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return rows[0];
};

const querySinglePackageBySlug = async (slug, includeInactive = false) => {
  const rows = await query(
    `${packageBaseSelect} WHERE p.slug = :slug ${includeInactive ? "" : "AND p.is_active = 1"} LIMIT 1`,
    { slug },
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const getCmsDashboardStats = async () => {
  const [packages, categories, banners, gallery] = await Promise.all([
    query("SELECT COUNT(*) AS count FROM holiday_packages"),
    query("SELECT COUNT(*) AS count FROM holiday_categories"),
    query("SELECT COUNT(*) AS count FROM banners"),
    query("SELECT COUNT(*) AS count FROM gallery_images"),
  ]);

  return {
    packages: Number(packages[0]?.count ?? 0),
    categories: Number(categories[0]?.count ?? 0),
    banners: Number(banners[0]?.count ?? 0),
    galleryImages: Number(gallery[0]?.count ?? 0),
  };
};

export const registerCmsRoutes = (app, imageUpload) => {
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

        const upload = await uploadImageToDatabase(req.file);

        return res.status(201).json({
          url: upload.url,
          uploadId: upload.uploadId,
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

  app.get("/api/banners", async (req, res, next) => {
    try {
      const pageKey = toTrimmedString(req.query.page);
      const onlyActive = normalizeBooleanInput(req.query.active, true);

      if (pageKey && !validBannerPages.has(pageKey)) {
        return res.status(400).json({
          message: `Invalid page key. Allowed: ${Array.from(validBannerPages).join(", ")}`,
        });
      }

      const rows = await query(
        `
          SELECT id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active, created_at, updated_at
          FROM banners
          WHERE (:has_page_key = 0 OR page_key = :page_key)
            AND (:only_active = 0 OR is_active = 1)
          ORDER BY page_key ASC, display_order ASC, created_at DESC
        `,
        {
          page_key: pageKey,
          has_page_key: pageKey ? 1 : 0,
          only_active: onlyActive ? 1 : 0,
        },
      );

      return res.json({ banners: rows.map(mapBanner) });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/admin/banners", requireAdmin, async (_req, res, next) => {
    try {
      const rows = await query(
        `
          SELECT id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active, created_at, updated_at
          FROM banners
          ORDER BY page_key ASC, display_order ASC, created_at DESC
        `,
      );

      return res.json({ banners: rows.map(mapBanner) });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/admin/banners", requireAdmin, async (req, res, next) => {
    try {
      const pageKey = toTrimmedString(req.body?.page_key).toLowerCase();
      const imageUrl = toTrimmedString(req.body?.image_url);

      if (!validBannerPages.has(pageKey)) {
        return res.status(400).json({
          message: `Invalid page key. Allowed: ${Array.from(validBannerPages).join(", ")}`,
        });
      }

      if (!imageUrl) {
        return res.status(400).json({ message: "Banner image URL is required." });
      }

      const id = randomUUID();

      await query(
        `
          INSERT INTO banners (
            id,
            page_key,
            title,
            subtitle,
            image_url,
            mobile_image_url,
            cta_label,
            cta_link,
            display_order,
            is_active
          ) VALUES (
            :id,
            :page_key,
            :title,
            :subtitle,
            :image_url,
            :mobile_image_url,
            :cta_label,
            :cta_link,
            :display_order,
            :is_active
          )
        `,
        {
          id,
          page_key: pageKey,
          title: toNullableString(req.body?.title),
          subtitle: toNullableString(req.body?.subtitle),
          image_url: imageUrl,
          mobile_image_url: toNullableString(req.body?.mobile_image_url),
          cta_label: toNullableString(req.body?.cta_label),
          cta_link: toNullableString(req.body?.cta_link),
          display_order: toInteger(req.body?.display_order, 0),
          is_active: toDbBoolean(normalizeBooleanInput(req.body?.is_active, true)),
        },
      );

      const rows = await query(
        `
          SELECT id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active, created_at, updated_at
          FROM banners
          WHERE id = :id
          LIMIT 1
        `,
        { id },
      );

      return res.status(201).json({ banner: mapBanner(rows[0]) });
    } catch (error) {
      return next(error);
    }
  });

  app.put("/api/admin/banners/:id", requireAdmin, async (req, res, next) => {
    try {
      const pageKey = toTrimmedString(req.body?.page_key).toLowerCase();
      const imageUrl = toTrimmedString(req.body?.image_url);

      if (!validBannerPages.has(pageKey)) {
        return res.status(400).json({
          message: `Invalid page key. Allowed: ${Array.from(validBannerPages).join(", ")}`,
        });
      }

      if (!imageUrl) {
        return res.status(400).json({ message: "Banner image URL is required." });
      }

      const result = await query(
        `
          UPDATE banners
          SET
            page_key = :page_key,
            title = :title,
            subtitle = :subtitle,
            image_url = :image_url,
            mobile_image_url = :mobile_image_url,
            cta_label = :cta_label,
            cta_link = :cta_link,
            display_order = :display_order,
            is_active = :is_active,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = :id
        `,
        {
          id: req.params.id,
          page_key: pageKey,
          title: toNullableString(req.body?.title),
          subtitle: toNullableString(req.body?.subtitle),
          image_url: imageUrl,
          mobile_image_url: toNullableString(req.body?.mobile_image_url),
          cta_label: toNullableString(req.body?.cta_label),
          cta_link: toNullableString(req.body?.cta_link),
          display_order: toInteger(req.body?.display_order, 0),
          is_active: toDbBoolean(normalizeBooleanInput(req.body?.is_active, true)),
        },
      );

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Banner not found." });
      }

      const rows = await query(
        `
          SELECT id, page_key, title, subtitle, image_url, mobile_image_url, cta_label, cta_link, display_order, is_active, created_at, updated_at
          FROM banners
          WHERE id = :id
          LIMIT 1
        `,
        { id: req.params.id },
      );

      return res.json({ banner: mapBanner(rows[0]) });
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/api/admin/banners/:id", requireAdmin, async (req, res, next) => {
    try {
      const result = await query("DELETE FROM banners WHERE id = :id", {
        id: req.params.id,
      });

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Banner not found." });
      }

      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/categories", async (req, res, next) => {
    try {
      const includeInactive = normalizeBooleanInput(req.query.include_inactive, false);

      const rows = await query(
        `
          SELECT id, name, slug, description, display_order, is_active, created_at, updated_at
          FROM holiday_categories
          WHERE (:include_inactive = 1 OR is_active = 1)
          ORDER BY display_order ASC, created_at ASC
        `,
        {
          include_inactive: includeInactive ? 1 : 0,
        },
      );

      return res.json({ categories: rows.map(mapCategory) });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/admin/categories", requireAdmin, async (_req, res, next) => {
    try {
      const rows = await query(
        `
          SELECT id, name, slug, description, display_order, is_active, created_at, updated_at
          FROM holiday_categories
          ORDER BY display_order ASC, created_at ASC
        `,
      );

      return res.json({ categories: rows.map(mapCategory) });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/admin/categories", requireAdmin, async (req, res, next) => {
    try {
      const name = toTrimmedString(req.body?.name);

      if (!name) {
        return res.status(400).json({ message: "Category name is required." });
      }

      const requestedSlug = toTrimmedString(req.body?.slug || name);
      const slug = await ensureUniqueSlug(
        "holiday_categories",
        "slug",
        requestedSlug,
      );
      const id = randomUUID();

      await query(
        `
          INSERT INTO holiday_categories (
            id,
            name,
            slug,
            description,
            display_order,
            is_active
          ) VALUES (
            :id,
            :name,
            :slug,
            :description,
            :display_order,
            :is_active
          )
        `,
        {
          id,
          name,
          slug,
          description: toNullableString(req.body?.description),
          display_order: toInteger(req.body?.display_order, 0),
          is_active: toDbBoolean(normalizeBooleanInput(req.body?.is_active, true)),
        },
      );

      const rows = await query(
        `
          SELECT id, name, slug, description, display_order, is_active, created_at, updated_at
          FROM holiday_categories
          WHERE id = :id
          LIMIT 1
        `,
        { id },
      );

      return res.status(201).json({ category: mapCategory(rows[0]) });
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("duplicate")) {
        return res.status(400).json({ message: "Category name already exists." });
      }
      return next(error);
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res, next) => {
    try {
      const name = toTrimmedString(req.body?.name);

      if (!name) {
        return res.status(400).json({ message: "Category name is required." });
      }

      const requestedSlug = toTrimmedString(req.body?.slug || name);
      const slug = await ensureUniqueSlug(
        "holiday_categories",
        "slug",
        requestedSlug,
        req.params.id,
      );

      const result = await query(
        `
          UPDATE holiday_categories
          SET
            name = :name,
            slug = :slug,
            description = :description,
            display_order = :display_order,
            is_active = :is_active,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = :id
        `,
        {
          id: req.params.id,
          name,
          slug,
          description: toNullableString(req.body?.description),
          display_order: toInteger(req.body?.display_order, 0),
          is_active: toDbBoolean(normalizeBooleanInput(req.body?.is_active, true)),
        },
      );

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Category not found." });
      }

      const rows = await query(
        `
          SELECT id, name, slug, description, display_order, is_active, created_at, updated_at
          FROM holiday_categories
          WHERE id = :id
          LIMIT 1
        `,
        { id: req.params.id },
      );

      return res.json({ category: mapCategory(rows[0]) });
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("duplicate")) {
        return res.status(400).json({ message: "Category name already exists." });
      }
      return next(error);
    }
  });

  app.delete(
    "/api/admin/categories/:id",
    requireAdmin,
    async (req, res, next) => {
      try {
        const result = await query(
          "DELETE FROM holiday_categories WHERE id = :id",
          {
            id: req.params.id,
          },
        );

        if (!result.affectedRows) {
          return res.status(404).json({ message: "Category not found." });
        }

        return res.status(204).end();
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.includes("foreign key") ||
            error.message.includes("Cannot delete or update"))
        ) {
          return res.status(400).json({
            message:
              "This category is used by holiday packages. Reassign those packages first.",
          });
        }
        return next(error);
      }
    },
  );

  app.get("/api/packages", async (req, res, next) => {
    try {
      const categorySlug = toTrimmedString(req.query.category);
      const includeInactive = normalizeBooleanInput(req.query.include_inactive, false);

      const rows = await query(
        `
          ${packageBaseSelect}
          WHERE (:has_category_slug = 0 OR c.slug = :category_slug)
            AND (:include_inactive = 1 OR p.is_active = 1)
          ORDER BY c.display_order ASC, p.created_at DESC
        `,
        {
          category_slug: categorySlug,
          has_category_slug: categorySlug ? 1 : 0,
          include_inactive: includeInactive ? 1 : 0,
        },
      );

      return res.json({
        packages: rows.map((item) => mapPackageBase(item)),
      });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/packages/:slug", async (req, res, next) => {
    try {
      const row = await querySinglePackageBySlug(req.params.slug);

      if (!row) {
        return res.status(404).json({ message: "Holiday package not found." });
      }

      return res.json({ package: await buildPackageResponse(row) });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/admin/packages", requireAdmin, async (_req, res, next) => {
    try {
      const rows = await query(
        `
          ${packageBaseSelect}
          ORDER BY c.display_order ASC, p.created_at DESC
        `,
      );

      return res.json({
        packages: rows.map((item) => mapPackageBase(item)),
      });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/admin/packages/:id", requireAdmin, async (req, res, next) => {
    try {
      const row = await querySinglePackageById(req.params.id);

      if (!row) {
        return res.status(404).json({ message: "Holiday package not found." });
      }

      return res.json({ package: await buildPackageResponse(row) });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/admin/packages", requireAdmin, async (req, res, next) => {
    try {
      const parsed = parsePackagePayload(req.body);
      if (parsed.error) {
        return res.status(400).json({ message: parsed.error });
      }

      const payload = parsed.value;

      const categoryRows = await query(
        "SELECT id FROM holiday_categories WHERE id = :id LIMIT 1",
        { id: payload.category_id },
      );

      if (!Array.isArray(categoryRows) || categoryRows.length === 0) {
        return res.status(400).json({ message: "Invalid category selected." });
      }

      const id = randomUUID();
      const slug = await ensureUniqueSlug(
        "holiday_packages",
        "slug",
        payload.slug || payload.title,
      );

      await query(
        `
          INSERT INTO holiday_packages (
            id,
            category_id,
            title,
            slug,
            location,
            banner_image_url,
            short_description,
            duration,
            trip_type,
            price_label,
            about_tour,
            good_for_title,
            good_for_description,
            vehicles_title,
            vehicles_description,
            attraction_title,
            attraction_description,
            comfort_title,
            comfort_description,
            whatsapp_enquiry_message,
            email_enquiry_subject,
            email_enquiry_message,
            seo_title,
            seo_description,
            is_active
          ) VALUES (
            :id,
            :category_id,
            :title,
            :slug,
            :location,
            :banner_image_url,
            :short_description,
            :duration,
            :trip_type,
            :price_label,
            :about_tour,
            :good_for_title,
            :good_for_description,
            :vehicles_title,
            :vehicles_description,
            :attraction_title,
            :attraction_description,
            :comfort_title,
            :comfort_description,
            :whatsapp_enquiry_message,
            :email_enquiry_subject,
            :email_enquiry_message,
            :seo_title,
            :seo_description,
            :is_active
          )
        `,
        {
          ...payload,
          id,
          slug,
          is_active: toDbBoolean(payload.is_active),
        },
      );

      await replacePackageCollections(id, payload);

      const row = await querySinglePackageById(id);

      return res.status(201).json({
        package: await buildPackageResponse(row),
      });
    } catch (error) {
      return next(error);
    }
  });

  app.put("/api/admin/packages/:id", requireAdmin, async (req, res, next) => {
    try {
      const existing = await querySinglePackageById(req.params.id);

      if (!existing) {
        return res.status(404).json({ message: "Holiday package not found." });
      }

      const parsed = parsePackagePayload(req.body);
      if (parsed.error) {
        return res.status(400).json({ message: parsed.error });
      }

      const payload = parsed.value;

      const categoryRows = await query(
        "SELECT id FROM holiday_categories WHERE id = :id LIMIT 1",
        { id: payload.category_id },
      );

      if (!Array.isArray(categoryRows) || categoryRows.length === 0) {
        return res.status(400).json({ message: "Invalid category selected." });
      }

      const slug = await ensureUniqueSlug(
        "holiday_packages",
        "slug",
        payload.slug || payload.title,
        req.params.id,
      );

      const result = await query(
        `
          UPDATE holiday_packages
          SET
            category_id = :category_id,
            title = :title,
            slug = :slug,
            location = :location,
            banner_image_url = :banner_image_url,
            short_description = :short_description,
            duration = :duration,
            trip_type = :trip_type,
            price_label = :price_label,
            about_tour = :about_tour,
            good_for_title = :good_for_title,
            good_for_description = :good_for_description,
            vehicles_title = :vehicles_title,
            vehicles_description = :vehicles_description,
            attraction_title = :attraction_title,
            attraction_description = :attraction_description,
            comfort_title = :comfort_title,
            comfort_description = :comfort_description,
            whatsapp_enquiry_message = :whatsapp_enquiry_message,
            email_enquiry_subject = :email_enquiry_subject,
            email_enquiry_message = :email_enquiry_message,
            seo_title = :seo_title,
            seo_description = :seo_description,
            is_active = :is_active,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = :id
        `,
        {
          ...payload,
          id: req.params.id,
          slug,
          is_active: toDbBoolean(payload.is_active),
        },
      );

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Holiday package not found." });
      }

      await replacePackageCollections(req.params.id, payload);

      const row = await querySinglePackageById(req.params.id);

      return res.json({ package: await buildPackageResponse(row) });
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/api/admin/packages/:id", requireAdmin, async (req, res, next) => {
    try {
      const result = await query(
        "DELETE FROM holiday_packages WHERE id = :id",
        { id: req.params.id },
      );

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Holiday package not found." });
      }

      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/gallery-images", async (req, res, next) => {
    try {
      const category = toTrimmedString(req.query.category);
      const includeInactive = normalizeBooleanInput(req.query.include_inactive, false);

      const rows = await query(
        `
          SELECT id, image_url, title, category, alt_text, display_order, is_active, created_at, updated_at
          FROM gallery_images
          WHERE (:has_category = 0 OR category = :category)
            AND (:include_inactive = 1 OR is_active = 1)
          ORDER BY display_order ASC, created_at DESC
        `,
        {
          category,
          has_category: category ? 1 : 0,
          include_inactive: includeInactive ? 1 : 0,
        },
      );

      return res.json({ images: rows.map(mapGalleryImage) });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/admin/gallery-images", requireAdmin, async (_req, res, next) => {
    try {
      const rows = await query(
        `
          SELECT id, image_url, title, category, alt_text, display_order, is_active, created_at, updated_at
          FROM gallery_images
          ORDER BY display_order ASC, created_at DESC
        `,
      );

      return res.json({ images: rows.map(mapGalleryImage) });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/admin/gallery-images", requireAdmin, async (req, res, next) => {
    try {
      const imageUrl = toTrimmedString(req.body?.image_url);

      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required." });
      }

      const id = randomUUID();

      await query(
        `
          INSERT INTO gallery_images (
            id,
            image_url,
            title,
            category,
            alt_text,
            display_order,
            is_active
          ) VALUES (
            :id,
            :image_url,
            :title,
            :category,
            :alt_text,
            :display_order,
            :is_active
          )
        `,
        {
          id,
          image_url: imageUrl,
          title: toNullableString(req.body?.title),
          category: toNullableString(req.body?.category),
          alt_text: toNullableString(req.body?.alt_text),
          display_order: toInteger(req.body?.display_order, 0),
          is_active: toDbBoolean(normalizeBooleanInput(req.body?.is_active, true)),
        },
      );

      const rows = await query(
        `
          SELECT id, image_url, title, category, alt_text, display_order, is_active, created_at, updated_at
          FROM gallery_images
          WHERE id = :id
          LIMIT 1
        `,
        { id },
      );

      return res.status(201).json({ image: mapGalleryImage(rows[0]) });
    } catch (error) {
      return next(error);
    }
  });

  app.put("/api/admin/gallery-images/:id", requireAdmin, async (req, res, next) => {
    try {
      const imageUrl = toTrimmedString(req.body?.image_url);

      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required." });
      }

      const result = await query(
        `
          UPDATE gallery_images
          SET
            image_url = :image_url,
            title = :title,
            category = :category,
            alt_text = :alt_text,
            display_order = :display_order,
            is_active = :is_active,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = :id
        `,
        {
          id: req.params.id,
          image_url: imageUrl,
          title: toNullableString(req.body?.title),
          category: toNullableString(req.body?.category),
          alt_text: toNullableString(req.body?.alt_text),
          display_order: toInteger(req.body?.display_order, 0),
          is_active: toDbBoolean(normalizeBooleanInput(req.body?.is_active, true)),
        },
      );

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Gallery image not found." });
      }

      const rows = await query(
        `
          SELECT id, image_url, title, category, alt_text, display_order, is_active, created_at, updated_at
          FROM gallery_images
          WHERE id = :id
          LIMIT 1
        `,
        { id: req.params.id },
      );

      return res.json({ image: mapGalleryImage(rows[0]) });
    } catch (error) {
      return next(error);
    }
  });

  app.delete(
    "/api/admin/gallery-images/:id",
    requireAdmin,
    async (req, res, next) => {
      try {
        const result = await query(
          "DELETE FROM gallery_images WHERE id = :id",
          {
            id: req.params.id,
          },
        );

        if (!result.affectedRows) {
          return res.status(404).json({ message: "Gallery image not found." });
        }

        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    },
  );

  app.get("/api/settings/public", async (_req, res, next) => {
    try {
      const rows = await query(
        `
          SELECT setting_key, setting_value
          FROM settings
        `,
      );

      const settings = rows.reduce((accumulator, row) => {
        accumulator[row.setting_key] = row.setting_value;
        return accumulator;
      }, {});

      return res.json({ settings });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/admin/settings", requireAdmin, async (_req, res, next) => {
    try {
      const rows = await query(
        `
          SELECT id, setting_key, setting_value, created_at, updated_at
          FROM settings
          ORDER BY setting_key ASC
        `,
      );

      return res.json({ settings: rows });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/admin/settings", requireAdmin, async (req, res, next) => {
    try {
      const settingKey = toTrimmedString(req.body?.setting_key);

      if (!settingKey) {
        return res.status(400).json({ message: "Setting key is required." });
      }

      const existing = await query(
        "SELECT id FROM settings WHERE setting_key = :setting_key LIMIT 1",
        { setting_key: settingKey },
      );

      const settingValue = req.body?.setting_value ?? null;

      if (Array.isArray(existing) && existing.length > 0) {
        await query(
          `
            UPDATE settings
            SET setting_value = :setting_value, updated_at = CURRENT_TIMESTAMP
            WHERE setting_key = :setting_key
          `,
          {
            setting_key: settingKey,
            setting_value: settingValue,
          },
        );
      } else {
        await query(
          `
            INSERT INTO settings (id, setting_key, setting_value)
            VALUES (:id, :setting_key, :setting_value)
          `,
          {
            id: randomUUID(),
            setting_key: settingKey,
            setting_value: settingValue,
          },
        );
      }

      const rows = await query(
        `
          SELECT id, setting_key, setting_value, created_at, updated_at
          FROM settings
          WHERE setting_key = :setting_key
          LIMIT 1
        `,
        { setting_key: settingKey },
      );

      return res.status(201).json({ setting: rows[0] });
    } catch (error) {
      return next(error);
    }
  });
};
