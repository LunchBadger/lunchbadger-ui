module.exports = {
  // '@disabled': true,
  'Datasource: ethereum': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('ethereum', [
      ['URL', 'dumpUrl']
    ]);
    page.close();
  }
};
