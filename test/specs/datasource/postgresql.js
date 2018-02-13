var page;
var entitySelector;

module.exports = {
  '@disabled': true,
  'Datasource: postgresql': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('postgresql', [
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
      .closeWhenSystemDefcon1()
      .removeEntity(entitySelector)
      .waitForDependencyFinish()
      .close();
  }
};
