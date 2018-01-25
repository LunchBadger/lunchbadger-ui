module.exports = {
  // '@disabled': true,
  'Datasource: postgresql': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('postgresql', [
      'host',
      'port',
      'database',
      'username',
    ], [
      ['HOST', 'dumpHost'],
      ['PORT', '8888'],
      ['DATABASE', 'dumpDatabase'],
      ['USERNAME', 'dumpUsername'],
      ['PASSWORD', 'dumpPassword']
    ]);
    page.close();
  }
};
