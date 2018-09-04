#!/bin/bash

set -e

# compile UI
LBSERVER_HOST=$(ip addr show dev docker0 | grep -Eo 'inet [0-9\.]+' | awk '{ print $2 }') npm run dist:test

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

# run tests
docker run -it --rm -v `pwd`:/opt/lunchbadger -e PARENT_PWD=`pwd` lunchbadger-ui:test npm run test:nodocker $@
