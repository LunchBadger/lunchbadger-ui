var page;
var memorySelector;
var modelSelector;
var functionSelector;
var gatewaySelector;
var carApiEndpointSelector;
var myfunctionApiEndpointSelector;
module.exports = {
  // '@disabled': true,
  'Walkthrough: demo wizard process': function(browser) {
    page = browser.page.lunchBadger();
    memorySelector = page.getDataSourceSelector(1);
    modelSelector = page.getModelSelector(1);
    functionSelector = page.getFunctionSelector(2);
    gatewaySelector = page.getGatewaySelector(1);
    carApiEndpointSelector = page.getApiEndpointSelector(1);
    myfunctionApiEndpointSelector = page.getApiEndpointSelector(2);
    page
      .openWithDemoWizard()
      .hideCookieConfirmation()
      .hideDrift()
      .expectDemoWizardTitle('Navigating the Entity Palette')
      .clickDemoWizardNext() // aside menu
      .expectDemoWizardTitle('Model Connectors Menu')
      .clickDemoWizardHole() // datasources open list
      .expectDemoWizardTitle('Model Connector Entities Overview')
      .clickDemoWizardNext() // info
      .expectDemoWizardTitle('Memory Model Connector Selection')
      .clickDemoWizardHoleWithEntityFlipping(20, 20, '.CanvasElement.DataSource') // memory option
      .expectDemoWizardTitle('Memory Model Connector Creation')
      // .clickDemoWizardHole(5000, 5000)
      .pause(5000)
      .submitCanvasEntityWithoutAutoSave(memorySelector) // memory ok submit
      // .check({present:['.Entity.DataSource.memory:not(.wip)']})
      .expectDemoWizardTitle('Model Entities Overview')
      .clickDemoWizardHole(5000, 5000) // model menu
      .expectDemoWizardTitle('Name the Model Entity')
      .setCanvasEntityName(modelSelector, 'Car')
      .expectDemoWizardTitle('Model Entity Context Path')
      .clickDemoWizardNext()
      .expectDemoWizardTitle('Model Properties Overview')
      .clickDemoWizardHole(5000, 5000)
      .expectDemoWizardTitle('Add a Property')
      .setModelPropertyOnCanvas(modelSelector, 0, 'year')
      .clickDemoWizardHole()
      .selectValueOptionSlow(modelSelector, 'properties0type', 'Number')
      .pause(3000)
      .submitCanvasEntityWithoutAutoSave(modelSelector)
      // .waitForEntityDeployed(modelSelector)
      // .autoSave()
      .pause(3000)
      .clickDemoWizardNext()
      .clickDemoWizardHole()
      .clickDemoWizardNext(7000)
      .clickDemoWizardNext(7000)
      .clickDemoWizardHole(10, 7000)
      .connectPortsWithoutAutoSave(memorySelector, 'out', modelSelector, 'in')
      .clickDemoWizardHole()
      .clickDemoWizardHole(5000)
      .waitForEntityDeployedWithMessage(functionSelector, 'myfunction')
      .clickDemoWizardHole(3000, 7000)
      .visible('.DetailsPanel.visible .panel .BaseDetails.general', 15000)
      .pause(7000)
      .visible('.DetailsPanel .cancel')
      .visible('.DetailsPanel .FilesEditor')
      .visible('.joyride-tooltip[data-target=".DetailsPanel .FilesEditor"]')
      .pause(7000)
      .clickDemoWizardNext()
      .notPresent('.joyride-tooltip[data-target=".DetailsPanel .FilesEditor"]')
      .pause(7000)
      .visible('.joyride-tooltip[data-target=".DetailsPanel .cancel"]')
      .clickDemoWizardHole(3000, 3000)
      .clickDemoWizardHole()
      .clickDemoWizardNext()
      .setField(gatewaySelector, 'pipelines0name', 'CarPipeline')
      .clickDemoWizardHole(3000, 3000)
      .setField(gatewaySelector, 'pipelines1name', 'FunctionPipeline')
      .clickDemoWizardHole(3000)
      .waitForEntityDeployedWithMessage(gatewaySelector, 'Gateway')
      .pause(1000)
      .clickDemoWizardNext()
      .pause(3000)
      .connectPorts(modelSelector, 'out', gatewaySelector, 'in', 0)
      .pause(7000)
      .clickDemoWizardNext()
      .submitCanvasEntity(carApiEndpointSelector)
      .pause(7000)
      .connectPorts(functionSelector, 'out', gatewaySelector, 'in', 1)
      .pause(7000)
      .submitCanvasEntity(myfunctionApiEndpointSelector)
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .showDrift()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .present('.joyride-tooltip[data-target=".header__menu__link.SETTINGS_PANEL"]')
      .clickDemoWizardHole(3000, 7000)
      .clickDemoWizardNext()
      .clickDemoWizardHole(10, 7000)
      .notPresent('.joyride')
      .notPresent('.Walkthrough')
      .close();
  }
};
