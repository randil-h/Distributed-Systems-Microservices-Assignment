FROM node:23-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set environment variables
ENV PORT=6967

EXPOSE 6967

CMD ["node", "src/index.js"]
