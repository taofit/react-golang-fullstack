# Eneba Game Matcher

A modern web application for finding games with synonym-powered search and IGDB integration.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose installed.
- IGDB Credentials (from [Twitch Developers](https://dev.twitch.tv/console)).

### 2. Configuration
Create a `.env` file in the `backend/` directory:
```env
IGDB_CLIENT_ID=your_id
IGDB_CLIENT_SECRET=your_secret
PORT=8080
```

### 3. Run the App
```bash
# First time setup: Populate the database
docker compose run --rm populate-igdb

# Start the application
docker compose up --build
```
Access the frontend at: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Backend Architecture
- **Language**: Go 1.25
- **Framework**: Gin
- **Database**: PostgreSQL (with `pg_trgm` for fuzzy search)
- **Features**: 
  - Autocomplete with synonym and fuzzy search support
  - Weighted search results (Name match > Fuzzy match > Synonym match)

## 🎨 Frontend Architecture
- **Framework**: React + Vite
- **Styling**: Material-UI (MUI)
- **State**: standard React hooks and Axios for API calls

---

## ☁️ Production Deployment (Upsun.com)

When deploying to [Upsun](https://upsun.com), you should use **Deployment Hooks** instead of manual Docker commands.

### 1. Build Hook
Ensure your population script is compiled during the build phase in your `.upsun/config.yaml`:
```yaml
hooks:
    build: |
        go build -o bin/app ./cmd/main/main.go
        go build -o bin/populate ./cmd/populate-igdb/main.go
```

### 2. Deploy Hook
Run the population script automatically after the database is ready:
```yaml
hooks:
    deploy: |
        ./bin/populate
```

### 3. Environment Variables
Upsun provides database credentials via `PLATFORM_RELATIONSHIPS`. Your Go code should be updated to parse this variable if it differs from your local `DATABASE_URL`.

---

## 🛠️ Key Commands
- `docker compose run --rm populate-igdb`: Fetches 100 popular games from IGDB and inserts them with synonyms.
- `docker compose restart backend`: If you change Go source code, run this to recompile. (Frontend has hot-reloading).