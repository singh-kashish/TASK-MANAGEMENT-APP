# TaskFlow - Full Stack Task Management Platform

## Live Demo

**Frontend**
https://task-management-app-delta-sable.vercel.app

**Backend API**
https://task-management-app-rs77.onrender.com/api

---

# Overview

TaskFlow is a production-oriented full-stack task management platform built using React, TypeScript, Node.js, Express, MongoDB, Docker, and GitHub Actions.

The application enables users to securely manage personal tasks while demonstrating modern full-stack engineering practices such as:

- Stateless JWT Authentication
- Refresh Token Cookies
- RESTful API Design
- Feature-Based Frontend Architecture
- Layered Backend Architecture
- MongoDB Index Optimization
- Type-Safe Development with TypeScript
- Responsive UI
- Dockerized Development
- CI/CD Automation

---

# Architecture Overview

The application follows a client-server architecture.

```text
React Client (Vercel)
        │
        ▼
Express API (Render)
        │
        ▼
MongoDB Atlas
```

Detailed architecture decisions are documented in:

```text
ARCHITECTURE.md
```

---

# Features

## Authentication

- User Registration
- User Login
- JWT Access Token Authentication
- Refresh Token via HttpOnly Cookie
- Protected Routes
- Logout Functionality

## Task Management

- Create Tasks
- Update Tasks
- Delete Tasks
- View Task Details
- Filter by Status
- Filter by Priority
- Sort by Due Date
- Sort by Creation Date

## Dashboard Analytics

- Total Tasks
- Todo Tasks
- In Progress Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks
- Completion Rate

## User Experience

- Responsive Mobile Design
- Dark Mode Support
- Loading States
- Empty States
- Toast Notifications
- Confirmation Dialogs

## Developer Features

- Dockerized Development Environment
- GitHub Actions CI Pipeline
- Type Safety with TypeScript
- Request Validation
- Centralized Error Handling
- React Query Caching

---

# Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- React Router
- Redux Toolkit
- TanStack Query
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- Shadcn UI
- Lucide Icons

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod
- Helmet
- Compression

## Testing

- Jest
- Supertest

## DevOps

- Docker
- Docker Compose
- GitHub Actions
- Vercel
- Render
- MongoDB Atlas

---

# Responsive Design

The application is fully responsive and optimized for:

- Mobile Devices
- Tablets
- Desktop Screens

Responsive layouts are implemented using Tailwind CSS utility classes.

---

# Security Features

- Password hashing using bcryptjs
- JWT Access Token authentication
- Refresh Token stored in HttpOnly Cookie
- Protected API routes
- Authentication middleware
- Zod validation
- Helmet security headers
- CORS protection
- Request compression
- Centralized error handling
- Environment-based configuration

---

# Validation Strategy

## Frontend

- React Hook Form
- Zod Schemas
- Immediate Validation Feedback
- Type-safe Form Handling

## Backend

- Zod Request Validation Middleware
- Body Validation
- Query Validation
- Route Parameter Validation

---

# State Management

## Client State

- Redux Toolkit

## Server State

- TanStack Query

Redux manages client-side application state while TanStack Query handles API caching, synchronization, background refetching, loading states, and server state consistency.

---

# Database Design

## User Collection

| Field        | Type            |
| ------------ | --------------- |
| email        | String (Unique) |
| passwordHash | String          |

## Task Collection

| Field       | Type     |
| ----------- | -------- |
| title       | String   |
| description | String   |
| priority    | Enum     |
| status      | Enum     |
| dueDate     | Date     |
| userId      | ObjectId |

## Relationships

```text
User (1)
   │
   │ owns
   ▼
Task (Many)
```

## Indexes

The Task collection uses the following compound indexes:

```text
{ userId: 1, status: 1 }

{ userId: 1, priority: 1 }

{ userId: 1, dueDate: 1 }

{ userId: 1, createdAt: -1 }

{ userId: 1, status: 1, priority: 1 }
```

These indexes improve filtering, sorting, and dashboard query performance.

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

### Task Management

<img width="2298" height="1468" alt="image" src="https://github.com/user-attachments/assets/7a664f69-f8fa-4242-aa9c-13818208f816" />
<img width="2186" height="1542" alt="image" src="https://github.com/user-attachments/assets/8707e5bc-7efa-420f-9c1f-368e6a39b860" />
<img width="2186" height="1542" alt="image" src="https://github.com/user-attachments/assets/f7cb4d28-87e4-4473-9387-c20b7c370920" />
<img width="2186" height="1542" alt="image" src="https://github.com/user-attachments/assets/5549bea7-ea3d-42fb-b3a4-5d12ddbdcbc9" />
<img width="736" height="1206" alt="image" src="https://github.com/user-attachments/assets/279fcc5d-4196-4e9c-bb4a-bdd8cb193920" />

---

# Project Structure

```text
task-management-app/
├── web/
│   ├── features/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   └── api/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   └── validators/
│
└── docker-compose.yml
```

---

# Future Improvements

- Refresh Token Validation Endpoint
- Refresh Token Rotation
- RBAC
- Activity Audit Logs
- Email Notifications
- Real-time Updates via WebSockets
- Kanban Board View
- Swagger/OpenAPI Documentation

---

# License

MIT
