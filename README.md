# 🎬 ClipSphere API

Backend API for the ClipSphere platform, built with **Node.js**, **Express**, and **MongoDB**.
This project implements authentication, authorization, and core backend infrastructure following a clean architecture.

---

## 🚀 Features

* 🔐 User Authentication (Register & Login)
* 🔑 JWT-based Authorization
* 🛡️ Role-Based Access Control (RBAC)
* ⚙️ Global Error Handling
* 🧩 Clean Architecture (routes → controllers → services)
* 📄 Swagger API Documentation
* 🧪 Postman Collection for API Testing
* 🗄️ MongoDB with Mongoose

---

## 🏗️ Project Structure

```
src/
  routes/        # API routes
  controllers/   # Request handlers
  services/      # Business logic
  models/        # Mongoose schemas
  middleware/    # Auth, RBAC, error handling
  config/        # Config files (DB, Swagger)
  validators/    # Zod validation schemas
server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/rghdasalah/clipsphere-api.git
cd clipsphere-api
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create `.env` file

Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/clipsphere
JWT_SECRET=your_secret_key
```

---

### 4. Run the server

```bash
npx nodemon server.js
```

---

## 🌐 API Base URL

```
http://localhost:5000/api/v1
```

---

## 📡 API Endpoints

### 🔐 Auth

* `POST /api/v1/auth/register` → Register new user
* `POST /api/v1/auth/login` → Login and get JWT

---

### 🛠️ Admin

* `GET /api/v1/admin/health` → Admin-only system status

---

### 🧪 Testing Routes (for development)

* `GET /protected` → Requires authentication
* `GET /admin-only` → Requires admin role

---

## 🔐 Authentication

All protected routes require a Bearer token:

```
Authorization: Bearer <your_token>
```

---

## 📘 Swagger Documentation

Interactive API docs available at:

```
http://localhost:5000/api-docs
```

---

## 🧪 Postman Collection

A ready-to-use Postman collection is included:

```
postman/
  clipsphere-api.postman_collection.json
  ClipSphere Local.postman_environment.json
```

### Usage:

1. Import both files into Postman
2. Select the environment
3. Run requests in order:

   * Register
   * Login
   * Use token automatically

---

## ⚠️ Important Notes

* MongoDB database is created automatically on first insert
* Ensure MongoDB service is running locally
* Express v4 is used for compatibility with middleware
* Do not commit `.env` file

---

## 🧠 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* Zod
* Swagger (swagger-jsdoc, swagger-ui-express)

---

## 📌 Future Work

* User profile management
* Follow system
* Video upload & metadata
* Reviews and ratings
* Admin analytics

---

## 📄 License

This project is for educational purposes.
