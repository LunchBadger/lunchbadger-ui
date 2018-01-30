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
    ], function () {
      page.waitForElementPresent('.SystemDefcon1 button', 120000);
      page.clickSlow('.SystemDefcon1 button');
      page.removeEntity(page.getDataSourceSelector(1));
      page.close();
    });
  }
};
