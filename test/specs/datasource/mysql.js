module.exports = {
  // '@disabled': true,
  'Datasource: mysql': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('mysql', [
      ['HOST', 'dumpHost'],
      ['PORT', '8888'],
      ['DATABASE', 'dumpDatabase'],
      ['USERNAME', 'dumpUsername'],
      ['PASSWORD', 'dumpPassword']
    ]);
    page.close();
  }
};
