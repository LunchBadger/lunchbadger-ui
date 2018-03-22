var page;
var entitySelector;
var entitySelector2;

module.exports = {
  // '@disabled': true,
  'Memory': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    entitySelector2 = page.getDataSourceSelector(2);
    page
      .open()
      .testDatasource();
  },
  'Memory: unique name check': function () {
    page
      .addElementFromTooltip('dataSource', 'memory')
      .expectUniqueNameError(entitySelector2, 'A data source')
      .removeEntity(entitySelector)
      .close();
  }
};
