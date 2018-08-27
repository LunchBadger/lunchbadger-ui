var page;
var entitySelector;

module.exports = {
  '@disabled': true,
  'Redis': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('redis', [
        ['HOST', 'dumpHost'],
        ['PORT', '8888'],
        ['NAMESPACE', 'dumpNamespace'],
        ['USERNAME', 'dumpUsername'],
        ['PASSWORD', 'dumpPassword']
      ], [
        'host',
        'port',
        'database',
        'username'
      ])
      .closeWhenSystemDefcon1()
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};
