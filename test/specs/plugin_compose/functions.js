var page;
var functionSelector;
var dataSourceSelector;
var modelSelector;
var gatewaySelector;
var apiEndpointFunctionSelector;
var GATEWAY_NAME;

module.exports = {
  // '@disabled': true,
  'Functions: create function': function (browser) {
    page = browser.page.lunchBadger();
    functionSelector = page.getFunctionSelector(1);
    dataSourceSelector = page.getDataSourceSelector(1);
    modelSelector = page.getModelSelector(2);
    gatewaySelector = page.getGatewaySelector(1);
    apiEndpointFunctionSelector = page.getApiEndpointSelector(1);
    GATEWAY_NAME = page.getUniqueName('gateway');
    page
      .open()
      .addElement('function')
      .setCanvasEntityName(functionSelector, 'myfunction')
      .submitCanvasEntity(functionSelector)
      .checkFunctionTriggers(functionSelector, {});
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
      .submitCanvasEntity(dataSourceSelector)
      .connectPorts(dataSourceSelector, 'out', functionSelector, 'in')
      .checkFunctionTriggers(functionSelector, {
        'API Gateway': GATEWAY_NAME,
        Datasource: 'Memory'
      });
  },
  'Functions: model trigger': function () {
    page
      .addElement('model')
      .submitCanvasEntity(modelSelector)
      .connectPorts(modelSelector, 'out', functionSelector, 'out')
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
        'API Gateway': GATEWAY_NAME,
        Datasource: 'Memory',
        Model: 'NewModel'
      })
      .close();
  }
}
