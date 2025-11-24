#!/bin/bash
# set -e  # Exit immediately if a command fails

# Stop and remove containers, networks, etc.
docker compose down

# Remove all unused data
docker system prune -a -f
docker volume prune -f

# Bring containers up
docker compose up --build

# Run migrations using pnpm
turbo run migrate:up
