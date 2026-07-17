# Sandis Tours CMS Setup

This project now includes a full Admin CMS for:

- page banners
- holiday categories
- holiday packages + package detail sections
- gallery images
- settings
- enquiries and services

## 1. Environment Variables

Create `.env` from `.env.example`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=sandis
API_PORT=4000
ADMIN_SESSION_HOURS=168
VITE_API_URL=http://localhost:4000/api
```

For Vercel, set the same env vars in Project Settings -> Environment Variables.

## 2. Database Setup

For Hostinger phpMyAdmin, import these files in this order:

1. `sandis.sql`
2. `hostinger-default-data.sql`

The first file creates all tables and the second file ensures default holiday
categories and the admin login exist.

Run schema initialization:

```bash
npm run db:init
```

This creates all required tables, including:

- `admins`
- `banners`
- `holiday_categories`
- `holiday_packages`
- `package_itinerary`
- `package_highlights`
- `package_included_items`
- `package_excluded_items`
- `package_terms`
- `package_gallery_images`
- `gallery_images`
- `settings`
- `admin_sessions`
- plus existing `services`, `enquiries`, `media_uploads`, and legacy `tours` tables

Default holiday categories are auto-seeded:

- Group Tour
- Maharashtra
- India
- International Trip

## 3. Admin Login Setup

Create or reset admin user:

```bash
npm run admin:create -- admin@example.com yourpassword "Sandis Admin"
```

Then login at:

- `http://localhost:8082/admin/login`

## 4. Image Upload Storage

Admin image uploads (banners, package images, gallery) are stored in MySQL `media_uploads` and served through:

- `/api/uploads/:id`

This works locally and with your Hostinger MySQL setup (no Cloudinary required).

## 5. Run Project

```bash
npm install
npm run dev:full
```

URLs:

- Frontend: `http://localhost:8082`
- API: `http://localhost:4000`
- Health: `http://localhost:4000/api/health`

## 6. Admin Pages

After login, use:

- `/admin` dashboard
- `/admin/banners`
- `/admin/categories`
- `/admin/packages`
- `/admin/gallery`
- `/admin/settings`
- `/admin/enquiries`
- `/admin/services`
