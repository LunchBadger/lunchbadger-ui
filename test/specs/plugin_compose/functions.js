var page;
var functionSelector;
var functionSelector2;
var dataSourceSelector;
var modelSelector;
var gatewaySelector;
var apiEndpointFunctionSelector;
var GATEWAY_NAME;
var filesEditorHeight = 0;
var filesEditorSelector = '.DetailsPanel .FilesEditor';

module.exports = {
  // '@disabled': true,
  'Functions: create function': function (browser) {
    page = browser.page.lunchBadger();
    functionSelector = page.getFunctionSelector(1);
    functionSelector2 = page.getFunctionSelector(2);
    dataSourceSelector = page.getDataSourceSelector(1);
    modelSelector = page.getModelSelector(2);
    gatewaySelector = page.getGatewaySelector(1);
    apiEndpointFunctionSelector = page.getApiEndpointSelector(1);
    GATEWAY_NAME = page.getUniqueName('gateway');
    page
      .open()
      .addElement('function')
      .submitFunctionDeploy(functionSelector, 'myfunction')
      .checkFunctionTriggers(functionSelector, {});
  },
  // 'Functions: code editor resize': function () { // FIXME enable after #557 will be fixed
  //   page
  //     .openEntityInDetailsPanel(functionSelector)
  //     .getElementSize(filesEditorSelector, function (result) {
  //       filesEditorHeight = result.value.height;
  //       page.check({
  //         equal: [[filesEditorHeight, 200]]
  //       });
  //       return page;
  //     })
  //     .resizeFilesEditor([0, 100], 40)
  //     .getElementSize(filesEditorSelector, function (result) {
  //       filesEditorHeight = result.value.height;
  //       page.check({
  //         equal: [[filesEditorHeight, 3000]]
  //       });
  //       return page;
  //     })
  //     .resizeFilesEditor([0, -100], 40)
  //     .getElementSize(filesEditorSelector, function (result) {
  //       filesEditorHeight = result.value.height;
  //       page.check({
  //         equal: [[filesEditorHeight, 100]]
  //       });
  //       return page;
  //     })
  //     .closeDetailsPanel();
  // },
  'Functions: unique name': function () {
    page
      .addElement('function')
      .check({value: {[`${functionSelector2} .input__name input`]: 'myfunction1'}})
      .setCanvasEntityName(functionSelector2, 'myfunction')
      .expectUniqueNameError(functionSelector2, 'A function');
  },
  'Functions: api gateway trigger': function () {
    page
      .addGatewayWithProxy(gatewaySelector, GATEWAY_NAME)
      .connectPorts(functionSelector, 'out', gatewaySelector, 'in', 0)
      .submitCanvasEntity(apiEndpointFunctionSelector)
      .checkFunctionTriggers(functionSelector, {
        'API Gateway': GATEWAY_NAME
      });
  },
  'Functions: datasource trigger': function () {
    page
      .addElementFromTooltip('dataSource', 'memory')
      .submitCanvasEntityWithoutAutoSave(dataSourceSelector)
      .connectPortsWithoutAutoSave(dataSourceSelector, 'out', functionSelector, 'in')
      .checkFunctionTriggers(functionSelector, {
        'API Gateway': GATEWAY_NAME,
        Datasource: 'Memory'
      });
  },
  'Functions: model trigger': function () {
    page
      .addElement('model')
      .submitCanvasEntityWithoutAutoSave(modelSelector)
      .connectPortsWithoutAutoSave(modelSelector, 'out', functionSelector, 'out')
      .checkFunctionTriggers(functionSelector, {
        'API Gateway': GATEWAY_NAME,
        Datasource: 'Memory',
        Model: 'NewModel'
      });
  },
  'Functions: remove gateway': function () {
    page
      .removeGateway(gatewaySelector)
      .checkFunctionTriggers(functionSelector, {
        Datasource: 'Memory',
        Model: 'NewModel'
      });
  },
  'Functions: remove function': function () {
    page
      .removeFunction(functionSelector)
      .close();
  }
}
