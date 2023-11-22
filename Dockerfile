# Use the official Node.js image as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Prisma generate
RUN npx prisma generate

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port that your Express application is listening on
EXPOSE 8087

# Set the command to start your application
CMD [ "npm", "run", "start" ]
