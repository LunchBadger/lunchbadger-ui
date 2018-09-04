var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Mongodb': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('mongodb', [
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
      .waitForEntityError(entitySelector)
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};
