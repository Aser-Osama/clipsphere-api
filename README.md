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

## Setup

Clone the repo:

```
git clone https://github.com/rghdasalah/clipsphere-api.git
cd clipsphere-api
```

Install dependencies:

```
npm install
```

Create `.env`:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clipsphere
JWT_SECRET=your_secret_key
```

Run server:

```
npx nodemon server.js
```

---

## API

Base URL:

```
http://localhost:5000/api/v1
```

Auth:

* POST `/auth/register`
* POST `/auth/login`

Admin:

* GET `/admin/health`

---

## Auth

Use Bearer token:

```
Authorization: Bearer <token>
```

---

## Swagger

```
http://localhost:5000/api-docs
```

---

## Postman

Collection موجود في:

```
postman/
```

---

## Notes

* Use Express v4 (not v5)
* MongoDB creates DB on first insert
* `.env` should not be committed

---

## Team

Dev1: auth + infrastructure
Dev2: users
Dev3: videos
Dev4: admin
