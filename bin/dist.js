#!/usr/bin/env node
require('shelljs/global');
var verify = require('./verify');

verify().then(function (response) {
  exec('npm run clean && npm run copy & webpack --env=dist --progress');
}).catch(function (error) {
  console.log(error);
});
