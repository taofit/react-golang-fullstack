# frontend/Dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (for better layer caching)
COPY package*.json ./
RUN npm install

# Define the argument
ARG VITE_API_URL

# Set it as an environment variable for the build process
ENV VITE_API_URL=$VITE_API_URL

# Copy source code
COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80