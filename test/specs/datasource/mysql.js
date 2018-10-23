var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Mysql': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('mysql', [
        ['LunchBadgerhost', 'dumpHost'],
        ['LunchBadgerport', '8888'],
        ['LunchBadgerdatabase', 'dumpDatabase'],
        ['LunchBadgerusername', 'dumpUsername'],
        ['LunchBadgerpassword', 'dumpPassword']
      ], [
        'LunchBadger\\[host\\]',
        'LunchBadger\\[port\\]',
        'LunchBadger\\[database\\]',
        'LunchBadger\\[username\\]'
      ])
      .waitForEntityError(entitySelector)
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};
