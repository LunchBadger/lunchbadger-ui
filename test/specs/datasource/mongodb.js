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
