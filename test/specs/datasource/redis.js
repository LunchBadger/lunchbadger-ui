var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Redis': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('redis', [
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
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};
