FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the Nest.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "start:prod" ]