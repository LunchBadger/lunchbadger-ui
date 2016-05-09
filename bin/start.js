#!/usr/bin/env node
require('shelljs/global');
var verify = require('./verify');

verify().then(function (response) {
  exec('npm run clean && node server.js --env=dev');
}).catch(function (error) {
  console.log(error);
});
