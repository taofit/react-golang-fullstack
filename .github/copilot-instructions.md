# Copilot / AI Agent Instructions

Purpose: Short, action-oriented guidance to help an AI coding agent become productive in this repo.

Big picture
- **Monorepo structure:** two main components: a Go backend (`backend/`) and a JavaScript/Node frontend (`frontend/`). Docker compose ties them together with a Postgres DB (`docker-compose.yml`).
- **Runtime flow:** frontend (port 3000) calls backend APIs (port 8080); backend persists to Postgres (env `DATABASE_URL`).

Key files & where to look
- Backend entrypoints: `backend/cmd/` (expected `main`), libraries in `backend/internal/`.
- Frontend entrypoints: `frontend/src/` and static assets in `frontend/public/`.
- Orchestration: `docker-compose.yml` defines services and dev mounts.
- DB init: `docker-compose.yml` references `init-db.sql` (used to enable extensions like `pg_trgm`).

How to run (dev-focused, discoverable from repo)
- Quick dev (recommended):
```bash
docker-compose up --build
```
- Backend dev (docker-compose uses):
```bash
# inside container or local with Go installed
go run ./cmd/main/main.go
# hot reload hint in compose: "air" can be used if present in the developer environment
```
- Frontend dev (docker-compose uses Node dev server):
```bash
# typical steps (install deps if needed)
cd frontend
npm install # or yarn
npm start
```

Project-specific conventions & notes for agents
- Volumes are mounted in `docker-compose.yml` for hot-reload; edits map directly into containers. Avoid changes that break the dev volume layout.
- Backend expects environment variables: `DATABASE_URL` and `PORT` (default 8080 in compose).
- Frontend docker config sets `CHOKIDAR_USEPOLLING=true` to avoid file-watch issues on Docker for macOS; preserve this pattern when editing watch/build scripts.
- DB health: compose uses `pg_isready` healthcheck; migrations/SQL initialization may be in `init-db.sql` if present.

Patterns to follow when coding
- Keep server entrypoint under `backend/cmd/...` and library code under `backend/internal/...` (typical Go layout).
- Frontend code should live in `frontend/src` and expose a dev server on 3000.
- When adding integrations, update `docker-compose.yml` to document port and env changes so local dev stays reproducible.

Integration points & external dependencies
- Postgres (image `postgres:16-alpine`) — migrations or extension setup can be referenced by `init-db.sql` in repo root.
- The backend is a Go service; the frontend is a Node app. CI or build steps should build both artifacts or rely on `docker-compose` locally.

When you are unsure
- If a runtime file or Dockerfile is missing (e.g., `backend/Dockerfile`, `frontend/Dockerfile`, or `init-db.sql`), search the repo for TODOs or open an issue. Prefer conservative edits: add missing scaffolding only after confirming with maintainer.

Examples (explicit patterns in this repo)
- Dev-run example: `docker-compose.yml` uses `command: go run ./cmd/main/main.go` to start backend.
- File-watch example: frontend sets `CHOKIDAR_USEPOLLING=true` to ensure reliable file watching in containerized dev on macOS.

Next steps for you (agent)
- Inspect `backend/` and `frontend/` directories and open missing entry files under `cmd`/`src` before implementing features.
- If creating tests or CI, mirror the `docker-compose` ports and env vars so CI can run services.

If anything here is unclear or you need deeper detail (package names, DB schema, or CI), tell me which area and I will expand the instructions with concrete code examples.
