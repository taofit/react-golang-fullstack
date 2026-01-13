# Eneba Game Matcher

A modern web application for finding games with synonym-powered search and IGDB integration.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose installed.
- IGDB Credentials (from [Twitch Developers](https://dev.twitch.tv/console)).

## ✨ Implemented Optional Requirements
- **Detail Page**: Comprehensive game details fetched dynamicallly from the database.
- **Fuzzy Autocompletion**: Real-time suggestions that handle typos and partial matches using `pg_trgm`.
- **Synonym Autocompletion**: Search for games using common synonyms (e.g., "GTA" for "Grand Theft Auto").

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

## ☁️ Production Deployment (Render)

Deploying to Render requires three separate services working together:

### 1. Database (PostgreSQL)
- Create a **New Database** on Render.
- Copy the **Internal Database URL** for the backend service.

### 2. Backend (Web Service)
- **Runtime**: Docker
- **Environment Variables**:
  - `DATABASE_URL`: Your Render DB Internal URL.
  - `IGDB_CLIENT_ID` & `IGDB_CLIENT_SECRET`: Your credentials.
- **Initial Data Population**: **Automatic!** I've configured the container to run the seeder script every time it starts up. This works perfectly on Render's **Free Tier** without needing paid shell access.
- **Database Reset (Free)**: If you want to wipe the database and start fresh, add the environment variable `TRUNCATE_DB=true` in Render. Re-deploy, wait for it to finish, and then **remove** the variable (to prevent wiping on every subsequent restart).

### 3. Frontend (Static Site)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: The URL of your Render backend service.

---

## 🛠️ Key Commands
- `docker compose run --rm populate-igdb`: Local setup for fetching and inserting game data.
- `docker compose restart backend`: Run this if you change Go source code to recompile inside Docker. (Frontend has hot-reloading).