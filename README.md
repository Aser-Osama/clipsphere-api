# ClipSphere API

ClipSphere API is a Node.js/Express backend for a social short-video platform, with JWT authentication, RBAC-protected admin endpoints, user/follow graph flows, video metadata and reviews, Swagger API documentation, and a consolidated Postman collection for Phase 1 verification.

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB running locally or remotely
- Environment variables configured in `.env`

Required environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clipsphere
JWT_SECRET=your_secret_key
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.example .env
```

3. Start MongoDB:

If you already have MongoDB running locally, keep using that. Otherwise, the bundled Docker Compose file will start a local MongoDB instance for the Phase 1 app:

```bash
npm run deps:up
```

4. Start the API in development mode:

```bash
npm run dev
```

Or start both together:

```bash
npm run dev:with-deps
```

When you are done with the Docker-based MongoDB dependency:

```bash
npm run deps:down
```

## Swagger

API documentation is available at:

http://localhost:5000/api-docs

## Postman

Use the final merged Phase 1 files in `postman/`:

- Collection: `ClipSphere_Phase1_Final.postman_collection.json`
- Environment: `ClipSphere Local.postman_environment.json`

Import steps:

1. Open Postman and click Import.
2. Import the collection file and the environment file.
3. Select the `ClipSphere Local` environment.
4. Set `baseUrl` (for example `http://localhost:5000`) and run Login to populate `token` automatically.

## Documentation

- ER Diagram: `docs/er-diagram.jpeg`
