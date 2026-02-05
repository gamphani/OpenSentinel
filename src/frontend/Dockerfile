FROM node:18-alpine

WORKDIR /app

# 1. Install dependencies first (Caching layer)
COPY package.json package-lock.json* ./
RUN npm install

# 2. Copy the rest of the application
COPY . .

# 3. Start the Next.js development server
CMD ["npm", "run", "dev"]