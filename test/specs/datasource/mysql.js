var page;
var entitySelector;
var entitySelector2;

module.exports = {
  // '@disabled': true,
  'Mysql': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    entitySelector2 = page.getDataSourceSelector(2);
    page
      .open()
      .testDatasource('mysql', [
        ['HOST', 'dumpHost'],
        ['PORT', '8888'],
        ['DATABASE', 'dumpDatabase'],
        ['USERNAME', 'dumpUsername'],
        ['PASSWORD', 'dumpPassword']
      ], [
        'host',
        'port',
        'database',
        'username'
      ])
      .closeWhenSystemDefcon1();
  },
  'Mysql: unique name check': function () {
    page
      .addElementFromTooltip('dataSource', 'memory')
      .setCanvasEntityName(entitySelector2, 'mysql')
      .expectUniqueNameError(entitySelector2, 'A data source')
      .removeEntity(entitySelector)
      .waitForDependencyFinish()
      .close();
  }
};
