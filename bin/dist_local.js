#!/usr/bin/env node
require('shelljs/global');
var verify = require('./verify_local');

verify().then(function (response) {
  exec('npm run clean && npm run copy & webpack --env=dev --progress');
}).catch(function (error) {
  console.log(error);
});
