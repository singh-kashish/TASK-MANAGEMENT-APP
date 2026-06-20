# Architecture Overview

## Design Goals

The application was designed with the following goals:

- Separation of concerns
- Scalability
- Maintainability
- Type safety
- Production readiness

---

# Frontend Architecture

The frontend follows a feature-driven architecture.

```text
src/

api/

components/

features/
    auth/
    tasks/

hooks/

pages/

routes/

utils/
```

Benefits:

- Business logic remains close to features.
- Easier scaling as new domains are added.
- Reduced coupling between modules.

---

# Backend Architecture

The backend follows a layered architecture.

```text
controllers/

services/

models/

routes/

validators/

middleware/
```

Request Flow:

Route
→ Validation
→ Authentication
→ Controller
→ Service
→ Database

Benefits:

- Controllers remain thin.
- Business logic lives in services.
- Validation remains reusable.
- Easier testing.

---

# Database Design

## User

```text
User

_id
email
passwordHash
createdAt
updatedAt
```

---

## Task

```text
Task

_id
title
description
status
priority
dueDate
user
createdAt
updatedAt
```

Relationship:

User (1)
|
|
v
Task (Many)

---

# Authentication Flow

1. User logs in.
2. Server validates credentials.
3. JWT access token is generated.
4. Frontend stores token.
5. Axios interceptor attaches token.
6. Protected APIs validate JWT.
7. Unauthorized requests return 401.

---

# Statistics Design

Initially statistics were calculated from the filtered task list on the frontend.

Issue:

Applying filters changed dashboard metrics.

Solution:

Dedicated backend endpoint:

GET /api/tasks/stats

MongoDB aggregation pipeline calculates:

- Total
- Todo
- In Progress
- Completed
- Pending
- Overdue
- Completion Rate

Benefits:

- Single database query
- Accurate metrics
- Independent of UI filters

---

# Trade-offs

## Chosen

MongoDB Aggregation

Pros:

- Single query
- Fast dashboard metrics

Cons:

- More complex query logic

---

## Chosen

JWT Access Tokens

Pros:

- Stateless
- Scalable

Cons:

- Requires refresh token implementation for long sessions

---

## Future Enhancements

- Refresh Token Rotation
- RBAC
- Event-driven notifications
- Distributed caching
- Observability and metrics
