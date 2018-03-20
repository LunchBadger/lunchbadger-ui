var page;
var entitySelector;

module.exports = {
  '@disabled': true,
  'Datasource: ethereum': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('ethereum', [
        ['URL', 'dumpUrl']
      ], [
        'url'
      ])
      .closeWhenSystemDefcon1()
      .removeEntity(entitySelector)
      .waitForDependencyFinish()
      .close();
  }
};
