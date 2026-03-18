# Task Manager

A task manager app for managing daily activities, built with **NestJS** (Backend) & **Next.js** (Frontend).

## Tech Stack

### Backend

- **NestJS** - Node.js framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Redis** - Cache

### Frontend

- **Next.js 15** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client

---

## Installation & Setup

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 7
- npm >= 9

### 1. Clone Repository

```bash
git clone https://github.com/madamiz/task-manager.git
cd task-manager
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
```

**Configure your database connection in `backend/.env`:**

```text
DATABASE_URL="postgresql://user:password@localhost:5432/task_manager?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
PORT=3001
```

**Run Prisma migration to create tables:**

```bash
npx prisma migrate dev --name init
```

**Generate Prisma Client:**

```bash
npx prisma generate
```

**Start the backend server:**

```bash
npm run start:dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
```

**Configure environment variables in `frontend/.env`:**

```text
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Start the frontend application:**

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Running Both Applications

For the best development experience, run the backend and frontend simultaneously in separate terminal windows:

**Terminal 1 (Backend):**

```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description    | Default |
| -------------- | -------------- | ------- |
| `PORT`         | Backend port   | `3001`  |
| `DATABASE_URL` | Database URL   | -       |
| `REDIS_URL`    | Redis URL      | -       |
| `JWT_SECRET`   | JWT secret key | -       |

### Frontend (`frontend/.env`)

| Variable              | Description     | Default                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

---

## API Endpoints

### Auth Endpoints

| Method | Endpoint              | Description          | Auth |
| ------ | --------------------- | -------------------- | ---- |
| POST   | `/auth/login`         | User login           | No   |
| POST   | `/auth/refresh-token` | Refresh access token | Yes  |
| POST   | `/auth/logout`        | User logout          | Yes  |

### User Endpoints

| Method | Endpoint           | Description                                         | Auth |
| ------ | ------------------ | --------------------------------------------------- | ---- |
| POST   | `/users`           | Register a new user                                 | No   |
| GET    | `/users`           | List users (Pagination, Filter, & Search)           | No   |
| GET    | `/users/:id`       | Get user by ID                                      | No   |
| PUT    | `/users/:id`       | Update user info                                    | No   |
| DELETE | `/users/:id`       | Delete user                                         | No   |
| GET    | `/users/:id/tasks` | Get tasks by user ID (Pagination, Filter, & Search) | No   |

### Task Endpoints

| Method | Endpoint          | Description                                   | Auth |
| ------ | ----------------- | --------------------------------------------- | ---- |
| POST   | `/tasks`          | Create a new task                             | Yes  |
| GET    | `/tasks`          | List all tasks (Pagination, Filter, & Search) | No   |
| GET    | `/tasks/my-tasks` | Get current user's tasks                      | Yes  |
| GET    | `/tasks/my-stats` | Get current user's task statistics            | Yes  |
| GET    | `/tasks/:id`      | Get task by ID                                | No   |
| PUT    | `/tasks/:id`      | Update task                                   | Yes  |
| DELETE | `/tasks/:id`      | Delete task                                   | Yes  |

---

## API Examples (Request/Response)

### Register

**Request:**

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Muhammad Ammar Izzudin",
    "email": "ammar@example.com",
    "password": "password1234",
    "confirm_password": "password1234"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Muhammad Ammar Izzudin",
    "email": "ammar@example.com",
    "created_at": "2024-03-15T00:00:00.000Z"
  }
}
```

### Login

**Request:**

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ammar@example.com",
    "password": "password1234"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Muhammad Ammar Izzudin",
      "email": "ammar@example.com",
      "created_at": "2024-03-15T00:00:00.000Z"
    },
    "access_token": "access-token",
    "refresh_token": "refresh-token"
  }
}
```

### Logout

**Request:**

```bash
curl -X POST http://localhost:3001/auth/logout \
  -H "Authorization: Bearer <your-token>"
```

**Response (201):**

```json
{
  "status": "success",
  "data": null
}
```

### Refresh Token

**Request:**

```bash
curl -X POST http://localhost:3001/auth/refresh-token \
  -H "Cookie: refreshToken=your-refresh-token"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "access_token": "new-access-token"
  }
}
```

### List Users

**Request:**

```bash
curl "http://localhost:3001/users?page=1&limit=10&search=Ammar"
```

**Response (200):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Muhammad Ammar Izzudin",
      "email": "ammar@example.com",
      "created_at": "2024-03-15T00:00:00.000Z",
      "updated_at": "2024-03-15T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get User by ID

**Request:**

```bash
curl http://localhost:3001/users/uuid
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Muhammad Ammar Izzudin",
    "email": "ammar@example.com",
    "created_at": "2024-03-15T00:00:00.000Z",
    "updated_at": "2024-03-15T00:00:00.000Z"
  }
}
```

### Update User

**Request:**

