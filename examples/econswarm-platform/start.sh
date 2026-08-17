#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
task="${1:-Run a complete EconSwarm financial analysis for 600519.SH and return the final decision.}"
cd "$repo_root"
pnpm dsh --profile headless --patch examples/econswarm-platform/cordis.yml "$task"
