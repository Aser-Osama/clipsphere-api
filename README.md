# ClipSphere API

ClipSphere API is a Node.js/Express backend for a social short-video platform, with JWT authentication, RBAC-protected admin endpoints, user/follow graph flows, video metadata and reviews, Swagger API documentation, and a consolidated Postman collection for Phase 1 verification.

The backend application now lives under `backend/` within this repository.

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB running locally or remotely
- Environment variables configured in `backend/.env`

Required environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clipsphere
JWT_SECRET=your_secret_key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5000
```

`CORS_ORIGINS` is optional, but recommended when using Swagger UI from GitHub Pages so browser `Execute` requests are allowed.
In development (`NODE_ENV` not set to `production`), any `https://*.github.io` origin is allowed automatically.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy environment template:

```bash
cp backend/.env.example backend/.env
```

3. Start MongoDB:

If you already have MongoDB running locally, keep using that. Otherwise, the bundled Docker Compose file will start a local MongoDB instance for the Phase 1 app:

```bash
cd backend
npm run deps:up
```

4. Start the API in development mode:

```bash
cd backend
npm run dev
```

Or start both together:

```bash
cd backend
npm run dev:with-deps
```

When you are done with the Docker-based MongoDB dependency:

```bash
cd backend
npm run deps:down
```

## MinIO Object Storage

ClipSphere uses MinIO as an S3-compatible object storage service for video and avatar files.

### Setup

MinIO is started alongside MongoDB with:

```bash
cd backend
npm run deps:up
```

This starts both MongoDB and MinIO containers.

### MinIO Console

Access the MinIO web console at: http://localhost:9001

Default credentials:
- Username: `minioadmin`
- Password: `minioadmin`

### Buckets

Two buckets are auto-created when the server starts:
- `clipsphere-videos` — video file storage
- `clipsphere-avatars` — user avatar storage

### Requirements

**ffmpeg** and **ffprobe** must be installed on the host system for video duration validation:

```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Verify installation
ffmpeg -version
ffprobe -version
```

### Media API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/videos/upload` | Bearer token | Upload video file + metadata |
| GET | `/api/v1/videos/:id/stream` | Public | Get presigned URL for video playback |
| POST | `/api/v1/users/avatar` | Bearer token | Upload avatar image |
| GET | `/api/v1/users/:id/avatar` | Public | Get presigned URL for avatar |

### Environment Variables

Add these to `backend/.env` (see `.env.example`):

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_VIDEOS=clipsphere-videos
MINIO_BUCKET_AVATARS=clipsphere-avatars
MINIO_USE_SSL=false
```

## Swagger

API documentation is available at:

http://localhost:5000/api-docs

This repo can also publish static Swagger docs to GitHub Pages.

Generate OpenAPI JSON from code annotations:

```bash
cd backend
npm run docs:codegen
```

Build static pages content:

```bash
cd backend
npm run docs:build
```

Optional: set a custom backend URL for the generated static docs:

```bash
cd backend
OPENAPI_SERVER_URL=http://localhost:5000 npm run docs:build
```

Swagger UI will show a single editable backend URL field (defaulting to `OPENAPI_SERVER_URL` or `http://localhost:5000`) and append `/api/v1` automatically.

Generated files:

- `backend/docs/openapi.json` (code-generated OpenAPI file)
- `backend/docs-site/index.html` and `backend/docs-site/openapi.json` (GitHub Pages artifact)

GitHub Actions workflow:

- `.github/workflows/pages-swagger.yml`
- Runs on push to `main`/`master` and deploys `backend/docs-site` to GitHub Pages.
- You can enable Pages in repository settings and select GitHub Actions as the source.

## Postman

Use the final merged Phase 1 files in `backend/postman/`:

- Collection: `backend/postman/ClipSphere_Phase1_Final.postman_collection.json`
- Environment: `backend/postman/ClipSphere Local.postman_environment.json`

Import steps:

1. Open Postman and click Import.
2. Import the collection file and the environment file.
3. Select the `ClipSphere Local` environment.
4. Set `baseUrl` (for example `http://localhost:5000`) and run Login to populate `token` automatically.

## Documentation

- ER Diagram: `backend/docs/er-diagram.jpeg`
