const request = require('request');

const HOST = process.env.LBSERVER_HOST || 'localhost';
const CLEAR_URL = `http://${HOST}:3000/api/Projects/demo-dev/clear`;

module.exports = {
  beforeEach: function(browser, cb) {
    request.post(CLEAR_URL, (err) => cb(err));
  }
};
