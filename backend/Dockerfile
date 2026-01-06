FROM golang:1.21-alpine

WORKDIR /app/backend

# Copy go mod files
COPY go.mod ./
RUN go mod download

# Copy source code
COPY . .

# Run the application
CMD ["go", "run", "./cmd/main/main.go"]
