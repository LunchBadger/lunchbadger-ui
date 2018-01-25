module.exports = {
  // '@disabled': true,
  'Datasource: salesforce': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('salesforce', [
      'username',
    ], [
      ['USERNAME', 'dumpUsername'],
      ['PASSWORD', 'dumpPassword']
    ]);
    page.close();
  }
};
