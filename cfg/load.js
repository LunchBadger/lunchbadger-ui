'use strict';

const info = './bin/info.json';
const jsonfile = require('jsonfile');
let infoFile = {};

try {
  infoFile = jsonfile.readFileSync(info);
} catch (error) {
  infoFile = {
    plugins: [
      "./plugins/lunchbadger-compose",
      "./plugins/lunchbadger-manage"
    ]
  };
}

module.exports = infoFile;
