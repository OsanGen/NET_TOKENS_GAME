#!/usr/bin/env bash
set -euo pipefail

PORT="${GAME_PORT:-5170}"
PID_FILE="/tmp/astro_gauntlet_${PORT}.pid"

if [[ ! -f "${PID_FILE}" ]]; then
  echo "No PID file found for port ${PORT}"
  exit 0
fi

PID="$(cat "${PID_FILE}")"
CMD="$(ps -p "${PID}" -o command= 2>/dev/null || true)"
if kill -0 "${PID}" >/dev/null 2>&1 && [[ "${CMD}" == *"http.server"* ]]; then
  kill "${PID}"
  echo "Stopped Astro Gauntlet server pid=${PID}"
else
  echo "PID ${PID} is not an active Astro Gauntlet server; clearing stale PID file"
fi

rm -f "${PID_FILE}"
