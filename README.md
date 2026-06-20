# TaskFlow - Full Stack Task Management Platform

## Overview

TaskFlow is a full-stack task management application built with React, TypeScript, Node.js, Express, MongoDB, and Docker.

The application allows users to:

- Register and authenticate securely using JWT
- Create, update, delete, and manage tasks
- Filter tasks by status and priority
- Track task completion metrics
- View dashboard statistics
- Manage overdue and pending work
- Access protected resources using secure authentication

The project follows modern frontend and backend architectural practices including feature-based organization, React Query server-state management, API validation, centralized error handling, Dockerized deployment, and CI/CD automation.

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Shadcn UI
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Zod Validation

### DevOps

- Docker
- Docker Compose
- GitHub Actions

---

## Features

### Authentication

- User Registration
- User Login
- JWT Access Token Authentication
- Protected Routes

### Task Management

- Create Task
- Update Task
- Delete Task
- View Task Details
- Filter Tasks
- Sort Tasks

### Dashboard Analytics

- Total Tasks
- Todo Tasks
- In Progress Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks
- Completion Rate

### Developer Features

- Dockerized Development Environment
- Request Validation
- Error Handling Middleware
- React Query Caching
- Type Safety
- CI Pipeline

---

## Local Development Setup

### Prerequisites

- Node.js 22+
- MongoDB
- Docker (optional)

### Clone Repository

```bash
git clone https://github.com/singh-kashish/TASK-MANAGEMENT-APP

cd task-management-app
```

### Backend Setup

```bash
cd server

npm install

cp .env.example .env

npm run dev
```

### Frontend Setup

```bash
cd web

npm install

cp .env.example .env

npm run dev
```

---

## Docker Setup

```bash
docker compose up --build
```

Frontend:

```bash
http://localhost:5173
```

Backend:

```bash
http://localhost:8000/api
```

---

## Environment Variables

### Backend

| Variable            | Description               |
| ------------------- | ------------------------- |
| PORT                | API Port                  |
| MONGODB_URI         | MongoDB Connection String |
| CLIENT_URL          | Frontend URL              |
| JWT_ACCESS_SECRET   | Access Token Secret       |
| JWT_REFRESH_SECRET  | Refresh Token Secret      |
| JWT_ACCESS_EXPIRES  | Access Token Expiry       |
| JWT_REFRESH_EXPIRES | Refresh Token Expiry      |

### Frontend

| Variable     | Description          |
| ------------ | -------------------- |
| VITE_API_URL | Backend API Base URL |

---

## API Documentation

### Authentication

POST /api/auth/register

POST /api/auth/login

### Tasks

GET /api/tasks

GET /api/tasks/:taskId

POST /api/tasks

PATCH /api/tasks/:taskId

DELETE /api/tasks/:taskId

GET /api/tasks/stats

---

## Screenshots

<img width="2940" height="1564" alt="image" src="https://github.com/user-attachments/assets/4c746abd-338e-4086-a8d5-0fec9378ed7d" />


### Dashboard
<img width="2936" height="1600" alt="image" src="https://github.com/user-attachments/assets/1d9df7e1-1f4a-4409-8c2c-90d625542aea" />

### Login
<img width="742" height="1328" alt="image" src="https://github.com/user-attachments/assets/44720a17-7083-44fc-8db5-7c42b274c6b0" />

### Task Management
<img width="2186" height="1542" alt="image" src="https://github.com/user-attachments/assets/8707e5bc-7efa-420f-9c1f-368e6a39b860" />
<img width="2186" height="1542" alt="image" src="https://github.com/user-attachments/assets/f7cb4d28-87e4-4473-9387-c20b7c370920" />
<img width="2186" height="1542" alt="image" src="https://github.com/user-attachments/assets/5549bea7-ea3d-42fb-b3a4-5d12ddbdcbc9" />
<img width="736" height="1206" alt="image" src="https://github.com/user-attachments/assets/279fcc5d-4196-4e9c-bb4a-bdd8cb193920" />

---

## Future Improvements

- Refresh Token Rotation
- Role Based Access Control
- Activity Audit Logs
- Email Notifications
- Real-Time Updates using WebSockets

---

## License

MIT
