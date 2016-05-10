#!/usr/bin/env node
require('shelljs/global');

var Promise = require('bluebird');
var request = require('request');
var config = require('../cfg/base');
var info = './bin/info.json';
var jsonfile = require('jsonfile');

var infoFile = require('../cfg/load');

module.exports = function () {
  var method = 'GET';

  //** This must come from API when user is logging in or something... **
  // By hand, we will set user id to 1 and then fetch plugins from there
  const userId = 1;

  // TODO: when verification api is available -> get available plugins and build app

  /*var verify = new Promise((resolve, reject) => {
    request({
      method: method,
      url: 'Customers/' + userId,
      baseUrl: config.apiUrl,
      json: true
    }, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      if (response.statusCode >= 400) {
        return reject(body.errors);
      }

      if (response.statusCode === 0) {
        return reject(new Error('General API Error'));
      }

      // install lunchbadger core
      exec('pwd');
      echo('CORE!');

      //exec('git clone git@gitlab.neoteric.eu:LunchBadger/lunchbadger-core.git >/dev/null 2>&1');

      if (body.plugins) {
        var lunchbadgerPlugins = body.plugins.map(function (plugin) {
          // this map is required until we move to npm - now we need to point to plugins directory to build app
          // installing from GITLab
          // TODO: switch to npm after publishing modules

          exec('git clone git@gitlab.neoteric.eu:LunchBadger/lunchbadger-' + plugin + '.git >/dev/null 2>&1');

          return './plugins/lunchbadger-' + plugin;
        });
      } else {
        lunchbadgerPlugins = [];
      }

      jsonfile.writeFileSync(info, {
        plugins: lunchbadgerPlugins
      });

      return resolve({
        response: response,
        body: body,
        plugins: lunchbadgerPlugins
      });
    });
  });*/

  var verify = new Promise((resolve, reject) => {
    cd('plugins');

    // install lunchbadger core
    echo('Installing core...');
    exec('git clone git@gitlab.neoteric.eu:LunchBadger/lunchbadger-core.git >/dev/null 2>&1');
    cd('lunchbadger-core');
    exec('npm install --silent && npm run dist >/dev/null 2>&1');
    cd('..');

    // install plugins
    infoFile.plugins.forEach(function (plugin) {
      echo('Installing ' + plugin + ' plugin...');
      exec('git clone git@gitlab.neoteric.eu:LunchBadger/lunchbadger-' + plugin + '.git >/dev/null 2>&1');
      cd('lunchbadger-' + plugin);

      exec('npm install --silent && npm run dist >/dev/null 2>&1');
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
