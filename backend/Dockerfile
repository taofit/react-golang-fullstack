# --- Stage 1: Build Stage ---
FROM golang:1.25-alpine AS builder

WORKDIR /app

# 1. Install dependencies first (better caching)
COPY go.mod go.sum ./
RUN go mod download

# 2. Copy the entire source code
COPY . .

# 3. Build the main server
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o backend-main ./cmd/main/main.go

# Build the seeder tool
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o seeder ./cmd/populate-igdb/main.go


# --- Stage 2: Final Runtime Stage ---
FROM alpine:latest
WORKDIR /app

# 1. Install standard CA certs for external APIs (IGDB)
# 'update-ca-certificates' ensures the OS trusts these common authorities
RUN apk add --no-cache ca-certificates tzdata && update-ca-certificates

# 2. Download the Amazon RDS Global Bundle
# This is required if you use 'sslmode=verify-full' or 'verify-ca' in AWS
ADD https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem /app/rds-ca.pem
RUN chmod 644 /app/rds-ca.pem

# 3. Copy your pre-built binaries from the builder stage
COPY --from=builder /app/backend-main .
COPY --from=builder /app/seeder .

# 4. Copy required data files
COPY --from=builder /app/init-db.sql .
COPY --from=builder /app/data/synonyms.json ./data/

# Default command
CMD ["./backend-main"]