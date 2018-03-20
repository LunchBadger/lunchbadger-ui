var page;
var dataSourceSelector1;
var dataSourceSelector2;
var dataSourceSelector3;

module.exports = {
  '@disabled': true,
  'Dependency installation: status success': function(browser) {
    page = browser.page.lunchBadger();
    dataSourceSelector1 = page.getDataSourceSelector(1);
    dataSourceSelector2 = page.getDataSourceSelector(2);
    dataSourceSelector3 = page.getDataSourceSelector(3);
    page
      .open()
      .addElementFromTooltip('dataSource', 'rest')
      .setField(dataSourceSelector1, 'operations0templateurl', 'http://dumpUrl')
      .submitCanvasEntity(dataSourceSelector1)
      .expectWorkspaceStatus('success');
  },
  'Dependency installation: status failures': function() {
    page
      .addElementFromTooltip('dataSource', 'soap')
      .setField(dataSourceSelector2, 'url', 'https://www.lunchbadger.com')
      .submitCanvasEntity(dataSourceSelector2)
      .expectWorkspaceFailure('WSDL')
      .clickPresent('.SystemDefcon1 button')
      .notPresent('.SystemDefcon1', 5000)
      .addElementFromTooltip('dataSource', 'mongodb')
      .setField(dataSourceSelector3, 'host', 'dumpUrl')
      .setField(dataSourceSelector3, 'port', '9999')
      .setField(dataSourceSelector3, 'database', 'dumpDatabase')
      .setField(dataSourceSelector3, 'username', 'dumpUsername')
      .setField(dataSourceSelector3, 'password', 'dumpPassword', 'password')
      .submitCanvasEntity(dataSourceSelector3)
      .expectWorkspaceFailure('ENOTFOUND')
      .closeWhenSystemDefcon1()
      .notPresent('.SystemDefcon1', 5000);
  },
  'Dependency installation: status failure': function() {
    page
      .removeEntity(dataSourceSelector3)
      .expectWorkspaceFailure('WSDL')
      .closeWhenSystemDefcon1();
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
