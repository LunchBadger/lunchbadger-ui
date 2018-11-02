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
      .check({value: {[`${entitySelector2} .input__name input`]: 'Memory1'}})
      .setCanvasEntityName(entitySelector2, 'Memory')
      .expectUniqueNameError(entitySelector2, 'A model connector')
      .removeEntityWithoutAutoSave(entitySelector)
      .close();
  }
};
