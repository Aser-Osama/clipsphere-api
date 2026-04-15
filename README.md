# ClipSphere

ClipSphere is a full-stack short-video social platform with a Next.js frontend and an Express/MongoDB backend. Users can upload, discover, review, and share short videos. Admins have a dedicated dashboard for platform oversight.

## Architecture

```
Frontend (Next.js 16)  →  API proxy  →  Backend (Express)  →  MongoDB
     :3000                                   :5000              :27017
                                               ↕
                                         MinIO (S3-compat)
                                          :9000 / :9001
```

- **Frontend**: Next.js App Router, Tailwind v4, cookie-based JWT auth
- **Backend**: Express, Mongoose, Zod validation, three-layer architecture (Routes → Controllers → Services)
- **Storage**: MinIO via Docker for video and avatar files, presigned URLs for secure access
- **Email**: Nodemailer with Ethereal fallback for development

## Prerequisites

- **Node.js 18+**
- **Docker Desktop** (for MongoDB and MinIO containers)
- **ffmpeg** installed on your system (for video duration validation)

```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Verify
ffmpeg -version
```

## Quick Start (Full Stack)

### 1. Clone and install

```bash
git clone https://github.com/rghdasalah/clipsphere-api.git
cd clipsphere-api

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../clipsphere-web
npm install
cd ..
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set a real JWT secret:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clipsphere
JWT_SECRET=pick_a_strong_secret_here
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5000

# MinIO (defaults work with Docker Compose)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_VIDEOS=clipsphere-videos
MINIO_BUCKET_AVATARS=clipsphere-avatars
MINIO_USE_SSL=false

CLIENT_URL=http://localhost:3000

# SMTP (leave blank to auto-use Ethereal test accounts)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=ClipSphere <noreply@clipsphere.local>
```

### 3. Start infrastructure (MongoDB + MinIO)

```bash
cd backend
npm run deps:up
```

This starts both containers. Verify they're running:

```bash
docker ps
```

You should see `clipsphere-mongo` (port 27017) and `clipsphere-minio` (ports 9000, 9001).

### 4. Start the backend

```bash
cd backend
npm run dev
```

The API starts on **http://localhost:5000**. On startup it automatically creates the MinIO buckets (`clipsphere-videos` and `clipsphere-avatars`).

### 5. Start the frontend

Open a second terminal:

```bash
cd clipsphere-web
npm run dev
```

The frontend starts on **http://localhost:3000**. It proxies all `/api/v1/*` requests to the backend automatically via Next.js rewrites.

## Verification & Testing

### Access Points

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Next.js app |
| **Backend API** | http://localhost:5000 | Express API |
| **Swagger Docs** | http://localhost:5000/api-docs | Interactive API docs |
| **MinIO Console** | http://localhost:9001 | Login: `minioadmin` / `minioadmin` |

### Test with Postman / Newman

The project includes a Postman collection for Phase 1 API verification.

**Run all tests** (requires backend running + MongoDB seeded):

```bash
cd backend
npm test
```

> ⚠️ `npm test` is destructive — it drops the test database and re-seeds the admin user before running.

**Run a specific folder** (non-destructive):

```bash
cd backend

# Health check only
npx newman run postman/ClipSphere_Phase1_Final.postman_collection.json \
  -e "postman/ClipSphere Local.postman_environment.json" \
  --env-var baseUrl=http://localhost:5000 \
  --folder "Health Check"

# Auth endpoints only
npx newman run postman/ClipSphere_Phase1_Final.postman_collection.json \
  -e "postman/ClipSphere Local.postman_environment.json" \
  --env-var baseUrl=http://localhost:5000 \
  --folder "Auth"
```

Available folders: `Health Check`, `Auth`, `Users`, `Videos`, `Admin`.

### Manual Testing Walkthrough

Here's a step-by-step walkthrough to verify all Phase 2 features:

#### 1. Register & Login

1. Open http://localhost:3000/register
2. Create a new account (username, email, password)
3. Check the backend console for the Ethereal email preview URL (welcome email)
4. You should be redirected to the discovery feed

#### 2. Upload a Video

