# SportIntel MCP Dockerfile for Apify

FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including dev deps for build)
RUN npm install && npm cache clean --force

# Copy source code
COPY src ./src
COPY apify ./apify
COPY docs ./docs
COPY README.md ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

# Create models directory
RUN mkdir -p models

# Set environment
ENV NODE_ENV=production
ENV APIFY_IS_AT_HOME=1

# Expose ports (for debugging)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Run the actor
CMD ["node", "dist/main.js"]
