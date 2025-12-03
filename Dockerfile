# Multi-stage Dockerfile for Smart Community Resource Sharing Portal
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN npm install --prefix server
RUN npm install --prefix client

# Copy application code
COPY . .

# Build React frontend
RUN npm run build --prefix client

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server/index.js"]