```bash
curl -X PUT http://localhost:3001/users/uuid \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ammar Izzudin",
    "email": "izzudin@example.com",
    "password": "ammar123",
    "confirm_password": "ammar123"
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Ammar Izzudin",
    "email": "ammar@example.com",
    "created_at": "2024-03-15T00:00:00.000Z",
    "updated_at": "2024-03-15T00:00:00.000Z"
  }
}
```

### Delete User

**Request:**

```bash
curl -X DELETE http://localhost:3001/users/uuid
```

**Response (200):**

```json
{
  "status": "success",
  "data": null
}
```

### Get Tasks by User ID

**Request:**

```bash
curl "http://localhost:3001/users/uuid/tasks?page=1&limit=10"
```

**Response (200):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Technical Test ICN",
      "description": "Test task for ICN",
      "is_completed": false,
      "user_id": "uuid",
      "created_at": "2024-03-15T00:00:00.000Z",
      "updated_at": "2024-03-15T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Create Task

**Request:**

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Technical Test ICN",
    "description": "Test task for ICN"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Technical Test ICN",
    "description": "Test task for ICN",
    "is_completed": false,
    "user_id": "uuid",
    "created_at": "2024-03-15T00:00:00.000Z",
    "updated_at": "2024-03-15T00:00:00.000Z"
  }
}
```

### List All Tasks

**Request:**

```bash
curl "http://localhost:3001/tasks?page=1&limit=10"
```

**Response (200):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Technical Test ICN",
      "description": "Test task for ICN",
      "is_completed": false,
      "user_id": "uuid",
      "user": {
        "id": "uuid",
        "name": "Muhammad Ammar Izzudin",
        "email": "ammar@example.com"
      },
      "created_at": "2024-03-15T00:00:00.000Z",
      "updated_at": "2024-03-15T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Task by ID

**Request:**

```bash
curl http://localhost:3001/tasks/uuid
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Technical Test ICN",
    "description": "Test task for ICN",
    "is_completed": false,
    "user_id": "uuid",
    "user": {
      "id": "uuid",
      "name": "Muhammad Ammar Izzudin",
      "email": "ammar@example.com"
    },
    "created_at": "2024-03-15T00:00:00.000Z",
    "updated_at": "2024-03-15T00:00:00.000Z"
  }
}
```

### Get My Tasks

**Request:**

```bash
curl "http://localhost:3001/tasks/my-tasks?page=1&limit=10&search=Technical" \
  -H "Authorization: Bearer <your-token>"
```

**Response (200):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Technical Test ICN",
      "description": "Test task for ICN",
      "is_completed": false,
      "user_id": "uuid",
      "created_at": "2024-03-15T00:00:00.000Z",
      "updated_at": "2024-03-15T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get My Task Stats

**Request:**

```bash
curl http://localhost:3001/tasks/my-stats \
  -H "Authorization: Bearer <your-token>"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "total": 10,
    "completed": 4,
    "incomplete": 6
  }
}
```

### Update Task

**Request:**

```bash
curl -X PUT http://localhost:3001/tasks/uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "is_completed": true
  }'
```

**Response (200):**

```json
{
    "status": "success",
    "data": {
        "id": "uuid",
        "is_completed": true,
        ...
    }
}
```

### Delete Task

**Request:**

```bash
curl -X DELETE http://localhost:3001/tasks/uuid \
  -H "Authorization: Bearer <your-token>"
```

**Response (200):**

```json
{
  "status": "success",
  "data": null
}
```

---

## Database Schema

### Users Table (`users`)

| Column     | Type      | Constraint       |
| ---------- | --------- | ---------------- |
| id         | UUID      | PRIMARY KEY      |
| name       | VARCHAR   | NOT NULL         |
| email      | VARCHAR   | UNIQUE, NOT NULL |
| password   | VARCHAR   | NOT NULL         |
| created_at | TIMESTAMP | DEFAULT NOW()    |
| updated_at | TIMESTAMP | DEFAULT NOW()    |

### Tasks Table (`tasks`)

| Column       | Type      | Constraint              |
| ------------ | --------- | ----------------------- |
| id           | UUID      | PRIMARY KEY             |
| user_id      | UUID      | FOREIGN KEY → users(id) |
| title        | VARCHAR   | NOT NULL                |
| description  | TEXT      | NULLABLE                |
| is_completed | BOOLEAN   | DEFAULT false           |
| created_at   | TIMESTAMP | DEFAULT NOW()           |
| updated_at   | TIMESTAMP | DEFAULT NOW()           |

**Relation**: One User → Many Tasks (One-to-Many)

---

## Live URL

- **Frontend:** [https://task-manager-iota-rust.vercel.app](https://task-manager-iota-rust.vercel.app)
- **Backend:** [https://task-manager-api-chi-seven.vercel.app](https://task-manager-api-chi-seven.vercel.app)
