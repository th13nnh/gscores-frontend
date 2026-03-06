version: '3.8'

services:
  # JAVA BACKEND
  backend:
    build: ./gscores-backend
    container_name: gscores_api
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/gscores_db
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=yourpassword
    depends_on:
      - db

  # REACT FRONTEND
  frontend:
    build: ./gscores-frontend
    container_name: gscores_web
    ports:
      - "3000:80"
    depends_on:
      - backend

  # DATABASE (Optional but recommended)
  db:
    image: mysql:8.0
    container_name: gscores_db
    environment:
      - MYSQL_DATABASE=gscores_db
      - MYSQL_ROOT_PASSWORD=yourpassword
    ports:
      - "3307:3306"