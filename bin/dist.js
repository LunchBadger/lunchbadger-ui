#!/usr/bin/env node
require('shelljs/global');

exec('npm run clean && npm run copy & webpack --env=dist --progress');
