FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application with instrumentation
CMD ["bun", "run", "--preload", "./instrumentation.ts", "index.ts"]
