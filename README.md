# ClipSphere API

Backend API for the ClipSphere project.

Built using Node.js, Express, and MongoDB.
This repo contains the core backend setup, authentication system, and shared infrastructure for the team.

---

## What’s implemented

* Auth: register & login
* JWT authentication
* protect middleware (auth)
* restrictTo middleware (RBAC)
* Global error handler
* Admin health endpoint
* Swagger docs
* Postman collection
* Zod validation for auth

---

## Project structure

```
src/
  routes/
  controllers/
  services/
  models/
  middleware/
  config/
  validators/
```

---

## Quick start

Clone the repo:

```
git clone https://github.com/rghdasalah/clipsphere-api.git
cd clipsphere-api
```

Install dependencies:

```
npm install
```

Create `.env` from the example:

```
cp .env.example .env
```

Default `.env.example` values:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clipsphere
JWT_SECRET=your_secret_key
```

Bring up dependencies (MongoDB via Docker):

```
npm run deps:up
```

Run API in development mode:

```
npm run dev
```

Or run both in one command:

```
npm run dev:with-deps
```

Run API in production mode:

```
npm start
```

Stop Docker dependencies:

```
npm run deps:down
```

View Mongo logs:

```
npm run deps:logs
```

---

## API

Base URL:

```
http://localhost:5000/api/v1
```


---

## Swagger

```
http://localhost:5000/api-docs
```

---

## Postman

Collection:

```
postman/
```
## Documentation

- ER Diagram: docs/er-diagram.png


