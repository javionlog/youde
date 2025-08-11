#!/bin/bash
set -e

docker compose down --rmi all
docker compose pull
docker compose up -d