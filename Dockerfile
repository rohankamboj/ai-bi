# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

# Modify this line to ignore TypeScript errors
RUN yarn build:ignore-errors

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN yarn global add serve

# Copy built assets from build stage
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD ["serve", "-s", "dist", "-l", "8080"]