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

function wait_for_http() {
  echo "waiting for $1 for up to $2 seconds"

  success=1
  for i in `seq $2`; do
    curl $1 >/dev/null 2>&1
    if [ $? -eq 0 ]; then
      success=0
      break
    fi
    sleep 1
  done

  echo "done waiting after $i seconds (result=$success)"
  return $success
}

docker-compose up -d
if ! wait_for_http "http://localhost:4230/api/WorkspaceStatus/ping" 30; then
  exit 1
fi

# run tests
docker run -it --rm -v `pwd`:/opt/lunchbadger -e PARENT_PWD=`pwd` lunchbadger-ui:test npm run test:nodocker $@
