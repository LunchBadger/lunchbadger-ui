const user = 'sk';

const request = require('request');

const CLEAR_PROJECT_URL = `http://internal-${user}-dev.staging.lunchbadger.io/project-api/api/Projects/test-dev/clear`;
const CLEAR_SLS_URL = `http://sls-${user}-dev.staging.lunchbadger.io/service`;

module.exports = {
  beforeEach: function(browser, cb) {
    request.post(CLEAR_PROJECT_URL, err1 =>
      request.del(CLEAR_SLS_URL, err2 => cb(err1 || err2))
    );
  }
};
