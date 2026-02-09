#!/bin/bash
set -e

cd /opt/1panel/docker/compose/youde-dev
docker compose down --rmi all
docker compose pull
docker compose up -d

cd /opt/1panel/docker/compose/gateway
docker compose restart