Instructions
- start frontend: `npm run dev`
- start backend: `go run ./cmd/main/main.go`
- start all: `docker-compose up --build`
- stop all: `docker-compose down`
- stop backend: `docker-compose stop backend`
- stop frontend: `docker-compose stop frontend`
- stop db: `docker-compose stop db`
- stop all: `docker-compose down`
- stop backend: `docker-compose stop backend`
- stop frontend: `docker-compose stop frontend`
- stop db: `docker-compose stop db`

## project structure
- backend: `./backend`
- frontend: `./frontend`
    - src: components(reusable ui components), pages(screens), types(data shapes), utils
    - public: static files
    - vite.config.ts: vite configuration
    - index.html: index file
    - App.tsx: main app file
    
- docker: `./docker`