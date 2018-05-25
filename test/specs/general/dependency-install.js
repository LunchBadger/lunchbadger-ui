var page;
var dataSourceSelector1;
var dataSourceSelector2;

module.exports = {
  '@disabled': true, // FIXME: enable when sopa will be fixed on server side
  'Dependency installation: initial status success': function(browser) {
    page = browser.page.lunchBadger();
    dataSourceSelector1 = page.getDataSourceSelector(1);
    dataSourceSelector2 = page.getDataSourceSelector(2);
    page
      .open()
      .addElementFromTooltip('dataSource', 'rest')
      .setField(dataSourceSelector1, 'operations0templateurl', 'http://dumpUrl')
      .submitCanvasEntity(dataSourceSelector1)
      .expectWorkspaceStatus('success');
  },
  'Dependency installation: status failure': function() {
    page
      .addElementFromTooltip('dataSource', 'soap')
      .setField(dataSourceSelector2, 'url', 'https://www.lunchbadger.com')
      .submitCanvasEntityWithoutAutoSave(dataSourceSelector2)
      .expectWorkspaceFailure('WSDL')
      .clickPresent('.SystemDefcon1 button')
      .notPresent('.SystemDefcon1', 5000);
  },
  'Dependency installation: status success again': function() {
    page
      .removeEntity(dataSourceSelector2)
      .expectWorkspaceStatus('success');
  },
  'Dependency installation: status success after clear project': function() {
    page
      .clearProject()
      .present('.workspace-status .workspace-status__progress', 120000)
      .notPresent('.spinner__overlay', 60000)
      .notPresent('.workspace-status .workspace-status__progress', 120000)
      .reloadPage()
      .present('.workspace-status .workspace-status__success', 120000)
      .close();
  }
}
