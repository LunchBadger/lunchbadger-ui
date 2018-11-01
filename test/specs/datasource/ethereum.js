var page;
var entitySelector;

module.exports = {
  '@disabled': true,
  'Ethereum': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('ethereum', [
        ['LunchBadgerurl', 'dumpUrl']
      ], [
        'LunchBadger\\[url\\]'
      ])
      .waitForEntityError(entitySelector)
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};
