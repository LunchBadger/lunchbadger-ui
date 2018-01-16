'use strict';
// var fs = require('fs');

const info = './cfg/info.json';
// const infoAPI = './../../server/info.json';
const jsonfile = require('jsonfile');
let infoFile = {};

try {
  // if (fs.existsSync(infoAPI)) {
  //   infoFile = jsonfile.readFileSync(infoAPI);
  // } else {
    infoFile = jsonfile.readFileSync(info);
  // }
} catch (error) {
  infoFile = {
    plugins: [
      'compose',
      'manage'
    ]
  };
}

module.exports = infoFile;
