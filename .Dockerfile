version: '3.8'

services:
  backend:
    image: backend:latest
    container_name: backend_container
    ports:
      - "8080:8080" 
    restart: always

  frontend:
    image: frontend:latest
    container_name: frontend_container
    ports:
      - "80:80" 
    depends_on:
      - backend
    restart: always
