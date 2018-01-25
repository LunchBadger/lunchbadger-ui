module.exports = {
  // '@disabled': true,
  'Datasource: redis': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('redis', [
      'host',
      'port',
      'database',
      'username',
    ], [
      ['HOST', 'dumpHost'],
      ['PORT', '8888'],
      ['NAMESPACE', 'dumpNamespace'],
      ['USERNAME', 'dumpUsername'],
      ['PASSWORD', 'dumpPassword']
    ]);
    page.close();
  }
};
