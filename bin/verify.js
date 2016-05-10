#!/usr/bin/env node
var Promise = require('bluebird');
var request = require('request');
var config = require('../cfg/base');
var info = './bin/info.json';
var jsonfile = require('jsonfile');

module.exports = function () {
  var method = 'GET';

  //** This must come from API when user is logging in or something... **
  // By hand, we will set user id to 1 and then fetch plugins from there
  const userId = 1;

  var verify = new Promise((resolve, reject) => {
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

      if (body.plugins) {
        var lunchbadgerPlugins = body.plugins.map(function (plugin) {
          // this map is required until we move to npm - now we need to point to plugins directory to build app
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
  });

  verify.then(function () {
    console.log('verified!');
  }).catch(function () {
    console.log('error...');
  });

  return verify;
};
