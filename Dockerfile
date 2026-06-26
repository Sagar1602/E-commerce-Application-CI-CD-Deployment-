# ---- Build / install stage ----
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Optional: use a Nexus npm registry during build.
# The .npmrc is copied so `npm ci` pulls from your Nexus proxy/group repo.
COPY package*.json ./
#COPY .npmrc ./

# Install only production dependencies in a reproducible way.
RUN npm ci --only=production

# ---- Runtime stage ----
FROM node:18-alpine

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app

# Copy installed node_modules from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy application source
COPY . .

# Run as the unprivileged node user shipped with the base image
USER node

EXPOSE 3000

# Basic container health check hitting the /health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
