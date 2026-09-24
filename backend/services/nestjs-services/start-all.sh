#!/bin/sh
# Runs each microservice as its own Node process inside a single container.
# Per-service settings come from <PREFIX>_DATABASE_URL, e.g. AUTH_DATABASE_URL.
# If any process exits, the others are stopped and the container exits so
# Docker's restart policy brings the whole set back up.

PIDS=""

start() {
  name=$1
  db_url=$2
  echo "[start-all] starting $name"
  DATABASE_URL="$db_url" KAFKA_CLIENT_ID="$name" \
    node "dist/apps/$name/src/main.js" &
  PIDS="$PIDS $!"
}

stop_all() {
  for pid in $PIDS; do kill "$pid" 2>/dev/null; done
  wait
}

trap 'stop_all; exit 0' TERM INT

start auth-service "$AUTH_DATABASE_URL"
start users-service "$USERS_DATABASE_URL"
start outcomes-service "$OUTCOMES_DATABASE_URL"
start notifications-service "$NOTIFICATIONS_DATABASE_URL"

while :; do
  for pid in $PIDS; do
    if ! kill -0 "$pid" 2>/dev/null; then
      echo "[start-all] process $pid exited, stopping all services"
      stop_all
      exit 1
    fi
  done
  sleep 5
done
