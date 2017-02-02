#!/bin/bash

set -x -e

if [ -e coverage ]; then
  rm -rf coverage
fi
mkdir coverage

xvfb-run nightwatch $@

sed -ie "s:$PARENT_PWD/::g" coverage/*.json
istanbul report --root coverage
