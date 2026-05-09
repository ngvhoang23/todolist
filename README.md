# Todo List NestJS Demo

A small NestJS REST API for a todo list demo. It uses in-memory storage so you can run it immediately without a database.

## Setup

```bash
npm install
```

## Run

```bash
npm run start:dev
```

The API runs on `http://localhost:3000` by default. Swagger docs are available at `http://localhost:3000/docs`.

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
