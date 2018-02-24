var page;
var dataSourceSelector1;
var dataSourceSelector2;
var modelSelector1;
var modelSelector2;
var functionSelector1;
var functionSelector2;
var microserviceSelector1;
var microserviceSelector2;
var seSelector1;
var seSelector2;
var aeSelector1;
var aeSelector2;
var gatewaySelector1;
var gatewaySelector2;

module.exports = {
  // '@disabled': true,
  'Unique entities names: gateways': function (browser) {
    page = browser.page.lunchBadger();
    dataSourceSelector1 = page.getDataSourceSelector(1);
    dataSourceSelector2 = page.getDataSourceSelector(2);
    modelSelector1 = page.getModelSelector(1);
    modelSelector2 = page.getModelSelector(2);
    functionSelector1 = page.getFunctionSelector(2);
    functionSelector2 = page.getFunctionSelector(3);
    microserviceSelector1 = page.getMicroserviceSelector(3);
    microserviceSelector2 = page.getMicroserviceSelector(4);
    seSelector1 = page.getServiceEndpointSelector(4);
    seSelector2 = page.getServiceEndpointSelector(5);
    gatewaySelector1 = page.getGatewaySelector(1);
    gatewaySelector2 = page.getGatewaySelector(2);
    aeSelector1 = page.getApiEndpointSelector(1);
    aeSelector2 = page.getApiEndpointSelector(2);
    page
      .open()
      .addElement('gateway')
      .submitGatewayDeploy(gatewaySelector1, 'Gateway')
      .addElement('gateway')
      .expectUniqueNameError(gatewaySelector2, 'A gateway')
      .emptyProject();
  },
  'Unique entities names: datasources': function () {
    page
      .addElementFromTooltip('dataSource', 'memory')
      .submitCanvasEntity(dataSourceSelector1)
      .addElementFromTooltip('dataSource', 'memory')
      .expectUniqueNameError(dataSourceSelector2, 'A data source');
  },
  'Unique entities names: models': function () {
    page
      .addElement('model')
      .submitCanvasEntity(modelSelector1)
      .addElement('model')
      .expectUniqueNameError(modelSelector2, 'A model');
  },
  'Unique entities names: functions': function () {
    page
      .addElement('function')
      .submitCanvasEntity(functionSelector1)
      .addElement('function')
      .expectUniqueNameError(functionSelector2, 'A function');
  },
  'Unique entities names: microservices': function () {
    page
      .addElement('microservice')
      .submitCanvasEntity(microserviceSelector1)
      .addElement('microservice')
      .expectUniqueNameError(microserviceSelector2, 'A microservice');
  },
  'Unique entities names: service endpoints': function () {
    page
      .addElementFromTooltip('endpoint', 'serviceendpoint')
      .submitCanvasEntity(seSelector1)
      .addElementFromTooltip('endpoint', 'serviceendpoint')
      .expectUniqueNameError(seSelector2, 'A service endpoint');
  },
  'Unique entities names: api endpoints': function () {
    page
      .addElementFromTooltip('endpoint', 'apiendpoint')
      .submitCanvasEntity(aeSelector1)
      .addElementFromTooltip('endpoint', 'apiendpoint')
      .expectUniqueNameError(aeSelector2, 'An api endpoint')
      .close();
  }
};
