#!/bin/bash

docker-compose build || exit 1
docker-compose up -d || exit 1

function cleanup() {
  docker-compose down
}
trap cleanup EXIT

bin/wait-for-it.sh 127.0.0.1:8000 -t 10 || exit 1
bin/wait-for-it.sh 127.0.0.1:3000 -t 10 || exit 1

./node_modules/.bin/nightwatch $@
