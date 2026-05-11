# Todo List NestJS Demo

A small NestJS REST API for a todo list demo. Todos are stored in Postgres using the `DATABASE_URL` environment variable.

## Setup

```bash
npm install
```

## Run

```bash
npm run start:dev
```

For local development without Docker, set `DATABASE_URL` first:

```bash
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/todolist"
```

The API runs on `http://localhost:3000` by default. Swagger docs are available at `http://localhost:3000/docs`.

## Docker Compose

```bash
docker compose up -d --build
```

The Compose setup runs the API, Postgres, and nginx. The API receives this Postgres connection string:

```text
postgres://postgres:postgres@db:5432/todolist
```

## Database Migrations

SQL migrations live in `migrations/` and are applied automatically on API startup. Applied migration names are tracked in the `schema_migrations` table.

## Endpoints

```text
POST   /todos
GET    /todos
GET    /todos/:id
PATCH  /todos/:id
PATCH  /todos/:id/toggle
DELETE /todos/:id
```

## Example

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Build a NestJS todo demo","description":"Keep it simple and useful"}'
```

```bash
curl http://localhost:3000/todos
```

## Test

```bash
npm test
```
