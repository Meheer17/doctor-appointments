version: "3.8"
services:
  client-dev:
    build: 
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    env_file:
      - .env.local
  
  client-prd:
    build: 
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "4000:4000"
    env_file:
      - .env