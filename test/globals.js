const request = require('request');

// const HOST = process.env.LBSERVER_HOST || 'localhost';
const CLEAR_URL = 'http://internal-demo-dev.staging.lunchbadger.io/project-api/api/Projects/demo-dev/clear'; //`http://${HOST}:4230/api/Projects/demo-dev/clear`;

module.exports = {
  beforeEach: function(browser, cb) {
    request.post(CLEAR_URL, (err) => cb(err));
  }
};
