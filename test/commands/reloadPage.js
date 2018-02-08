exports.command = function (callback) {
  var self = this;
  this.refresh(function () {
    self
      .waitForElementVisible('.app', 120000)
      .waitForElementNotPresent('.app__loading-error', 5000)
      .waitForElementVisible('.app__loading-message', 60000)
      .waitForElementNotPresent('.app__loading-message', 60000)
      .waitForElementNotPresent('.spinner__overlay', 60000);
    console.log(11, callback);
    if (typeof callback === 'function') {
      callback.call(self);
    }
  });
  return this;
}
