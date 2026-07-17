Sandis Tours Hostinger Node Upload

This archive is for a single Hostinger Node.js deployment that serves:
- the React website
- the admin panel
- the /api backend

Use these deployment settings in Hostinger:
- Framework preset: Other
- Branch: codex/fix-vercel-api-routing
- Node version: 22.x
- Root directory: ./
- Package manager: npm
- Entry file: server/index.js
- Build command: npm run build
- Output directory: dist

Required environment variables:
- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=u423279241_Sandis_tours
- DB_PASSWORD=YOUR_REAL_MYSQL_PASSWORD
- DB_NAME=u423279241_sandis_tours
- ADMIN_SESSION_HOURS=168
- VITE_API_URL=/api
- VITE_GA4_MEASUREMENT_ID=G-8TF1T8DHN4

After upload and deploy, test:
- /api/health
- /api/packages
- /holidays
- /sandis_tours_26

Important:
- Remove any old PHP api/ folder from live hosting if it still exists.
- Do not set NODE_ENV manually in Hostinger env vars for this Vite build.
