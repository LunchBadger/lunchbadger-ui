#!/bin/bash

echo "Deploying Storybook ..."
cd .out
git init
git config user.name "Kristof Olbinski"
git config user.email "kristof@lunchbadger.com"
git add .
git commit -m "Storybook update"
git push --force --quiet https://github.com/LunchBadger/lunchbadger.github.io.git master
cd ..
rm -rf .out
echo ""
echo ""
echo "Storybook deployed to: https://lunchbadger.github.io"
