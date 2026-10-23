# Welcome to your Lovable project

# Sandis Tours Website

Sandis International Tours & Travels website with a React/Vite frontend and
an Express/MySQL backend.

## Single-domain production deployment

The project is configured to deploy the frontend and backend together on one
domain. `server/index.js` starts the Express server, `/api/*` serves the API,
and the same server serves the built Vite files from `dist` and provides SPA
fallback routing.

### Hostinger Node deployment settings

Use the `main` branch and repository root (`./`):

```text
Framework preset: Other
Node version: 20.x
Build command: npm run build
Output directory: dist
Entry file: server/index.js
```

Set these runtime environment variables on the `sandis.com` deployment. Use
the existing MySQL database credentials; do not create a new database during
the switch.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_existing_mysql_user
DB_PASSWORD=your_existing_mysql_password
DB_NAME=your_existing_database
ADMIN_SESSION_HOURS=168
```

For the frontend build environment, keep the API same-origin:

```env
VITE_API_URL=/api
VITE_SITE_URL=https://www.sandis.com
```

After saving variables, redeploy the application. Verify:

- `https://www.sandis.com/api` returns the API status response.
- `https://www.sandis.com/api/health` returns `{ "ok": true }` when MySQL is connected.
- `https://www.sandis.com/sandis_tours_26` opens the admin login.

Existing tours, enquiries, banners, settings, and admin records remain in the
same MySQL database. Do not drop tables or change `DB_NAME` during deployment.

## Local development

```bash
npm install
npm run dev:full
```

The Vite frontend runs on port `8082` and proxies `/api` to the local backend
on port `4000`.
