var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Datasource: ethereum': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('ethereum', [
        ['URL', 'dumpUrl']
      ])
      .closeWhenSystemDefcon1()
      .removeEntity(entitySelector)
      .waitForDependencyFinish()
      .close();
  }
};
