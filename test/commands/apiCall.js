var util = require('util');
var events = require('events');

function apiCall () {}
util.inherits(apiCall, events.EventEmitter);

apiCall.prototype.command = function (method, data, cb) {
  var request = require('request');
  request[method](data, function (error, response, body) {
    if (error) {
      return;
    }
    cb && cb(body);
    this.emit('complete');
  }.bind(this));
};

module.exports = apiCall;
