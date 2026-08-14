# 🤖 AI Chatbot

## 👋 Hello, Namaste! Welcome to AI Chatbot! 🚀

**Your intelligent AI companion is here.**
---
**A smarter way to chat, explore, learn, and get things done with AI.**
Chat, ask questions, explore ideas, and get AI-powered responses in real time — all through a modern, secure, and scalable chatbot platform.

An AI-powered chatbot application built as a **monorepo** with a React/Vite frontend and a Node.js/Express backend.

#### The application uses MongoDB for persistent data, Redis for OTP storage, Socket.IO for real-time chat communication, Google Gemini for AI responses, AWS S3 for file/image storage, JWT for authentication, and Nodemailer for email delivery. Built with a modern and scalable architecture, this project combines a React/Vite frontend with a Node.js/Express backend and powerful technologies such as Google Gemini, MongoDB, Redis, Socket.IO, and AWS S3.

---

## 📌 Project Overview

### Main Features

- User signup and email OTP verification
- Resend OTP
- Login / logout
- Forgot password
- Reset password
- JWT-based authentication
- Access token + refresh token flow
- Session/device information
- User profile management
- Change password
- Profile image upload
- Conversation management
- AI chat using Socket.IO
- Real-time message communication
- MongoDB persistence for users, conversations and messages
- Redis-based OTP storage with expiry
- Google Gemini integration
- AWS S3 file/image storage
- Protected and public frontend routes
- Redux state management with persistence
- Theme management
- Speech recognition support
- Markdown/code rendering for AI responses
- Responsive React/Vite frontend

---

## 🏗️ Architecture

```text
ai-chatbot/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── helpers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── service/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

The repository is organized as a monorepo, with frontend and backend maintained in the same Git repository.

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Redux Toolkit
- Redux Persist
- Axios
- Socket.IO Client
- React Hot Toast
- Framer Motion
- Lucide React
- Markdown rendering
- Speech Recognition

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Redis
- Socket.IO
- JWT
- Joi
- Bcrypt
- Nodemailer
- AWS SDK for S3
- Google Gemini (`@google/genai`)
- Multer
- Helmet
- CORS
- Compression
- Morgan

---

# 🔐 Authentication Flow

The authentication system contains:

```text
Signup
  ↓
Generate OTP
  ↓
Store OTP in Redis
  ↓
Send OTP Email
  ↓
Verify Email OTP
  ↓
Generate Access Token + Refresh Token
  ↓
Authenticated User
```

### Authentication APIs

```text
POST /auth/signup
POST /auth/verify-email-otp
POST /auth/resend-otp
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/logout
```

Protected profile APIs:

```text
GET    /profile
POST   /profile/change-password
PUT    /profile/update-profile
```

The backend authentication middleware expects:

```text
Authorization: Bearer <access_token>
```

---

# 🤖 AI Chat Architecture

The chatbot uses **Socket.IO** for real-time communication.

```text
React Chat UI
     │
     │ Socket.IO
     ▼
Backend Socket Middleware
     │
     │ Verify JWT
     ▼
AI / Conversation Events
     │
     ├── Conversation Service
     ├── Message Repository
     ├── Conversation Repository
     │
     ▼
Google Gemini
     │
     ▼
AI Response
     │
     ▼
Socket.IO → React Chat UI
```

The backend registers:

```text
AI Events
Conversation Events
```

Socket connections are authenticated using the access token.

---

# 💬 Conversation & Message Models

## Conversation

A conversation belongs to a user and stores information such as:

- `userId`
- `title`
- `lastMessage`
- `lastMessageAt`
- `isPinned`
- `isArchived`
- timestamps

## Message

A message belongs to a conversation and contains:

- `conversationId`
- `role`
  - `user`
  - `assistant`
- `text`
- `status`
  - `sending`
  - `completed`
  - `error`
- timestamps

---

# 🔑 Token Management

The project uses:

### Access Token

Used for authenticated API requests.

Default expiry configured in code:

```text
15 minutes
```

### Refresh Token

Used to maintain authentication and is stored in MongoDB.

Default expiry configured in code:

```text
7 days
```

Refresh tokens also store:

- User ID
- Device
- Browser
- IP Address
- Expiry date

MongoDB TTL indexing is used on `expiresAt`.

---

# 📩 OTP System

OTP is stored in Redis instead of MongoDB.

Redis key format:

```text
otp:<purpose>:<email>
```

OTP expiry:

```text
10 minutes
```

Supported purposes include authentication-related OTP flows such as:

```text
register
forgot_password
```

OTP lifecycle:

```text
Generate OTP
   ↓
Save OTP in Redis
   ↓
Send Email
   ↓
Verify OTP
   ↓
Delete OTP
```

---

# 🗄️ Database

## MongoDB

MongoDB is used as the primary application database.

Main models:

```text
User
Session
RefreshToken
Conversation
Message
```

MongoDB connection uses:

```env
MONGO_URI=
DB_NAME=
```

---

# ⚡ Redis

Redis is used for temporary OTP storage.

Required environment variable:

```env
REDIS_URL=
```

The backend connects to MongoDB and Redis before starting the HTTP server.

---

# ☁️ AWS S3

AWS S3 is used for file/image storage.

The backend uses AWS SDK:

```text
@aws-sdk/client-s3
```

Required configuration:

```env
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
```

Profile image uploads are handled using Multer and uploaded to S3.

---

# ✉️ Email / SMTP

Nodemailer is used to send OTP verification emails.

Required environment variables:

```env
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=
```

The SMTP transporter is verified when the backend starts.

---

# 🌐 Environment Variables

## Backend `.env`

Create:

```text
backend/.env
```

Example structure:

```env
PORT=5000

