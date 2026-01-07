FROM golang:1.25-alpine

WORKDIR /app
# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

RUN go build -o main ./cmd/main/main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates
WORKDIR /root
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]