# ClipSphere API

Express + MongoDB REST API for ClipSphere — a short-video sharing platform. Handles authentication, video upload & streaming, media storage (MinIO/S3), reviews, likes, follows, admin moderation, and notifications.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18 + |
| Docker + Docker Compose | any recent |
| ffmpeg | bundled via `@ffmpeg-installer/ffmpeg` — no system install needed |

---

## Quick start

```bash
# 1. Start MongoDB + MinIO (Docker)
npm run deps:up

# 2. Install dependencies (first time)
npm install

# 3. Copy env file and configure
cp .env.example .env   # edit JWT_SECRET at minimum

# 4. Start the dev server
npm run dev
```

Server starts at **http://localhost:5000**. Interactive API docs at **http://localhost:5000/api-docs**.

Alternatively, start deps + server together:

```bash
npm run dev:with-deps
```

---

## Environment variables

Copy `.env.example` to `.env`. All variables and their defaults:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clipsphere
JWT_SECRET=change_me_in_local_env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5000

# MinIO (S3-compatible media storage)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_VIDEOS=clipsphere-videos
MINIO_BUCKET_AVATARS=clipsphere-avatars
MINIO_USE_SSL=false

CLIENT_URL=http://localhost:3000

# SMTP / transactional email (Nodemailer)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=ClipSphere <noreply@clipsphere.local>
```

> **MinIO console** is available at http://localhost:9001 (user/pass: `minioadmin`/`minioadmin`).

---

## API overview

All routes are prefixed with `/api/v1`.

| Group | Prefix | Highlights |
|---|---|---|
| **Auth** | `/auth` | Register, login (JWT in response body) |
| **Users** | `/users` | Get/update profile, avatar upload, follow/unfollow, preferences |
| **Videos** | `/videos` | CRUD, like/unlike, reviews, trending/following feeds |
| **Upload** | `/videos/upload` | Multipart video upload with ffmpeg duration check + thumbnail generation |
| **Stream** | `/videos/:id/stream` | Presigned MinIO URL for playback |
| **Thumbnail** | `/videos/:id/thumbnail` | Presigned MinIO URL for video thumbnail |
| **Admin** | `/admin` | Stats, health, moderation (admin role required) |

Full interactive documentation: **http://localhost:5000/api-docs** (Swagger UI).

### Authentication

Authenticate by sending the JWT from login in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire after **24 hours**.

### Response envelope

All responses follow a consistent JSON shape:

```json
{ "status": "success", "data": { ... } }
{ "status": "error",   "message": "..." }
```

---

## Architecture

Three-layer architecture with clear separation of concerns:

```
Routes  →  Controllers  →  Services  →  Models
                ↓
           Middleware
    (auth, validation, error handling)
```

```
src/
├── app.js              # Express app factory (routes, middleware, Swagger)
├── server.js           # Entry point — DB connect, bucket init, listen
├── config/             # S3 client, Swagger spec
├── controllers/        # Request/response handling, HTTP layer only
├── services/           # Business logic, DB queries, external integrations
├── models/             # Mongoose schemas (User, Video, Review, Like, Follower, Notification)
├── routes/             # Express routers, one file per resource group
├── middleware/         # JWT protect, restrictTo(role), Zod validation, error handler
├── validators/         # Zod schemas for request bodies
└── utils/              # thumbnailGenerator, accountState helpers, etc.
```

### Key design rules

- All async route handlers are wrapped in `asyncWrapper` — no unhandled rejections.
- Input validated with **Zod** before controllers run.
- Passwords hashed with **bcrypt** (salt factor 10).
- Queries sanitized with **express-mongo-sanitize** against NoSQL injection.
- RBAC enforced via `protect` (authentication) + `restrictTo('admin')` (role check) middleware.
- Ownership checks gate user-level mutations; admins bypass ownership for moderation.

### Media pipeline

1. Client sends `multipart/form-data` with the video file.
2. **multer** streams the upload to a temp buffer (100 MB limit).
3. **fluent-ffmpeg** probes the file — rejects if duration > 300 s (5 min).
4. Video buffer is uploaded to MinIO (`clipsphere-videos` bucket).
5. ffmpeg extracts a JPEG frame at the 1-second mark and uploads it as a thumbnail.
6. MongoDB document is written with `key` and `thumbnailKey` only after both uploads succeed.

---

## npm scripts

| Script | Description |
|---|---|
| `npm run dev` | Start server with `--watch` (Node 18+ built-in) |
| `npm start` | Start server (production) |
| `npm run deps:up` | Start MongoDB + MinIO via Docker Compose |
| `npm run deps:down` | Stop containers |
| `npm run deps:logs` | Stream container logs |
| `npm run dev:with-deps` | `deps:up` then `dev` (one command) |
| `npm run docs:build` | Regenerate Swagger spec to `docs/` |
| `npm test` | Run Postman collection against local server (**destructive** — drops test DB first) |
| `npm run test:seed` | Seed admin user for tests without running the full suite |

> ⚠️ `npm test` drops the database before seeding. Do not run against a database with data you want to keep.

---

## Running the Postman collection manually

Run a single folder from the collection (replace `"Health Check"` with any folder name):

```bash
npx newman run postman/ClipSphere_Phase1_Final.postman_collection.json \
  -e "postman/ClipSphere Local.postman_environment.json" \
  --env-var baseUrl=http://localhost:5000 \
  --folder "Health Check"
```

Available folders: `Auth`, `Users`, `Videos`, `Admin`, `Health Check`.

---

## Data models

| Model | Key fields |
|---|---|
| **User** | `username`, `email`, `password` (hashed), `role` (`user`/`admin`), `active`, `accountStatus`, `bio`, `avatarKey`, `notificationPreferences` |
| **Video** | `title`, `description`, `key`, `thumbnailKey`, `owner` (→ User), `status` (`public`/`private`/`draft`), `duration`, `viewsCount`, `averageRating`, `reviewCount` |
| **Review** | `user` (→ User), `video` (→ Video), `rating` (1–5), `comment` — unique per `(user, video)` |
| **Like** | `user` (→ User), `video` (→ Video) — unique per `(user, video)` |
| **Follower** | `followerId` (→ User), `followingId` (→ User) — unique pair, self-follow prevented |
| **Notification** | `recipient`, `actor`, `type`, `video`, `read` |
