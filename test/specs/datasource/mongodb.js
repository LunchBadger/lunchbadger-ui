var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Datasource: mongodb': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('mongodb', [
        ['HOST', 'dumpHost'],
        ['PORT', '8888'],
        ['COLLECTION', 'dumpCollection'],
        ['USERNAME', 'dumpUsername'],
        ['PASSWORD', 'dumpPassword']
      ])
      .closeWhenSystemDefcon1()
      .removeEntity(entitySelector)
      .waitForDependencyFinish()
      .close();
  }
};