MONGO_URI=
DB_NAME=

REDIS_URL=

CLIENT_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

BCRYPT_SALT_ROUNDS=10

GEMINI_API_KEY=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=
```

> Never commit `.env` files or secret keys to Git.

---

## Frontend `.env`

Create:

```text
frontend/.env
```

The frontend Socket.IO configuration expects:

```env
VITE_SOCKET_URL=
```

Add other `VITE_*` variables here if additional frontend environment configuration is introduced.

---

# 🚀 Installation & Setup

## 1. Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd ai-chatbot
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create the environment file:

```text
backend/.env
```

Add MongoDB, Redis, JWT, Gemini, AWS S3 and SMTP configuration.

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

Backend default port:

```text
5000
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Configure:

```env
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

Vite opens the application automatically because the current Vite configuration has `server.open` enabled.

---

# 🔄 Local Development

Run both applications:

### Terminal 1

```bash
cd backend
npm run dev
```

### Terminal 2

```bash
cd frontend
npm run dev
```

Typical local setup:

```text
Frontend  → Vite
Backend   → Node.js / Express
Database  → MongoDB
Cache     → Redis
AI        → Google Gemini
Storage   → AWS S3
Realtime  → Socket.IO
Email     → SMTP / Nodemailer
```

---

# 🧩 Backend Folder Responsibilities

```text
config/
```

Application configuration and external service clients.

```text
controllers/
```

HTTP request/response handling.

```text
helpers/
```

Reusable utilities such as JWT, bcrypt, OTP and email templates.

```text
middlewares/
```

Authentication, validation, uploads and error handling.

```text
models/
```

Mongoose database schemas.

```text
repositories/
```

Database access layer.

```text
services/
```

Business logic.

```text
routes/
```

REST API route definitions.

```text
socket/
```

Socket.IO initialization, authentication middleware and real-time events.

```text
validators/
```

Joi validation schemas.

```text
utils/
```

General utilities/constants/logging.

---

# 🎨 Frontend Folder Responsibilities

```text
components/
```

Reusable UI components.

```text
pages/
```

Application pages/screens.

```text
routes/
```

Public/private routing.

```text
redux/
```

Global application and authentication/chat state.

```text
service/
```

API service functions and Axios abstraction.

```text
socket/
```

Socket.IO client configuration.

```text
context/
```

Theme and Socket contexts.

```text
hooks/
```

Reusable React hooks.

```text
utils/
```

Browser, authentication, validation and helper utilities.

---

# 🛡️ Route Protection

The frontend contains:

```text
PublicRoute
PrivateRoute
```

### Public Route

If a user is already authenticated, the user is redirected to the application.

### Private Route

If a user is not authenticated, the user is redirected to:

```text
/login
```

---

# 📦 Important NPM Commands

## Backend

```bash
npm install
npm run dev
npm start
```

## Frontend

```bash
npm install
npm run dev
npm run build
```

---

# 🔒 Git & Security

The project ignores:

```text
node_modules/
.env
dist/
build/
logs/
*.log
.vscode/
.idea/
coverage/
```

Do not commit:

- API keys
- JWT secrets
- AWS credentials
- SMTP passwords
- MongoDB credentials
- Redis credentials
- Production environment files

---

# 🧪 Testing

The backend currently contains a placeholder test script:

```bash
npm test
```

which reports that no tests are configured yet.

Recommended future test areas:

```text
Authentication
OTP
JWT
Conversation APIs
Message handling
Socket events
Profile APIs
File uploads
AI response handling
```

---

# 📌 Important Development Notes

### Backend startup sequence

The backend initializes:

```text
Express App
   ↓
HTTP Server
   ↓
Socket.IO
   ↓
MongoDB
   ↓
Redis
   ↓
Server Listen
```

The current server starts listening only after MongoDB and Redis connections are established.

### Socket.IO

Socket transport is configured for:

```text
websocket
```

The frontend Socket.IO client has:

```text
autoConnect: false
```

so connection lifecycle can be controlled by the application.

### OTP

OTP expiry is currently:

```text
10 minutes
```

### JWT

Default token lifetimes are:

```text
Access Token  → 15 minutes
Refresh Token → 7 days
```

---

# 🗺️ Future Improvements

Possible future enhancements:

- Add automated unit/integration tests
- Add API documentation with Swagger/OpenAPI
- Add refresh-token API if not already exposed
- Add rate limiting for authentication/OTP APIs
- Add centralized production logging
- Add CI/CD pipeline
- Add Docker configuration
- Add production environment configuration
- Add monitoring/health-check endpoint
- Add AI usage/token tracking
- Add conversation search
- Add chat export
- Add streaming AI responses
- Add file/document chat
- Add admin dashboard and analytics

---

# 👨‍💻 Project Structure Reference

The current project contains separate `frontend` and `backend` applications inside one repository. The supplied project structure includes backend layers for configuration, controllers, helpers, models, middleware, repositories, services, sockets, routes and validators, and frontend layers for pages, components, services, routes, Redux, contexts, hooks and utilities. fileciteturn0file0L1-L64 fileciteturn0file0L65-L145

---

# 👤 Maintainer

**Ritik Kumar Patidar**

Project:

**AI Chatbot**

---

## 📄 Version

Current project version:

```text
1.0.0
```

Backend package metadata currently identifies the project as `ai-chatbot-backend` version `1.0.0`. fileciteturn0file0L1339-L1377

---

## ⚠️ Disclaimer

This README documents the project structure and configuration based on the current project files. Update this document whenever a major feature, API, environment variable, dependency, architecture change, or deployment process is added.
