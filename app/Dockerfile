FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (without frozen lockfile since we might not have it)
RUN bun install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application with instrumentation
CMD ["bun", "run", "--preload", "./instrumentation.ts", "index.ts"]
