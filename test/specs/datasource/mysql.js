var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Datasource: mysql': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('mysql', [
        ['HOST', 'dumpHost'],
        ['PORT', '8888'],
        ['DATABASE', 'dumpDatabase'],
        ['USERNAME', 'dumpUsername'],
        ['PASSWORD', 'dumpPassword']
      ])
      .closeWhenSystemDefcon1()
      .removeEntity(entitySelector)
      .waitForDependencyFinish()
      .close();
  }
};
