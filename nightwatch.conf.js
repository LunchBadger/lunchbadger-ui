const exec = require('child_process').exec;

var phantomCapabilities = {
  "browserName": "phantomjs",
  "javascriptEnabled": true,
  "acceptSslCerts": true,
  "phantomjs.cli.args": ["--ignore-ssl-errors=true"],
  "phantomjs.page.settings.userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36"
};

var chromeCapabilities = {
  "browserName": "chrome",
  "javascriptEnabled": true,
  "acceptSslCerts": true,
  "chromeOptions": {
    // no-sandbox necessary to run inside Docker container
    "args": ["no-sandbox"]
  }
};

var testUrl = 'http://' + (process.env['LBSERVER_HOST'] || 'localhost') + ':8000';
var distUrl = 'http://lunchbadger.ntrc.eu';

module.exports = {
  "src_folders": [
    "test/specs"
  ],
  "output_folder": "test/reports",
  "custom_commands_path": "test/commands",
  "custom_assertions_path": "test/assertions",
  "page_objects_path": "test/pageObjects",
  "globals_path": "test/globals",
  "selenium": {
    "start_process": true,
    "server_path": "./node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-3.14.0.jar",
    "log_path": "",
    "host": "127.0.0.1",
    "port": 4444,
    "cli_args": {
      "webdriver.chrome.driver": "./node_modules/chromedriver/bin/chromedriver"
    }
  },
  "test_settings": {
    "default": {
      "launch_url": testUrl,
      "selenium_port": 4444,
      "selenium_host": "localhost",
      "silent": true,
      "end_session_on_fail": true,
      "skip_testcases_on_fail": false,
      "screenshots": {
        "enabled": true,
        "on_failure": true,
        "on_error": true,
        "path": "test/reports/screenshots"
      },
      "desiredCapabilities": chromeCapabilities
    },
    "phantom": {
      "desiredCapabilities": phantomCapabilities
    },
    "dist": {
      "launch_url": distUrl,
      "desiredCapabilities": chromeCapabilities
    },
    "dist_phantom": {
      "launch_url": distUrl,
      "desiredCapabilities": phantomCapabilities
    }
  }
};
