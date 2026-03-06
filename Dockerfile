# Stage 1: Build React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

## Stage 1: Build the React app
#FROM node:20-alpine AS build
#
#WORKDIR /app
#
## Copy package files and install dependencies
#COPY package*.json ./
#RUN npm install
#
## Copy the rest of the code and build
#COPY . .
#RUN npm run build
#
## Stage 2: Serve with Nginx
#FROM nginx:stable-alpine
#
## Copy the build output to Nginx's html folder
#COPY --from=build /app/build /usr/share/nginx/html
#
## Copy a custom nginx config if you have one (optional)
## COPY nginx.conf /etc/nginx/conf.d/default.conf
#
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]