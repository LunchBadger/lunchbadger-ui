#!/bin/bash

docker-compose build || exit 1
docker-compose up -d || exit 1

function cleanup() {
  docker-compose down
}
trap cleanup EXIT

sleep 5

./node_modules/.bin/nightwatch $@
