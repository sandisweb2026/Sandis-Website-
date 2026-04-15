# Sandis MySQL Backend Setup

This project now uses a Node/Express API with MySQL instead of Supabase.

## 1. Configure environment

Create a `.env` file in the project root using `.env.example` as the template.

Recommended starting values:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=sandis
API_PORT=4000
JWT_SECRET=change-this-to-a-long-random-secret
VITE_API_URL=http://localhost:4000/api
```

Update `DB_USER` and `DB_PASSWORD` to match your local MySQL account.

## 2. Create tables in the `sandis` database

Run the SQL from [server/mysql/schema.sql](/d:/webakoof/sandis%20tours%20website/sandis-tour-website/server/mysql/schema.sql) in your MySQL client or MySQL Workbench while connected to the `sandis` database.

It creates:

- `admins`
- `tours`
- `services`
- `enquiries`

## 3. Create the single admin login

After the schema exists and `.env` is filled in, run:

```bash
npm run admin:create -- admin@example.com yourpassword "Sandis Admin"
```

You can run the same command again later with the same email to reset the admin password.

## 4. Start the app

Start the API:

```bash
npm run dev:server
```

Start the frontend:

```bash
npm run dev
```

Or start both together:

```bash
npm run dev:full
```

Frontend:

- `http://localhost:8080`

API health check:

- `http://localhost:4000/api/health`

## API overview

Public routes:

- `GET /api/tours`
- `GET /api/tours/:id`
- `GET /api/services`
- `POST /api/enquiries`

Admin routes:

- `POST /api/admin/login`
- `GET /api/admin/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/enquiries`
- `PATCH /api/admin/enquiries/:id/status`
- `DELETE /api/admin/enquiries/:id`
- `POST /api/admin/tours`
- `PUT /api/admin/tours/:id`
- `DELETE /api/admin/tours/:id`
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`
