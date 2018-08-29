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
      .clickDemoWizardNext(3)
      .clickDemoWizardHole(3)
      .setCanvasEntityName(modelSelector, 'Car')
      .setField(modelSelector, 'httppath', 'cars')
      .clickDemoWizardHole()
      .setModelPropertyOnCanvas(modelSelector, 0, 'year')
      .clickDemoWizardHole()
      .selectValueOptionSlow(modelSelector, 'properties0type', 'Number')
      .pause(3000)
      .clickDemoWizardHole()
      .connectPorts(memorySelector, 'out', modelSelector, 'in')
      .clickDemoWizardHole(2)
      .waitForEntityDeployed(functionSelector)
      .pause(3000)
      .clickDemoWizardHole()
      .visible('.DetailsPanel.visible .panel .BaseDetails.general', 15000)
      .pause(5000)
      .clickDemoWizardNext()
      .pause(3000)
      .clickDemoWizardHole()
      .pause(3000)
      .clickDemoWizardHole()
      .clickDemoWizardNext()
      .setField(gatewaySelector, 'pipelines0name', 'CarPipeline')
      .clickDemoWizardHole()
      .setField(gatewaySelector, 'pipelines1name', 'FunctionPipeline')
      .clickDemoWizardHole()
      .waitForEntityDeployed(gatewaySelector)
      .clickDemoWizardNext()
      .connectPorts(modelSelector, 'out', gatewaySelector, 'in', 0)
      .pause(3000)
      .clickDemoWizardNext()
      .clickDemoWizardHole()
      .setField(carApiEndpointSelector, 'paths0', '/cars*')
      .clickDemoWizardHole()
      .present('.spinner__overlay')
      .autoSave()
      .connectPorts(functionSelector, 'out', gatewaySelector, 'in', 1)
      .pause(3000)
      .clickDemoWizardHole()
      .setField(myfunctionApiEndpointSelector, 'paths0', '/myfunction*')
      .clickDemoWizardHole()
      .displayDrift('block')
      .clickDemoWizardNext(9)
      .present('.joyride-tooltip[data-target=".header__menu__link.SETTINGS_PANEL"]')
      .clickDemoWizardHole() //.clickPresent('@settings')
      .pause(3000)
      .clickDemoWizardNext()
      .clickDemoWizardHole() //.clickPresent('@settings')
      .pause(3000)
      .notPresent('.joyride')
      .notPresent('.Walkthrough')
      .close();
  }
};
