#!/bin/sh
set -eu
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' 'SetFlow needs Node.js 18 or newer. You can still open index.html for local-only mode.' >&2
  exit 1
fi
printf '%s\n' 'Starting SetFlow at http://localhost:4173'
exec node server.mjs
