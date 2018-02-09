exports.command = function (selector, callback) {
  const self = this;
  this
    .waitForElementNotPresent('.DetailsPanel .BaseDetails__buttons .submit.disabled', 5000)
    .waitForElementPresent('.DetailsPanel .BaseDetails__buttons .submit', 5000)
    .click('.DetailsPanel .BaseDetails__buttons .submit', function () {
      self
        .waitForElementPresent(selector + '.wip', 5000)
        .waitForElementPresent('.DetailsPanel.closing', 5000)
        .waitForElementNotPresent('.DetailsPanel.closing', 15000)
        .waitForElementNotPresent(selector + '.wip', 60000);
      console.log(33, selector, typeof callback);
      if (typeof callback === 'function') {
        callback.call(self);
      }
    });
  return this;
}
