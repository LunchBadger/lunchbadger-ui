module.exports = {
  // '@disabled': true,
  'Datasource: redis': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('redis', [
      ['HOST', 'dumpHost'],
      ['PORT', '8888'],
      ['DATABASE', 'dumpDatabase'],
      ['USERNAME', 'dumpUsername'],
      ['PASSWORD', 'dumpPassword']
    ]);
    page.close();
  }
};
