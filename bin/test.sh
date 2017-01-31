#!/bin/bash

set -e

# compile UI
LBSERVER_HOST=$(ip addr show dev docker0 | grep -Eo 'inet [0-9\.]+' | awk '{ print $2 }') npm run dist:local

# build containers
docker-compose build
docker-compose pull
docker build -t lunchbadger-ui:test -f containers/test/Dockerfile .

# start environment
function cleanup() {
  echo "<------------- start of logs"
  docker-compose logs
  echo "<------------- end of logs"
  docker-compose down
}
trap cleanup EXIT

docker-compose up -d
for port in 8000 4230 4231 3002; do
  bin/wait-for-it.sh 127.0.0.1:$port -t 10
done
sleep 2

# run tests
docker run -it --rm -v `pwd`:/opt/lunchbadger lunchbadger-ui:test npm run test:nodocker $@
