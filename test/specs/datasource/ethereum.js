module.exports = {
  // '@disabled': true,
  'Datasource: ethereum': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('ethereum', [
      ['URL', 'dumpUrl']
    ], function () {
      page.closeWhenSystemDefcon1();
      page.removeEntity(page.getDataSourceSelector(1));
      page.waitForUninstallDependency();
      page.close();
    });
  }
};
