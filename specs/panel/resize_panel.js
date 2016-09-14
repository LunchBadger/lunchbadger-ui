module.exports = {
  // '@disabled': true,
  'Panel: resize': function (browser) {
    var page = browser.page.lunchBadger();
    var panelHeight = 0;

    page.open();

    page.click('@forecaster');
    browser.pause(2000);

    page.getElementSize('@forecasterPanel', function (result) {
      page.assert.notEqual(result.value.height, 0);
      panelHeight = result.value.height;
    });

    browser
      .pause(500)
      .useCss()
      .moveToElement('.panel:last-child > div:last-child > div', 0, 0)
      .mouseButtonDown(0)
      .moveToElement('body', 0, 150)
      .mouseButtonUp(0)
      .pause(500);

    page.getElementSize('@forecasterPanel', function (result) {
      page.assert.notEqual(result.value.height, panelHeight);
      panelHeight = result.value.height;
    });

    page.click('@forecaster');
    browser.pause(2000);

    page.getElementSize('@forecasterPanel', function (result) {
      page.assert.equal(result.value.height, 0);
    });

    page.click('@forecaster');
    browser.pause(2000);

    page.getElementSize('@forecasterPanel', function (result) {
      page.assert.equal(result.value.height, panelHeight);
    });

    page.click('@forecaster');
    browser.pause(2000);

    page.close();
  }
};
