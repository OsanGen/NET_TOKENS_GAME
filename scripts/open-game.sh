#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${GAME_PORT:-5170}"
HOST="${GAME_HOST:-127.0.0.1}"
URL="http://${HOST}:${PORT}"
PID_FILE="/tmp/astro_gauntlet_${PORT}.pid"
LOG_FILE="/tmp/astro_gauntlet_${PORT}.log"

is_running() {
  local pid="$1"
  [[ -n "${pid}" ]] && kill -0 "${pid}" >/dev/null 2>&1
}

is_server_pid() {
  local pid="$1"
  if ! is_running "${pid}"; then
    return 1
  fi
  local cmd
  cmd="$(ps -p "${pid}" -o command= 2>/dev/null || true)"
  [[ "${cmd}" == *"http.server"* ]] && [[ "${cmd}" == *"${PORT}"* ]]
}

is_port_live() {
  lsof -iTCP:"${PORT}" -sTCP:LISTEN -nP >/dev/null 2>&1
}

read_pid() {
  if [[ -f "${PID_FILE}" ]]; then
    cat "${PID_FILE}"
  fi
}

start_server() {
  cd "${ROOT_DIR}"
  nohup python3 -m http.server "${PORT}" --bind "${HOST}" >"${LOG_FILE}" 2>&1 &
  echo "$!" >"${PID_FILE}"
}

PID="$(read_pid || true)"

# Reset stale/reused PID records before deciding launch behavior.
if [[ -n "${PID:-}" ]] && ! is_server_pid "${PID}"; then
  rm -f "${PID_FILE}"
  PID=""
fi

if [[ -z "${PID:-}" ]] || ! is_server_pid "${PID}" || ! is_port_live; then
  start_server
fi

for _ in {1..20}; do
  if curl -fsS "${URL}" >/dev/null 2>&1; then
    open "${URL}"
    echo "Astro Gauntlet opened at ${URL}"
    exit 0
  fi
  sleep 0.15
done

echo "Server did not respond at ${URL}; check ${LOG_FILE}" >&2
exit 1
