module.exports = {
  // '@disabled': true,
  'Panel: open/close': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.click('@settings');
    browser.pause(2000);
    page.getElementSize('@settingsPanel', function(result) {
      page.assert.notEqual(result.value.height, 0);
    });
    page.click('@settings');
    browser.pause(2000);
    page.getElementSize('@settingsPanel', function(result) {
      page.assert.equal(result.value.height, 0);
    });
    page.close();
  }
};
