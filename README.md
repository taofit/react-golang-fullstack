- first time setup (populate the database):
`docker compose run --rm populate-igdb`

- start all services: `docker compose up --build`
- stop all: `docker compose down`
- start frontend: `npm run dev`
- start backend: `go run ./cmd/main/main.go`
- stop backend: `docker compose stop backend`
- stop frontend: `docker compose stop frontend`
- stop db: `docker compose stop db`
- start the backend only: `docker compose up --build backend`
- start the database only: `docker compose up --build db`
- start both backend and database: `docker compose up -d db backend`
- check the logs: `docker compose logs -f backend`

## project structure
- backend: `./backend`
- frontend: `./frontend`
    - src: components(reusable ui components), pages(screens), types(data shapes), utils