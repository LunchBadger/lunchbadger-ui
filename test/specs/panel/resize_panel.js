var page;
var panelHeight = 0;

module.exports = {
  '@disabled': true,
  'Panel: resize': function (browser) {
    page = browser.page.lunchBadger();
    page
      .open()
      .clickPresent('@settings')
      .pause(3000)
      .getElementSize('@settingsPanel', function (result) {
        panelHeight = result.value.height;
        page
          .check({
            notEqual: [
              [panelHeight, 0]
            ]
          });
        return page;
      })
      .moveElement('.panel:last-child > div:last-child > div', 'body')
      .getElementSize('@settingsPanel', function (result) {
        page
          .check({
            notEqual: [
              [result.value.height, panelHeight]
            ]
          });
        panelHeight = result.value.height;
        return page;
      })
      .clickPresent('@settings')
      .pause(3000)
      .getElementSize('@settingsPanel', function (result) {
        page
          .check({
            equal: [
              [result.value.height, 0]
            ]
          });
        return page;
      })
      .clickPresent('@settings')
      .pause(3000)
      .getElementSize('@settingsPanel', function (result) {
        page
          .check({
            equal: [
              [result.value.height, panelHeight]
            ]
          });
        return page;
      })
      .clickPresent('@settings')
      .close();
  }
};
