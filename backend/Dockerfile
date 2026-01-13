FROM golang:1.25-alpine AS builder

WORKDIR /app
# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

RUN go build -o main ./cmd/main/main.go
RUN go build -o populate ./cmd/populate-igdb/main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates
WORKDIR /root
COPY --from=builder /app/main .
COPY --from=builder /app/populate .
EXPOSE 8080
CMD ["sh", "-c", "./populate; ./main"]