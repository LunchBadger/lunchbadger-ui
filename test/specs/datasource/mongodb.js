module.exports = {
  // '@disabled': true,
  'Datasource: mongodb': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('mongodb', [
      ['HOST', 'dumpHost'],
      ['PORT', '8888'],
      ['DATABASE', 'dumpDatabase'],
      ['USERNAME', 'dumpUsername'],
      ['PASSWORD', 'dumpPassword']
    ]);
    page.close();
  }
};
