var page;
var entitySelector;

module.exports = {
  '@disabled': true,
  'Datasource: memory': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource()
      .removeEntity(entitySelector)
      .close();
  }
};
