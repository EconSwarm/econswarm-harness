#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$repo_root"
docker compose --env-file .env -f examples/econswarm-platform/deploy/docker-compose.yml up --build
