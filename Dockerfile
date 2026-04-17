FROM node:20-bookworm-slim

WORKDIR /app

# Prisma engine requires OpenSSL in the runtime image.
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm install -g pnpm && pnpm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN pnpm prisma generate

# Copy application
COPY . .

# Build Next.js
RUN pnpm build

# Expose port
EXPOSE 3000

# Run migrations and start app

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]
