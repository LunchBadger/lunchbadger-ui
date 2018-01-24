const request = require('request');

const CLEAR_URL = 'http://internal-demo-dev.staging.lunchbadger.io/project-api/api/Projects/demo-dev/clear';

module.exports = {
  beforeEach: function(browser, cb) {
    request.post(CLEAR_URL, (err) => cb(err));
  }
};
