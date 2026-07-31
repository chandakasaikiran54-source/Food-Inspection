FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Only copy package files first for dependency layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Multi-stage build for slimmer image footprint
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy isolated production node_modules from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/server.js ./server.js
COPY --from=builder /usr/src/app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=5000

# Bind explicitly mapping permissions away from root natively
USER node

EXPOSE 5000

CMD ["npm", "start"]
