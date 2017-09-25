module.exports = {
  // '@disabled': true,
  'Datasource: memory': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('memory', []);
    page.close();
  }
};
