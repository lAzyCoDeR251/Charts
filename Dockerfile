# Stage 1: Python setup
FROM python:3.9-slim-buster as base

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Node.js setup
FROM node:18.17.1 as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 3: Final stage
FROM base as final

WORKDIR /app

COPY --from=build /app .

EXPOSE 80
CMD ["npm", "run", "dev"]
