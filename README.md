# Interview Backend

A minimal Node.js + TypeScript + Express service with a simple in-memory users store.

## Prerequisites

- Node.js 20+ and npm
- Docker (optional, only if you want to run it in a container)

## Setup

Install dependencies:

```bash
npm install
```

## Running locally

Run in development (TypeScript directly via ts-node, no build step):

```bash
npm run dev
```

Or build and run the compiled output:

```bash
npm run build
npm start
```

The server listens on port `3000` by default. Override with the `PORT` environment variable:

```bash
PORT=8080 npm run dev
```

## Running the tests

```bash
npm test
```

## Running with Docker

Build and start with Docker Compose:

```bash
docker compose up --build
```

Or with plain Docker:

```bash
docker build -t interview-backend .
docker run -p 3000:3000 interview-backend
```

## API

Base URL: `http://localhost:3000`

| Method | Path                | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/health`           | Health check       |
| GET    | `/api/v1/users`     | List all users     |
| GET    | `/api/v1/users/:id` | Get a user by id   |
| POST   | `/api/v1/users`     | Create a user      |

### Examples

```bash
# List users
curl http://localhost:3000/api/v1/users

# Get a user by id
curl http://localhost:3000/api/v1/users/1

# Create a user
curl -X POST http://localhost:3000/api/v1/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"New Person","email":"np@example.com","role":"MEMBER"}'
```

## Project structure

```text
src/
  controllers/   HTTP handlers
  repositories/  in-memory data access
  routes/        route definitions
  utils/         logger
  app.ts         Express app setup
  server.ts      entry point
test/            tests
```

## Available scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Run with ts-node (no build)          |
| `npm run build` | Compile TypeScript to `build/`       |
| `npm start`     | Run the compiled server              |
| `npm test`      | Run the test suite                   |
| `npm run lint`  | Check formatting with Prettier       |


## Authentication and authorization

The users API now requires an API key in `x-api-key`.

Configure keys at runtime:

```bash
AUTH_API_KEYS='admin-secret:ADMIN,member-secret:MEMBER' npm run dev
```

Examples:

```bash
curl -H 'x-api-key: member-secret' http://localhost:3000/api/v1/users
curl -X POST http://localhost:3000/api/v1/users   -H 'x-api-key: admin-secret'   -H 'Content-Type: application/json'   -d '{"name":"New Person","email":"new@example.com","role":"MEMBER"}'
```

`GET` operations require authentication. Creating users requires the `ADMIN` role.

For a production system, API keys should be stored and rotated through a secret manager or replaced with an identity provider/JWT-based authentication system. The in-memory repository is intentionally retained because this is an interview exercise.
