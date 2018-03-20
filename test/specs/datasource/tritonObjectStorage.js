var page;
var entitySelector;

module.exports = {
  '@disabled': true,
  'Datasource: tritonobjectstorage': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('tritonobjectstorage', [
        ['URL', 'http://test.com'],
        ['USER', 'dumpUser'],
        ['SUBUSER', 'dumpSubUser'],
        ['KEY ID', 'dumpKeyId']
      ], [
        'url',
        'user',
        'keyId'
      ])
      .removeEntity(entitySelector)
      .waitForDependencyFinish()
      .close();
  }
};
