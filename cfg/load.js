'use strict';

const info = './bin/info.json';
const jsonfile = require('jsonfile');
let infoFile = {};

try {
  infoFile = jsonfile.readFileSync(info);
} catch (error) {
  infoFile = {
    plugins: [
      "compose",
      "manage"
    ]
  };
}

module.exports = infoFile;
