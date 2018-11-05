export default {
  '010': {
    title: 'Model Connectors Menu',
    text: `
No need to start from scratch when building microservices. Leverage your existing data and services with pre-built microservice integrations such as MySQL, MongoDB, SOAP, REST, and 42+ other Model Connectors.
<br />
<br />
C'mon, click it!
`,
    selector: '.Tool.dataSource',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('div[role=presentation]', false),
      api.setShowOverlay(false),
    ],
    onBefore: api => [
      api.focus('.Tool.dataSource .Tool__box button'),
    ],
  },
  '011': {
    title: 'Model Connector Entities Overview',
    text: `
Each Model Connector Entity will come with its own set of properties specific for that connection type. A subset of available Model Connectors are available in the menu.
`,
    waitForSelector: 'div[role=presentation]',
    position: 'right',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: api => [
      api.wait(500),
      api.setShowOverlay(true),
      api.blockClicks(),
    ],
    onAfter: api => [
      api.unblockClicks(),
    ],
  },
  '012': {
    title: 'Memory Model Connector Selection',
    text: `
Let's get started! Select the Memory Model Connector.
<br />
<br />
C'mon, click it!
`,
    waitForSelector: '.Tool__submenuItem.memory',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.CanvasElement.DataSource.flipping .Entity.DataSource.memory', false),
      api.delayOverlay(500),
      api.waitUntilPresent('.CanvasElement.DataSource:not(.flipping) .Entity.DataSource.memory', false),
    ],
    onBefore: api => [
      api.blockClicks(),
      api.focus('.Tool__submenuItem.memory'),
    ],
    onAfter: api => [
      api.unblockClicks(),
    ],
  },
  '013': {
    title: 'Memory Model Connector Creation',
    text: `
Most Model Connector Entities will present configuration options for connecting to your data source or service, such as host, port, username, and password. We don't need these with the Memory Model Connector.
<br />
<br />
Click <pre>OK</pre> to continue.
`,
    waitForSelector: '.Entity.DataSource.memory.editable .submit',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.DataSource.memory.editable'),
    ],
    onBefore: api => [
      api.focus('.Entity.DataSource.editable .submit'),
    ],
  },
  '020': {
    title: 'Model Entities Overview',
    text: `
Models are Node.js functions with built in features such as CRUD (through Model Connectors), object properties, auto REST dynamic scaffolding, and other features that developers commonly need and use.
<br />
<br />
C'mon, click it!
`,
    selector: '.Tool.model',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.CanvasElement.Model.flipping .Entity.Model', false),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.waitUntilPresent('.CanvasElement.Model:not(.flipping) .Entity.Model', false),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.focus('.Tool.model button'),
    ],
  },
  '021': {
    title: 'Name the Model Entity',
    text: `
Here, you define the name of the Model Entity.
<br /><br />
Let's name it <pre>Car</pre>.
`,
    selector: '.Entity.Model.editable .EntityHeader',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .EntityHeader input[value="Car"]'),
      api.blur('.Entity.Model.editable .EntityHeader input'),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .EntityHeader input'),
    ],
  },
  '022': {
    title: 'Model Entity Context Path',
    text: `
The Context Path assigns a URL path for the Model Entity's built in RESTFul endpoint.
`,
    selector: '.Entity.Model.editable .EntityProperties .EntityProperty',
    position: 'right',
    allowClicksThruHole: false,
    skipLastStep: true,
  },
  '023': {
    title: 'Model Properties Overview',
    text: `
Select the plus icon to assign properties to the Model Entity. Properties map to fields to a data source connected through a Model Connector.
<br /><br />
C'mon, click it!
`,
    selector: '.Entity.Model.editable .button__add__Properties',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .input__properties0name', false),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .button__add__Properties'),
    ],
  },
  '024': {
    title: 'Add a Property',
    text: `
Let's set <pre>year</pre> as the property name.
`,
    selector: '.Entity.Model.editable .input__properties0name',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .input__properties0name input[value="year"]'),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .input__properties0name input'),
    ],
  },
  '025': {
    title: 'Set the Property Type',
    text: `
Let's set the Property type.
<br /><br />
Select <pre>Number</pre> from the dropdown list.
`,
    selector: '.Entity.Model.editable .select__properties0type',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    onBefore: api => [
      api.setOverlayBack(true),
      api.focus('.Entity.Model.editable .select__properties0type button'),
    ],
    onAfter: api => [
      api.setOverlayBack(false),
    ],
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .properties0type__Number'),
      api.wait(500),
      api.focus('.Entity.Model.editable .input__properties0name input'),
      api.blur('.Entity.Model.editable .input__properties0name input'),
    ],
  },
  '026': {
    title: 'Finish Creating the Model',
    text: `
Click <pre>OK</pre> to create the <pre>Car</pre> Model Entity.
`,
    selector: '.Entity.Model.editable .submit',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.Model.editable'),
      api.setShowOverlay(false),
    ],
    onBefore: api => [
      api.focus('.Entity.Model.editable .submit'),
    ],
  },
  '0270': {
    title: 'Model is creating',
    text: `
Please wait till the <pre>Car</pre> is saved and the walkthrough will continue automatically.
`,
    position: 'right',
    selector: '.Entity.Model',
    allowClicksThruHole: false,
    triggerNext: api => [
      api.setWaitMethod('waitBySetTimeout'),
      api.waitUntilNotPresent('.CanvasElement.Model.wip'),
      api.setWaitMethod(),
    ],
    onBefore: api => [
      api.click('.Entity.Model'),
      api.wait(1000),
      api.setShowOverlay(true),
    ],
  },
  '0271': {
    title: 'Quick Edit',
    text: `
This icon allows you to quick edit an Entity on the Canvas. Quick edit exposes only the bare minimum required properties to fill in.
<br />
<br />
Keep in mind, it applies also to almost all other Entities.
`,
    selector: '.Entity.Model .Toolbox__button--edit',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: api => [
      api.delayOverlay(500),
      api.click('.Entity.Model'),
      api.waitUntilPresent('.Entity.Model.highlighted .Toolbox__button--edit'),
    ],
  },
  '0272': {
    title: 'Full Edit',
    text: `
This icon opens up the Model details for full edit. Full edit zooms in on an Entity to allow you to access advanced details and features beyond the bare minimum required fields displayed in the Canvas.
<br />
<br />
C'mon, click it!
`,
    selector: '.Entity.Model .Toolbox__button--zoom',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel.visible .RnD__content', false),
      api.delayOverlay(3000),
    ],
    onBefore: api => [
      api.delayOverlay(500),
      api.click('.Entity.Model'),
      api.waitUntilPresent('.Entity.Model.highlighted .Toolbox__button--zoom'),
      api.focus('.Entity.Model .Toolbox__button--zoom'),
    ],
  },
  '0273': {
    title: 'Model Details Panel',
    text: `
Use full edit, when you want to add more than what is required in quick edit and get into more detailed information.
<br />
<br />
Keep in mind, that almost all Entities have details that are available in full edit.
`,
    selector: '.RnD__box',
    position: 'top',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: () => [],
  },
  '0274': {
    title: 'Code Editor',
    text: 'All Models are Node.js functions. Custom code for the <pre>Car</pre> model can be entered into the Code Editor.',
    selector: '.DetailsPanel .BaseDetails__content > div > .CollapsibleProperties:last-child',
    position: 'top',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: api => [
      api.autoscroll('.DetailsPanel .BaseDetails__content > div > .CollapsibleProperties:last-child'),
    ],
  },
  '0275': {
    title: 'Return to Canvas from Model Details Panel',
    text: `
Click <pre>Cancel</pre> to return to the Canvas view.
`,
    selector: '.DetailsPanel .cancel',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.focus('.DetailsPanel .cancel'),
      api.waitUntilNotPresent('.DetailsPanel.visible'),
      api.delayOverlay(1500),
    ],
    onBefore: api => [
      api.focus('.DetailsPanel .cancel'),
    ],
  },
  '028': {
    title: 'Connect Model Connector to Model',
    text: `
The <pre>Car</pre> model can now persist data to the built in memory database though the <pre>Memory</pre> Connector.
`,
    selector: '.Entity.DataSource.memory .port__wrap__out',
    position: 'bottom-left',
    allowClicksThruHole: true,
    skipLastStep: false,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.DataSource.memory .port-out .port__anchor--connected'),
      api.togglePortWrapper('.Entity.DataSource.memory .port__wrap__out', 'remove', 'walkthroughDatasouceModelStep'),
    ],
    onBefore: api => [
      api.togglePortWrapper('.Entity.DataSource.memory .port__wrap__out', 'add', 'walkthroughDatasouceModelStep'),
    ],
    onExit: api => [
      api.togglePortWrapper('.Entity.DataSource.memory .port__wrap__out', 'remove', 'walkthroughDatasouceModelStep'),
    ],
  },
  '030': {
    title: 'Function Entities Overview',
    text: `
A Function Entity represents a serverless function that's managed within your Project.
<br /><br />
C'mon, click it!
`,
    selector: '.Tool.function',
    allowClicksThruHole: true,
    skipLastStep: true,
    position: 'right',
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Function_.editable', false),
      api.delayOverlay(500),
    ],
    onBefore: api => [
      api.focus('.Tool.function button'),
    ],
  },
  '031': {
    title: 'Deploy Function',
    text: `
Click <pre>OK</pre> to deploy function.
`,
    selector: '.Entity.Function_.editable .submit',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: false,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.Function_.editable'),
      api.delayOverlay(1000),
    ],
    onBefore: api => [
      api.focus('.Entity.Function_.editable .submit'),
    ],
  },
  '032': {
    title: 'Function is Deploying',
    text: `
Please wait till the <pre>myfunction</pre> is deployed and the walkthrough will continue automatically.
<br />
<br />
You'll see this Rocket Ship icon whenever an artifact is being deployed to your Kubernetes cluster.
`,
    position: 'right',
    selector: '.Entity.Function_',
    allowClicksThruHole: false,
    triggerNext: api => [
      api.setWaitMethod('waitBySetTimeout'),
      api.waitUntilNotPresent('.CanvasElement.Function_.deploying'),
      api.waitUntilNotPresent('.CanvasElement.Function_.wip'),
      api.setWaitMethod(),
    ],
  },
  '033': {
    title: 'View Function Details',
    text: `
The ellipses icon will open a Details Panel.
<br /><br />
C'mon, click it!
`,
    position: 'right',
    selector: '.Entity.Function_ .Toolbox__button--zoom',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel.visible .RnD__content', false),
      api.delayOverlay(3000),
    ],
    onBefore: api => [
      api.delayOverlay(500),
      api.click('.Entity.Function_'),
      api.waitUntilPresent('.Entity.Function_.highlighted .Toolbox__button--zoom'),
      api.focus('.Entity.Function_ .Toolbox__button--zoom'),
    ],
  },
  '034': {
    title: `
Function Entity's Code Editor
`,
    text: `
Functions are barebone functions that can be written in multiple languages and ran in your public cloud serverless infrastructure like AWS Lambda or ran natively in your Kubernetes cluster in Kubeless, a serverless engine that comes built-in.
`,
    selector: '.DetailsPanel .FilesEditor',
    position: 'top',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: () => [],
  },
  '035': {
    title: 'Return to Canvas from Function Details Panel',
    text: `
Click <pre>Cancel</pre> to return to the Canvas view.
`,
    selector: '.DetailsPanel .cancel',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.DetailsPanel.visible'),
      api.delayOverlay(1500),
    ],
    onBefore: api => [
      api.focus('.DetailsPanel .cancel'),
    ],
  },
  // '040': {
  //   title: 'Microservices Entity Overview',
  //   text: '<i>This Entity is still in-development. It\'s not recommended for use at this time.</i>',
  //   selector: '.Tool.microservice',
  //   position: 'right',
  // },
};
