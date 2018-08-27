var page;
var entitySelector;

module.exports = {
  '@disabled': true,
  'Salesforce': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('salesforce', [
        ['USERNAME', 'dumpUsername'],
        ['PASSWORD', 'dumpPassword']
      ], [
        'username'
      ])
      .closeWhenSystemDefcon1()
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};
