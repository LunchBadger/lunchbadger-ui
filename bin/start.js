#!/usr/bin/env node
require('shelljs/global');
exec('npm run clean && node server.js --env=dev');
