#!/usr/bin/env node
require('shelljs/global');

var Promise = require('bluebird');
var request = require('request');
var config = require('../cfg/base');
var info = './bin/info.json';
var jsonfile = require('jsonfile');

var infoFile = require('../cfg/load');

module.exports = function () {
  var verify = new Promise((resolve) => {
    cd('plugins');

    // install lunchbadger core
    echo('Installing core...');
    exec('git clone ' + config.gitBase + 'lunchbadger-core.git >/dev/null 2>&1');
    cd('lunchbadger-core');
    exec('npm install --silent && npm run dist:local >/dev/null 2>&1');
    cd('..');

    // install plugins
    infoFile.plugins.forEach(function (plugin) {
      echo('Installing ' + plugin + ' plugin...');
      exec('git clone ' + config.gitBase + 'lunchbadger-' + plugin + '.git >/dev/null 2>&1');
      cd('lunchbadger-' + plugin);

      exec('npm install --silent && npm run dist:local >/dev/null 2>&1');
      cd('..');
    });

    cd('..');

    return resolve();
  });

  verify.then(function () {
    console.log('User verified, installing plugins...');
  }).catch(function () {
    console.log('Error while verifying...');
    exit(-1);
  });

  return verify;
};
