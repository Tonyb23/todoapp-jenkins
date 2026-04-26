# ---------------------------------------------------------------
# Stage 1: Choose the base image
# We start from the official Node.js 18 image.
# The -slim variant is a smaller version that has only what
# Node.js needs to run -- no extra tools we do not need.
# This keeps our final image size smaller.
# ---------------------------------------------------------------
FROM node:18-slim
# ---------------------------------------------------------------
# Stage 2: Set the working directory
# All following commands will run from this folder inside the container. 
# If the folder does not exist Docker creates it.
# ---------------------------------------------------------------
WORKDIR /app
# ---------------------------------------------------------------
# Stage 3: Copy dependency files
# We copy package.json and package-lock.json BEFORE copying
# the rest of the code. This is intentional.
# Docker caches each layer. If package.json has not changed,
# Docker will reuse the cached npm install layer on the next
# build -- making rebuilds much faster when you only change
# your application code.
# ---------------------------------------------------------------
COPY package*.json ./

# ---------------------------------------------------------------
# Stage 4: Install dependencies
# npm ci is like npm install but faster and more reliable
# for automated environments. It installs exactly what is
# in package-lock.json without updating it.
# ---------------------------------------------------------------
RUN npm ci --only=production
# ---------------------------------------------------------------
# Stage 5: Copy the application code
# Now we copy everything else. The .dockerignore file
# (which you will create in the next step) controls
# which files are excluded from this copy.
# ---------------------------------------------------------------
COPY . .
# ---------------------------------------------------------------
# Stage 6: Document the port
# EXPOSE does not actually open the port -- it is documentation
# that tells anyone reading the Dockerfile which port the app
# uses. The actual port mapping happens when you run the container.
# ---------------------------------------------------------------
EXPOSE 3000
# ---------------------------------------------------------------
# Stage 7: Define the start command
# CMD defines what runs when the container starts.
# We use the array format which is preferred because it runs
# the command directly without a shell -- more reliable and
# handles signals (like CTRL+C) correctly.
# ---------------------------------------------------------------
CMD ["node", "app.js"]