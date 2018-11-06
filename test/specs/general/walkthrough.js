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
      .saveScreenshot('demowizard')
      .hideCookieConfirmation()
      .hideDrift()
      .unblockWalkthroughOverlay()
      .expectDemoWizardTitle('Navigating the Entity Palette')
      .clickDemoWizardNext('Navigating the Entity Palette') // aside menu
      .expectDemoWizardTitle('Model Connectors Menu')
      .clickDemoWizardHole('Model Connectors Menu') // datasources open list
      .expectDemoWizardTitle('Model Connector Entities Overview')
      .clickDemoWizardNext('Model Connector Entities Overview') // info
      .expectDemoWizardTitle('Memory Model Connector Selection')
      .clickDemoWizardHoleWithEntityFlipping('.CanvasElement.DataSource') // memory option
      .expectDemoWizardTitle('Memory Model Connector Creation')
      .clickDemoWizardHole('Memory Model Connector Creation')
      // .pause(5000)
      // .submitCanvasEntityWithoutAutoSave(memorySelector) // memory ok submit
      // .check({present:['.Entity.DataSource.memory:not(.wip)']})
      .expectDemoWizardTitle('Model Entities Overview')
      .clickDemoWizardHole('Model Entities Overview') // model menu
      .expectDemoWizardTitle('Name the Model Entity')
      .setCanvasEntityName(modelSelector, 'Car')
      .expectDemoWizardTitle('Model Entity Context Path')
      .clickDemoWizardNext('Model Entity Context Path')
      .expectDemoWizardTitle('Model Properties Overview')
      .clickDemoWizardHole('Model Properties Overview')
      .expectDemoWizardTitle('Add a Property')
      .setModelPropertyOnCanvas(modelSelector, 0, 'year')
      .clickDemoWizardHole('Add a Property')
      .selectValueOptionSlow(modelSelector, 'properties0type', 'Number')
      .pause(3000)
      .submitCanvasEntityWithoutAutoSave(modelSelector)
      // .waitForEntityDeployed(modelSelector)
      // .autoSave()
      .pause(3000)
      .clickDemoWizardNext()
      .clickDemoWizardHole()
      .clickDemoWizardNext()
      .clickDemoWizardNext()
      .clickDemoWizardHole()
      .connectPortsWithoutAutoSave(memorySelector, 'out', modelSelector, 'in')
      .clickDemoWizardHole()
      .clickDemoWizardHole()
      .waitForEntityDeployedWithMessage(functionSelector, 'myfunction')
      .clickDemoWizardHole()
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
      .clickDemoWizardHole()
      .clickDemoWizardHole()
      .clickDemoWizardNext()
      .setField(gatewaySelector, 'pipelines0name', 'CarPipeline')
      .clickDemoWizardHole()
      .setField(gatewaySelector, 'pipelines1name', 'FunctionPipeline')
      .clickDemoWizardHole()
      .waitForEntityDeployedWithMessage(gatewaySelector, 'Gateway')
      .clickDemoWizardNext()
      .connectPorts(modelSelector, 'out', gatewaySelector, 'in', 0)
      .clickDemoWizardNext()
      .submitCanvasEntity(carApiEndpointSelector)
      .connectPorts(functionSelector, 'out', gatewaySelector, 'in', 1)
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
      .clickDemoWizardHole()
      .clickDemoWizardNext()
      .clickDemoWizardHole()
      .notPresent('.joyride')
      .notPresent('.Walkthrough')
      .close();
  }
};
