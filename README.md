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
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5000
```

`CORS_ORIGINS` is optional, but recommended when using Swagger UI from GitHub Pages so browser `Execute` requests are allowed.
In development (`NODE_ENV` not set to `production`), any `https://*.github.io` origin is allowed automatically.

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

This repo can also publish static Swagger docs to GitHub Pages.

Generate OpenAPI JSON from code annotations:

```bash
npm run docs:codegen
```

Build static pages content:

```bash
npm run docs:build
```

Optional: set a custom backend URL for the generated static docs:

```bash
OPENAPI_SERVER_URL=http://localhost:5000 npm run docs:build
```

Swagger UI will show a single editable backend URL field (defaulting to `OPENAPI_SERVER_URL` or `http://localhost:5000`) and append `/api/v1` automatically.

Generated files:

- `docs/openapi.json` (code-generated OpenAPI file)
- `docs-site/index.html` and `docs-site/openapi.json` (GitHub Pages artifact)

GitHub Actions workflow:

- `.github/workflows/pages-swagger.yml`
- Runs on push to `main`/`master` and deploys `docs-site` to GitHub Pages.
- You can enable Pages in repository settings and select GitHub Actions as the source.

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
