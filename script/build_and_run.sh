#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-start}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

show_usage() {
  cat <<'USAGE'
usage: ./script/build_and_run.sh [mode]

Modes:
  start, run        Start the Expo dev-client server on the project port
  --ios, ios        Start Expo dev-client and open iOS
  --android, android
                   Start Expo dev-client and open Android
  --web, web        Start Expo for web
  --dev-client, dev-client
                   Start Expo in development-client mode
  --clear, clear    Start Expo dev-client with a clean Metro cache
  --tunnel, tunnel Start Expo dev-client using tunnel transport
  --export-web, export-web
                   Export the web build locally
  --doctor, doctor Run Expo diagnostics
  --help, help     Show this help
USAGE
}

resolve_expo_cmd() {
  if [[ -n "${EXPO_CLI:-}" ]]; then
    # shellcheck disable=SC2206
    EXPO_CMD=(${EXPO_CLI})
    return
  fi

  if [[ -f pnpm-lock.yaml ]] && command -v pnpm >/dev/null 2>&1; then
    EXPO_CMD=(pnpm exec expo)
  elif [[ -f yarn.lock ]] && command -v yarn >/dev/null 2>&1; then
    EXPO_CMD=(yarn expo)
  elif { [[ -f bun.lock ]] || [[ -f bun.lockb ]]; } && command -v bun >/dev/null 2>&1; then
    EXPO_CMD=(bunx expo)
  else
    EXPO_CMD=(npx expo)
  fi
}

run_doctor() {
  if [[ -f pnpm-lock.yaml ]] && command -v pnpm >/dev/null 2>&1; then
    pnpm exec expo-doctor
  elif [[ -f yarn.lock ]] && command -v yarn >/dev/null 2>&1; then
    yarn expo-doctor
  elif { [[ -f bun.lock ]] || [[ -f bun.lockb ]]; } && command -v bun >/dev/null 2>&1; then
    bunx expo-doctor
  else
    npx expo-doctor
  fi
}

resolve_expo_cmd

case "$MODE" in
  start|run|--dev-client|dev-client)
    exec env DARK_MODE=media APP_VARIANT=development "${EXPO_CMD[@]}" start --dev-client --port 8082
    ;;
  --clear|clear)
    exec env DARK_MODE=media APP_VARIANT=development "${EXPO_CMD[@]}" start --dev-client --port 8082 --clear
    ;;
  --ios|ios)
    exec env DARK_MODE=media APP_VARIANT=development "${EXPO_CMD[@]}" start --dev-client --port 8082 --ios
    ;;
  --android|android)
    exec env DARK_MODE=media APP_VARIANT=development "${EXPO_CMD[@]}" start --dev-client --port 8082 --android
    ;;
  --web|web)
    exec env DARK_MODE=media "${EXPO_CMD[@]}" start --web
    ;;
  --tunnel|tunnel)
    exec env DARK_MODE=media APP_VARIANT=development "${EXPO_CMD[@]}" start --dev-client --port 8082 --tunnel
    ;;
  --export-web|export-web)
    exec "${EXPO_CMD[@]}" export --platform web
    ;;
  --doctor|doctor)
    run_doctor
    ;;
  --help|help)
    show_usage
    ;;
  *)
    show_usage >&2
    exit 2
    ;;
esac
