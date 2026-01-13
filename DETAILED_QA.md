# ❓ Detailed Project Q&A - AI Collaboration Log

This document captures the specific technical questions and detailed answers provided during the development of the Eneba Game project.

---

## 🏗️ Architecture & Infrastructure

### Q: Why shouldn't I run the database population script in the `Dockerfile`?
**A:** Docker builds happen in isolation. During the build phase, your PostgreSQL container isn't running yet, so the script cannot connect to the database. Additionally, you want your build to be fast and deterministic, not dependent on external APIs (IGDB) that might be slow or down. The best approach is to run seeding at "Runtime" (during deployment hooks or container startup).

### Q: Why does the population script run every time I run `docker compose up --build`?
**A:** This happens for two reasons:
1. **Docker Compose Behavior**: Every service defined in `docker-compose.yml` (including the `populate-igdb` service) is started by default.
2. **Container Startup Logic**: I updated the `backend/Dockerfile` CMD to `sh -c "./populate; ./main"` to ensure the database is seeded automatically on Render.
*Solution:* Use Docker Profiles to make the seeder optional locally, or specify services explicitly: `docker compose up backend frontend db`.

### Q: How do I handle the database connection string (`DATABASE_URL`)?
**A:** The standard format is `postgres://user:password@host:port/dbname?sslmode=disable`. 
- **Inside Docker**: Use `db` as the host (e.g., `postgres://postgres:secret@db:5432/games`).
- **On Local Mac**: Use `localhost` (e.g., `postgres://postgres:secret@localhost:5432/games`).
- **On Render**: Use the "Internal Database URL" provided in their dashboard.

---

## ☁️ Deployment (Render Free Tier)

### Q: How can I populate the database on Render if I don't want to pay for the "Shell" or "Jobs" feature?
**A:** I modified the `backend/Dockerfile` to run the `./populate` binary immediately before the `./main` application starts within the same container. This ensures the data is seeded at zero additional cost whenever the service boots.

### Q: Will the database be populated on the very first deploy if the tables don't exist?
**A:** Initially, no. I realized the seeder script assumed tables existed. I updated the script to include an `initSchema` function that automatically creates the tables and the `pg_trgm` extension if they are missing, making it a "zero-touch" deployment.

### Q: How do I reset or truncate the database on Render without shell access?
**A:** Added support for a `TRUNCATE_DB=true` environment variable. If you set this in the Render dashboard and re-deploy, the seeder will wipe the tables before refetching data. (Remember to remove it after the reset to avoid wiping data on every restart).

### Q: What should `VITE_API_URL` be on the frontend?
**A:** It should be the public URL of your Render backend (e.g., `https://your-app.onrender.com`). Because Vite bakes these into the code at "Build Time", you must set this variable in the Render dashboard *before* the frontend builds.

---

## 🔍 Search & Data

### Q: Why were some game covers still small (`t_thumb`) after updating the logic to `t_cover_big`?
**A:** The database likely contained stale data from previous runs. Your script fetches the top 100 games, but your DB might contain more than that. The logic using `image_id` to build the `t_cover_big` URL is correct, but only applies to the games fetched in the current run.
*Fix:* Increase the fetch limit to cover all games, or use the `TRUNCATE_DB` tool to start fresh.

### Q: How does the fuzzy search logic prevent SQL errors with `DISTINCT`?
**A:** Standard SQL requires `ORDER BY` columns to appear in the `SELECT` list when using `DISTINCT`. To fix this, I refactored the query to use `GROUP BY name` and `MAX(GREATEST(...))` to find the highest similarity score for each game name, allowing for accurate sorting without duplication errors.

### Q: How are synonyms handled in search?
**A:** We created a `game_synonyms` table and a `synonyms.json` file. The backend search query now checks for similarity against both the official game name AND the synonyms, returning the best match for either.
