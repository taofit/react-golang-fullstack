# frontend/Dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (for better layer caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

RUN npm run build

# Stage 2: Serve with lightweight nginx (production-ready)
FROM nginx:alpine

# Copy the built app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80