1. Navigate to http://localhost:3000/upload (or click Upload in the navbar)
2. Select a video file (MP4/WebM/MOV, under 100 MB, under 5 minutes)
3. Fill in title, description, select visibility (public/private)
4. Submit and watch the upload progress bar
5. Verify the video appears on the discovery feed

**Test validation:**
- Try uploading a file over 5 minutes — should be rejected
- Try uploading a non-video file — should be rejected
- Check MinIO console (http://localhost:9001) → `clipsphere-videos` bucket to see the stored file

#### 3. Discovery Feeds

1. Go to http://localhost:3000 (home page)
2. **Trending tab**: Shows videos sorted by average rating and engagement
3. **Following tab** (logged in only): Shows videos from users you follow
4. Scroll down to trigger infinite scroll loading
5. Verify the responsive grid: resize browser to see 1→2→3→4 columns

#### 4. Video Playback & Reviews

1. Click any video card to open the detail page
2. Video should stream via presigned URL from MinIO
3. Use the custom player controls (play/pause, seek, volume, fullscreen)
4. **Like/Unlike**: Click the heart — count should update instantly (optimistic UI)
5. **Write a Review**: Select star rating + comment, submit
6. Review should appear immediately below the player
7. **Ownership check**: Edit/Delete buttons only appear on your own videos and reviews

#### 5. User Profiles

1. Click a username to view their profile
2. See their uploaded videos grid
3. **Follow/Unfollow**: Click the follow button
4. Check follower/following counts update
5. View your own profile to see all your uploads

#### 6. Settings

1. Go to http://localhost:3000/settings
2. Update profile info (username, bio)
3. Upload an avatar image
4. Toggle notification preferences (in-app and email for likes, comments, followers)
5. Save and verify changes persist on page refresh

#### 7. Email Notifications

1. Follow another user, like their video, or leave a review
2. Check the backend console output for Ethereal email preview URLs
3. Click the preview URL to see the HTML email in your browser
4. **Preference check**: Disable email notifications for likes in Settings, then like a video — no email should be sent

#### 8. Admin Dashboard

1. Create an admin user by seeding: `cd backend && npm run test:seed`
2. Login with admin credentials (check `backend/scripts/seed-test-admin.js` for credentials)
3. Navigate to http://localhost:3000/admin
4. Verify:
   - **Stats cards**: Total users, total videos, most active users
   - **Health widget**: Uptime, memory usage, DB status (auto-refreshes every 30s)
   - **Moderation table**: Flagged and low-rated videos tabs
5. **Access control**: Log out or log in as a regular user — `/admin` should redirect away

### MinIO Console

Access the MinIO web console at http://localhost:9001

- **Login**: `minioadmin` / `minioadmin`
- **Buckets**: `clipsphere-videos` (video files) and `clipsphere-avatars` (avatar images)
- Two buckets are auto-created when the backend starts

### Media API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/videos/upload` | Bearer token | Upload video (multipart/form-data) |
| GET | `/api/v1/videos/:id/stream` | Optional | Presigned URL for playback |
| POST | `/api/v1/users/avatar` | Bearer token | Upload avatar image |
| GET | `/api/v1/users/:id/avatar` | Public | Presigned URL for avatar |

## Swagger

API documentation is available at http://localhost:5000/api-docs

Generate and build static docs:

```bash
cd backend
npm run docs:build
```

## Stopping Everything

```bash
# Stop the backend and frontend with Ctrl+C in each terminal

# Stop Docker containers
cd backend
npm run deps:down
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED :27017` | Run `cd backend && npm run deps:up` to start MongoDB |
| `ECONNREFUSED :9000` | Run `cd backend && npm run deps:up` to start MinIO |
| Videos fail to upload | Verify `ffmpeg` is installed: `ffmpeg -version` |
| Frontend can't reach API | Ensure backend is running on port 5000 |
| MinIO buckets missing | Restart backend — buckets are auto-created on startup |
| Emails not sending | Check backend console for Ethereal preview URLs (dev mode) |
| `/admin` redirects away | Login with an admin account (run `npm run test:seed` first) |

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
