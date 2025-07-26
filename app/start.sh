#!/bin/bash

echo "Stopping all containers"
docker-compose down -v --remove-orphans

echo "Cleaning all"
docker system prune -f
docker volume prune -f
docker network prune -f

echo "Build:"
docker-compose up --build
