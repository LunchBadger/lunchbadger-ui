module.exports = {
  '@disabled': true,
  'Datasource: salesforce': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('salesforce', [
      ['USERNAME', 'dumpUsername'],
      ['PASSWORD', 'dumpPassword']
    ]);
    page.close();
  }
};
