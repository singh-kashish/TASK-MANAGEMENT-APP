# TaskFlow - Full Stack Task Management Platform

## Live Demo

**Frontend**
https://task-management-cfp75vsq6-singhkashishs-projects.vercel.app/

**Backend API**
https://task-management-app-rs77.onrender.com/api

---
# Architecture

## Table of Contents

- [Design Goals](#design-goals)
- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Authentication Architecture](#authentication-architecture)
- [Database Architecture](#database-architecture)
- [Security Architecture](#security-architecture)
- [Trade-offs and Decisions](#trade-offs-and-decisions)
- [Future Enhancements](#future-enhancements)

---

## Design Goals

Every architectural decision in TaskFlow traces back to one of these principles:

| Goal | What it means in practice |
|---|---|
| **Separation of concerns** | Each layer owns exactly one thing. Controllers don't contain business logic. Services don't know about HTTP. |
| **Correctness under concurrency** | Token rotation is a single atomic DB operation — not two sequential ones with a gap between them. |
| **Security by default** | Refresh tokens are never stored in plaintext. HttpOnly cookies. Short-lived access tokens. |
| **Production readiness** | Docker, CI, compound indexes, centralized error handling, environment-based config. |
| **Maintainability** | Feature-based frontend, layered backend, explicit type contracts at every boundary. |

---

## System Overview

```
┌───────────────────────────────────────────────────────────┐
│                     React App (Vercel)                    │
│                                                           │
│  ┌─────────────────┐    ┌──────────────────────────────┐  │
│  │  Redux Toolkit  │    │       TanStack Query         │  │
│  │  (client state) │    │       (server state)         │  │
│  │  user, authState│    │  tasks, stats, cache, sync   │  │
│  └────────┬────────┘    └─────────────┬────────────────┘  │
│           │                           │                   │
│           └─────────────┬─────────────┘                   │
│                         │                                 │
│               ┌─────────▼──────────┐                      │
│               │   Axios Client     │                      │
│               │   + Interceptors   │                      │
│               └─────────┬──────────┘                      │
└─────────────────────────┼─────────────────────────────────┘
                          │
                          │  Authorization: Bearer <accessToken>
                          │  Cookie: refreshToken (HttpOnly, SameSite=Strict)
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                   Express API (Render)                     │
│                                                            │
│  routes → validators → middleware → controllers →          │
│  services → models                                         │
│                                                            │
│  Helmet · CORS · Zod validation · JWT auth middleware      │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          │  Mongoose ODM
                          │
┌─────────────────────────▼─────────────────────────────────┐
│                   MongoDB Atlas                           │
│                                                           │
│  users   { email, passwordHash, refreshTokens[] }         │
│  tasks   { title, status, priority, dueDate, userId }     │
└───────────────────────────────────────────────────────────┘
```

---
## Frontend Architecture

### Directory Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance, request + response interceptors
│   ├── auth.api.ts        
│   └── tasks.api.ts       
│
├── components/
│   ├── layout/            # AppShell, ErrorBoundary, Navbar, PageSkeleton, ThemeToggle
│   ├── tasks/      #CreateTaskDialog, DashboardStats, DeleteTaskDialog, EditTaskDialog, EmptyState, TaskCard, TaskFilters, TaskForm, TaskList, TaskStats
│   └── ui/            #  shadcn/ui primitives (Button, Dialog, Input, etc.)
│
├── features/
│   ├── auth/
│   │   ├── auth.slice.ts   # Redux slice: state:(user, accessToken, isAuthenticated, isBootstrapping),exports - actions & reducers
│   │   ├── auth.api.ts  # Modules for loginUser, logoutUser, bootstrapAuthFlow, logoutUser using Axios instance
│   │   ├── auth.ts/         # Types & Interfaces(User, AuthState, AuthPayload, AuthResponse)
│   │   └── authForm/    # Reusable and modular form for Login & Register flows
│   │   └── auth.hooks.ts  #Custom hooks for login, register, logout(handles logout-all as well) using Tanstack Query & Mutations
│   └── tasks/
│       ├── task.api.ts         # Modules for getTaskStats, getTasks, createTask, updateTask, deleteTask using Axios instance
│       └── task.hooks.ts    # useTasks, useCreateTask, useUpdateTask, useDeleteTask using Tanstack Query & Mutations
│       └── task.types.ts    # TASK_STATUS, PRIORITY, CreateTaskPayload, UpdateTaskPayload, etc task types
├── hooks/
│   └── useAppDispatch           # Typed useAppDispatch
│   └── useAppSelector           # Typed useAppSelector
│   └── useTaskStats             # Hook using tanstack query
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── HomePage.tsx
│   └── NotFoundPage.tsx
│
├── routes/
│   ├── AppRouter.tsx      # React Router v6 tree
│   ├── ProtectedRoute.tsx # Redirects to /login if not authenticated
│   └── PublicOnlyRoute.tsx # Redirects to /dashboard if already authenticated
│
├── store/
│   └── index.ts           # Redux store configuration
│
├── utils/
│    └── authHelper.ts     # authHelper - localStorage read/write/clear for access token, refreshAccessToken, fetchMe, bootstrapAuth modules
├── types/
│    └── axios.d.ts  #Axios interface extension
└── providers
     ├── QueryProvider.tsx      # Tanstack Query Client
     └── ThemeProvider.tsx   #Using Next Themes

```

### State Architecture

Two separate state layers handle different concerns:

```
Client State (Redux Toolkit)          Server State (TanStack Query)
──────────────────────────────        ──────────────────────────────
user: { id, email }                   tasks list
accessToken: string | null            task detail
isAuthenticated: boolean              task stats / dashboard
isBootstrapping: boolean
```

**Why two layers?** Redux is the source of truth for auth — it needs to be synchronously readable by the router for protected/public-only route decisions. TanStack Query handles all data that comes from the API: caching, background refetching, stale-while-revalidate, and request deduplication. Using Redux for server state would require manually managing loading/error states that TanStack Query handles for free.

### Routing Model

```
AppRouter
├── /                 PublicOnlyRoute  → LoginPage    (redirect to /dashboard if authed)
├── /login            PublicOnlyRoute  → LoginPage
├── /register         PublicOnlyRoute  → RegisterPage
│
├── /dashboard        ProtectedRoute  → DashboardPage
├── /tasks            ProtectedRoute  → TasksPage
│
└── *                 → NotFoundPage
```

`ProtectedRoute` reads `auth.isAuthenticated` from Redux. It also reads `auth.isBootstrapping` — while bootstrap is in progress, it renders a loading state instead of redirecting, preventing incorrect redirects on page load before auth state is resolved.

### Auth Bootstrap Flow

On application mount, before any protected content renders:

```
App mounts → dispatch(bootstrapAuthFlow())
    │
    ├─ accessToken in localStorage?
    │       │
    │       ▼
    │   GET /auth/me (with token in header)
    │       ├── 200 → dispatch(setCredentials({ user, accessToken }))
    │       │         dispatch(finishBootstrap())
    │       │         ── done
    │       │
    │       └── 401 → fall through ↓
    │
    └─ POST /auth/refresh (browser sends HttpOnly cookie automatically)
            ├── 200 → save new accessToken to localStorage
            │         GET /auth/me (with new token)
            │         dispatch(setCredentials({ user, accessToken }))
            │         dispatch(finishBootstrap())
            │
            └── 401 → dispatch(logout())
                      dispatch(finishBootstrap())
                      clear localStorage
```

### Axios Interceptor — Transparent Token Refresh

```
API request fires
    │
    ▼
Request Interceptor
    └── Attach Authorization: Bearer <accessToken> from localStorage

    ▼
Response received
    │
    ├── 2xx → return response normally
    │
    └── 401 →
            │
            ├── Is this request to /auth/refresh?
            │       └── Yes → dispatch(logout()), reject
            │
            └── POST /auth/refresh
                    ├── 200 → update accessToken in localStorage + Redux
                    │         retry original request with new token
                    │         return retried response to caller
                    │
                    └── 401 → dispatch(logout())
                              redirect to /login
                              reject
```

Any number of concurrent requests that 401 at the same time will all queue behind a single `/auth/refresh` call — the interceptor tracks whether a refresh is already in flight and queues subsequent retries instead of firing multiple refresh requests.

---

## Backend Architecture

### Layer Diagram

```
HTTP Request
    │
    ▼
routes/
    Purpose: define endpoint paths, compose middleware chains
    Does not: contain logic
    │
    ▼
validators/
    Purpose: Zod schema validation for body, query, params
    Does not: know about business rules
    │
    ▼
middleware/
    Purpose: cross-cutting concerns
    - authMiddleware: verify access token JWT, attach req.auth
    - errorMiddleware: centralized error handler, consistent response shape
    - validate: Zod middleware runner
    Does not: call services directly
    │
    ▼
controllers/
    Purpose: HTTP layer — read req, call one service, write res
    Does not: contain business logic, query the DB directly
    │
    ▼
services/
    Purpose: all business logic
    - credential validation
    - token issuance and persistence
    - task ownership checks
    - statistics computation
    Does not: read req or write res
    │
    ▼
models/
    Purpose: Mongoose schema definitions and typed document interfaces
    Does not: contain business logic
    │
    ▼
MongoDB
```

### Key Utils (backend)

```
utils/
├── jwt.ts               # generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken
│                        # Pure functions. No DB calls.
│
├── tokenHash.ts         # hashRefreshToken — SHA-256, one-way
│                        # Pure function. No DB calls.
│
├── issueTokens.ts       # issueTokens(userId, email) → { accessToken, refreshToken }
│                        # Pure function. Composes jwt.ts. No DB calls.
│                        # Persistence is always the caller's responsibility.
│
├── refreshTokenStore.ts # All DB operations for refresh tokens
│   │                    # Every function is a standalone atomic operation
│   │
│   ├── persistRefreshToken(userId, rawToken)
│   │       Single aggregation pipeline:
│   │       stage 1: $filter expired tokens out
│   │       stage 2: $slice to MAX_REFRESH_TOKENS - 1 (enforce cap)
│   │       stage 3: $concatArrays append new token
│   │
│   ├── rotateRefreshToken(userId, oldRaw, newRaw)
│   │       findOneAndUpdate with aggregation pipeline:
│   │       filter: { _id, tokenHash: oldHash, expiresAt > now }
│   │       stage 1: $filter removes old token + expired tokens
│   │       stage 2: $concatArrays appends new token
│   │       → returns null if old token not found → throws 401
│   │       ATOMIC: no gap between remove and insert
│   │
│   ├── revokeRefreshToken(userId, rawToken)
│   │       updateOne $pull — removes one token by hash
│   │
│   └── revokeAllRefreshTokens(userId)
│           updateOne $set refreshTokens: []
│
├── AppError.ts          # AppError(message, statusCode) extends Error
├── asyncHandler.ts      # wraps async route handlers, forwards errors to next()
├── authResponse.ts      # buildAuthResponse(user, accessToken, refreshToken) → response shape
└── cookies.ts           # refreshCookieOptions, clearCookieOptions
```

---

## Authentication Architecture

### Why stateless JWT with refresh tokens?

Access tokens are stateless — the server verifies them without a DB call. This keeps the hot path (every authenticated request) at zero database reads for auth. The tradeoff is that access tokens cannot be instantly revoked, so they are kept short-lived (15 minutes). Refresh tokens are long-lived (7 days) and stored server-side as hashes — they can be revoked instantly.

### Token Lifecycle

```
                    ┌──────────────────────────┐
                    │       /auth/login         │
                    │  or /auth/register        │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │     issueTokens()         │
                    │  (pure — no DB)           │
                    │  → accessToken (JWT, 15m) │
                    │  → refreshToken (JWT, 7d) │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │  persistRefreshToken()    │
                    │  (single pipeline — atomic│
                    │   filter + slice + push)  │
                    └────────────┬─────────────┘
                                 │
               ┌─────────────────┼──────────────────┐
               │                 │                  │
               ▼                 ▼                  ▼
    accessToken in JSON   refreshToken in        hash in
    response body         HttpOnly cookie        users.refreshTokens[]

               │
  ── 15 min ──▶│ access token expires
               │
               ▼
    ┌───────────────────────┐
    │  POST /auth/refresh   │
    │  rotateRefreshToken() │
    │  (single pipeline —   │
    │   atomic pull+push)   │
    └───────────┬───────────┘
               │
               ▼
        new tokens issued
        old token gone from DB
```

### Why a single aggregation pipeline for rotation?

The naive two-step approach:
```
step 1: findOneAndUpdate → $pull old token
step 2: updateOne        → $push new token
```

Has a window between the two writes. If the server crashes between them, the old token is gone but the new token was never persisted. The client holds a token that doesn't exist in the DB — permanent logout.

The aggregation pipeline approach:
```
findOneAndUpdate(filter, [
  { $set: { refreshTokens: { $filter: ... remove old + expired } } },
  { $set: { refreshTokens: { $concatArrays: [...existing, newToken] } } }
])
```

Both stages execute atomically in a single document write. Either the entire operation succeeds (old gone, new present) or it fails (nothing changes). No intermediate state is possible.

### Concurrent Refresh Race Safety

If two requests with the same refresh token hit `/auth/refresh` simultaneously:

```
Request A                          MongoDB
    │                                 │
    ├── findOneAndUpdate ────────────▶│ oldHash found → pipeline runs
    │                                 │ old removed, new A token inserted
    │◀─────────────────────────────── │ returns the document (non-null)
    │ success, new token issued       │
                                      │
Request B                            │
    │                                 │
    ├── findOneAndUpdate ────────────▶│ oldHash NOT found (already gone)
    │                                 │ filter matches nothing → returns null
    │◀─────────────────────────────── │
    │ result === null → throw 401     │
```

MongoDB's document-level locking ensures only one write wins. The second request gets null back — the token doesn't exist anymore — and correctly gets a 401.

---

## Database Architecture

### Schema Design

```typescript
// User document
{
  _id: ObjectId,
  email: string,           // unique index
  passwordHash: string,    // bcryptjs, 12 rounds — never the raw password
  refreshTokens: [
    {
      tokenHash: string,   // SHA-256 of raw token — raw value never touches DB
      expiresAt: Date,
    }
  ],
  createdAt: Date,
  updatedAt: Date
}

// Task document
{
  _id: ObjectId,
  title: string,
  description: string,
  priority: 'low' | 'medium' | 'high',
  status: 'todo' | 'in-progress' | 'completed',
  dueDate: Date,
  userId: ObjectId,        // ref: User
  createdAt: Date,
  updatedAt: Date
}
```

### Indexing Strategy

```
users collection
  { email: 1 }  unique: true      ← login lookup + duplicate check

tasks collection
  { userId: 1, status: 1 }        ← GET /tasks?status=todo
  { userId: 1, priority: 1 }      ← GET /tasks?priority=high
  { userId: 1, dueDate: 1 }       ← GET /tasks?sortBy=dueDate
  { userId: 1, createdAt: -1 }    ← GET /tasks?sortBy=createdAt (default)
  { userId: 1, status: 1, priority: 1 }  ← dashboard aggregation + combined filter
```

All task indexes are compound with `userId` as the leading key. MongoDB will never scan across users for any query — every access pattern starts with a userId equality match.

### Dashboard Aggregation

`GET /tasks/stats` runs a single aggregation pipeline:

```
$match: { userId }                  ← uses index
    │
    ▼
$facet:
  total: [$count]
  byStatus: [$group by status]
  overdue: [$match dueDate < now, status != completed → $count]
    │
    ▼
$project: reshape into dashboard shape
```

One query, one round trip, no N+1.

---

## Security Architecture

### Defence in Depth

```
Layer 1 — Transport
  HTTPS in production (Vercel, Render)
  CORS restricted to CLIENT_URL only

Layer 2 — HTTP
  Helmet sets security headers:
    Content-Security-Policy
    X-Frame-Options
    X-Content-Type-Options
    Strict-Transport-Security

Layer 3 — Input
  Zod validation middleware on every route
  Body, query params, and route params all validated
  Invalid input → 400 before reaching controller

Layer 4 — Authentication
  Access token: short-lived JWT, verified on every protected request
  Refresh token: stored as SHA-256 hash only, raw value never in DB
  Refresh cookie: HttpOnly, SameSite=Strict, Secure (production)

Layer 5 — Application
  Ownership checks in services — users can only access their own tasks
  Generic error messages for auth failures (no email enumeration)
  asyncHandler catches all thrown errors → centralized error middleware

Layer 6 — Data
  Passwords: bcryptjs, 12 rounds
  No sensitive data in JWT payload beyond userId and email
  No raw tokens, passwords, or secrets logged
```

### Error Response Shape

All errors flow through centralized error middleware and return a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable message",
  "errors": []   // optional, Zod validation errors only
}
```

Stack traces and internal error details are never sent to the client.

---

## Trade-offs and Decisions

### JWT over server-side sessions

**Chosen because:** stateless access tokens mean the Express server holds no session state. Any number of server instances can verify tokens independently — important for horizontal scaling on Render.

**Cost:** access tokens can't be instantly invalidated. Mitigated by keeping them short-lived (15 minutes) and using refresh token rotation for longer-lived sessions.

### Single aggregation pipeline for token rotation

**Chosen because:** two-step pull-then-push has a crash window. The pipeline eliminates it. Also handles cap enforcement and expired token cleanup in the same operation.

**Cost:** aggregation pipeline updates (`findOneAndUpdate` with an array of stages) require MongoDB 4.2+. MongoDB Atlas runs 7.0 — not a concern.

### MongoDB over PostgreSQL

**Chosen because:** the task schema is document-shaped with no cross-document joins needed. MongoDB's flexible schema also made early iteration fast.

**Cost:** schema enforcement is at the application layer (Mongoose + Zod) rather than the database layer. For this domain, that's an acceptable trade.

### TanStack Query + Redux (two libraries, not one)

**Chosen because:** Redux is synchronous and readable from the router before any HTTP response — necessary for the protected/public-only routing model. TanStack Query handles caching, deduplication, and background sync in ways Redux would require significant boilerplate to replicate.

**Cost:** two mental models for state. Mitigated by clear ownership rules: Redux owns auth state, TanStack Query owns everything from the API.

### Feature-based frontend structure over file-type structure

**Chosen because:** `features/auth/` and `features/tasks/` are fully self-contained — their hooks, slice, and components all live together. Adding a new feature doesn't require touching multiple top-level directories.

**Cost:** slightly more directories. Pays for itself as the app grows.

---

# Local Development Setup

## Prerequisites

- Node.js 22+
- MongoDB
- Docker (Optional)

## Clone Repository

```bash
git clone https://github.com/singh-kashish/TASK-MANAGEMENT-APP

cd task-management-app
```

## Backend Setup

```bash
cd server

npm install

cp .env.example .env

npm run dev
```

## Frontend Setup

```bash
cd web

npm install

cp .env.example .env

npm run dev
```

---

# Docker Setup

```bash
touch server/.env
Add environment variables as defined in .env.example file.
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000/api
```

---

# Environment Variables

## Backend

| Variable            | Description               |
| ------------------- | ------------------------- |
| PORT                | API Port                  |
| MONGODB_URI         | MongoDB Connection String |
| CLIENT_URL          | Frontend URL              |
| JWT_ACCESS_SECRET   | Access Token Secret       |
| JWT_REFRESH_SECRET  | Refresh Token Secret      |
| JWT_ACCESS_EXPIRES  | Access Token Expiry       |
| JWT_REFRESH_EXPIRES | Refresh Token Expiry      |

## Frontend

| Variable     | Description          |
| ------------ | -------------------- |
| VITE_API_URL | Backend API Base URL |

---

# Seed Database

Populate the database with sample data:

```bash
cd server

npm run seed
```

This creates sample users and tasks for local development and testing.

---

# API Documentation

## POST /api/auth/register

Creates a new user account.

## POST /api/auth/login

Authenticates a user and returns:

- Access Token
- User Information

Also sets:

- Refresh Token HttpOnly Cookie

## GET /api/tasks

Returns all tasks for the authenticated user.

Supported Query Parameters:

- status
- priority
- sortBy
- sortOrder

## POST /api/tasks

Creates a task.

## GET /api/tasks/stats

Returns:

- Total Tasks
- Todo Tasks
- In Progress Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks
- Completion Rate

---

# Testing

Run backend tests:

```bash
cd server

npm test
```

Implemented using:

- Jest
- Supertest

Tests cover:

- Authentication flows
- API routes
- Validation middleware
- Task service behavior

---

# CI/CD

GitHub Actions automatically:

- Installs dependencies
- Runs builds
- Verifies application integrity

Triggered on:

- Pull Requests
- Pushes to main branch

---

# Production Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

CI/CD

- GitHub Actions

The deployment architecture separates presentation, API, and persistence layers, allowing independent deployment and scaling.

---

# Containerization

The project includes Docker and Docker Compose support.

Services:

- Frontend (React/Vite)
- Backend (Express)
- MongoDB

Start the full stack:

```bash
touch server/.env
Add environment variables as defined in .env.example file.
docker compose up --build
```

---

# Bonus Features

- Dark Mode Support
- Dockerized Setup
- Automated Testing
- CI/CD Pipeline
- Compound Database Indexes

---

## Screenshots

<img width="2940" height="1564" alt="image" src="https://github.com/user-attachments/assets/4c746abd-338e-4086-a8d5-0fec9378ed7d" />

### Dashboard

<img width="2936" height="1600" alt="image" src="https://github.com/user-attachments/assets/1d9df7e1-1f4a-4409-8c2c-90d625542aea" />

### Login

<img width="742" height="1328" alt="image" src="https://github.com/user-attachments/assets/44720a17-7083-44fc-8db5-7c42b274c6b0" />

### Register

<img width="1548" height="1286" alt="image" src="https://github.com/user-attachments/assets/ce547c3d-8184-4125-9bed-e9bb91ef2274" />
<img width="1962" height="1554" alt="image" src="https://github.com/user-attachments/assets/665f328a-d02c-434e-8cc6-2e8d98f2b23f" />

### Task Management

<img width="2202" height="1592" alt="image" src="https://github.com/user-attachments/assets/c8883696-afec-4486-b43a-f4bc7c826ea8" />

<img width="2298" height="1468" alt="image" src="https://github.com/user-attachments/assets/7a664f69-f8fa-4242-aa9c-13818208f816" />
<img width="1990" height="1452" alt="image" src="https://github.com/user-attachments/assets/3fe0bf5d-a8c7-4a53-bad9-d8ba127d32a4" />
<img width="2434" height="1596" alt="image" src="https://github.com/user-attachments/assets/f2849e80-d0d3-4f89-b70b-f04a1aea5fd6" />

<img width="2132" height="1526" alt="image" src="https://github.com/user-attachments/assets/b312128e-5f88-4a7f-8f06-0226b6bfab77" />


---

# Project Structure

```text
task-management-app/
├── web/
│   ├── features/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── api/
│   ├── pages/
│   └── utils/
│
│                                Detailed frontend structure above.
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── validators/
│   ├── tests/
│   ├── types/
│   ├── scripts/
│   └── utils/
│
│
└── docker-compose.yml
```

---

## Future Enhancements

| Enhancement | Rationale |
|---|---|
| Rate limiting on `/auth/login` and `/auth/refresh` | Prevent brute-force and token hammering |
| Swagger / OpenAPI docs | Machine-readable API contract, explorable via browser |
| WebSockets for real-time task updates | Push task changes across devices without polling |
| `tokensInvalidatedAt` field on User | Instant access token invalidation on signout-all without a blocklist |
| RBAC | Multi-role support (admin, member) for team-based task management |
| Activity audit log | Append-only record of create/update/delete events per user |
| Observability | Structured logging, request tracing, error tracking (e.g. Sentry) |
---

---

# License

MIT
