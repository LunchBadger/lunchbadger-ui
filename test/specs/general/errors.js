var page;
var dataSourceSelector;
module.exports = {
  // '@disabled': true,
  'Errors: reset workspace status': function (browser) {
    page = browser.page.lunchBadger();
    dataSourceSelector = page.getDataSourceSelector(1);
    page
      .open()
      .addElementFromTooltip('dataSource', 'soap')
      .setInput(dataSourceSelector, 'url', 'http://abc.com')
      .submitCanvasEntityWithoutAutoSave(dataSourceSelector)
      .closeWhenSystemDefcon1()
      .check({present: ['.workspace-status__failure']})
      .removeEntityWithoutAutoSave(dataSourceSelector)
      .waitForDependencyFinish()
      .check({present: ['.workspace-status__success']})
      .close();
  }
};
