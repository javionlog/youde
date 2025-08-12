#!/bin/bash
set -e

cd /opt/1panel/docker/compose/youde-prod
docker compose down --rmi all
docker compose pull
docker compose up -d