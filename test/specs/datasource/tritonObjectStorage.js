module.exports = {
  // '@disabled': true,
  'Datasource: tritonobjectstorage': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('tritonobjectstorage', [
      'url',
      'user',
      'keyId',
    ], [
      ['URL', 'http://test.com'],
      ['USER', 'dumpUser'],
      ['SUBUSER', 'dumpSubUser'],
      ['KEY ID', 'dumpKeyId']
    ]);
    page.close();
  }
};
