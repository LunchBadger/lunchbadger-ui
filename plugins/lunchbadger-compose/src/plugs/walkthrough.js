export default {
  '010': {
    title: 'Data Source Dropdown Menu',
    text: `
Selecting this icon will reveal available data source connectors for your LunchBadger project.
<br />
<br />
C'mon, click it!
`,
    selector: '.Tool.dataSource',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('div[role=presentation]'),
    ],
  },
  '011': {
    title: 'Data Source Entities Overview',
    text: 'Each data source entity will come with its own set of properties specific for that type of connection.  These entities correspond with a matching data source connector that can be used with your underlying Loopback project.',
    waitForSelector: 'div[role=presentation]',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: api => [
      api.blockClicks(),
      api.wait(1500),
    ],
    onAfter: api => [
      api.unblockClicks(),
    ],
  },
  '012': {
    text: `
Memory type is different from all other types, because it is in-memory data store, and not a Loopback data source connector.
<br />
<br />
C'mon, click it!
`,
    selector: '.Tool__submenuItem.memory',
    position: 'right',
    allowClicksThruHole: true,
    onBefore: api => [
      api.blockClicks(),
    ],
    onAfter: api => [
      api.unblockClicks(),
    ],
    triggerNext: api => [
      api.waitUntilPresent('.Entity.DataSource.memory'),
    ],
  },
  '013': {
    text: `
If it would be a Loopback data source connector, here you could specify data source properties, like host, port, etc.
<br />
<br />
Click <pre>OK</pre> to create Memory Data Source.
`,
    selector: '.Entity.DataSource.memory.editable',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.DataSource.memory.editable'),
    ],
  },
  '020': {
    title: 'Model Entities',
    text: `
Model Entity represent a visual interface on top of a Loopback Model.
<br />
<br />
C'mon, click it!
`,
    selector: '.Tool.model',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .EntityHeader'),
    ],
  },
  '021': {
    text: `
Here you define Loopback Model name.
<br /><br />
Let's name it <pre>Car</pre>.
`,
    selector: '.Entity.Model.editable .EntityHeader',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .EntityHeader input[value="Car"]'),
    ],
  },
  '022': {
    text: `
Here, you can define context path.
<br /><br />
Let's name it <pre>cars</pre>.
`,
    selector: '.Entity.Model.editable .EntityProperties .EntityProperty',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .input__httppath input[value="cars"]'),
    ],
  },
  '023': {
    text: `
Here, you can add properties you\'d like to expose from your Data Source through your API Endpoint.
<br /><br />
C'mon, click it!
`,
    selector: '.Entity.Model .button__add__Properties',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .input__properties0name'),
    ],
  },
  '024': {
    text: `
Let's set <pre>year</pre> as name.
`,
    selector: '.Entity.Model.editable .input__properties0name',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .input__properties0name input[value="year"]'),
    ],
  },
  '025': {
    text: `
Here you can set property type.
<br /><br />
Let's set type <pre>Number</pre>.
`,
    selector: '.Entity.Model.editable .select__properties0type',
    position: 'right',
    allowClicksThruHole: true,
    onBefore: api => [
      api.setOverlayBack(true),
    ],
    onAfter: api => [
      api.setOverlayBack(false),
    ],
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model.editable .properties0type__Number'),
    ],
  },
  '026': {
    text: `
Click <pre>OK</pre> to create model.
`,
    selector: '.Entity.Model .submit',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.setShowOverlay(false),
      api.waitUntilNotPresent('.Entity.Model.editable'),
      api.setShowOverlay(true),
    ],
  },
  '027': {
    text: `
Please connect data source connector with Loopback model by connecting their ports.
`,
    selector: '.Entity.DataSource.memory .port-out',
    position: 'bottom-left',
    allowClicksThruHole: true,
    onBefore: api => [
      api.setShowOverlay(false),
    ],
    triggerNext: api => [
      api.waitUntilPresent('.Entity.DataSource.memory .port-out .port__anchor--connected'),
      api.setShowOverlay(true),
    ],
  },
  '030': {
    title: 'Function Entities',
    text: `
A function entity represents a serverless function that runs in your Kubernetes cluster.
<br /><br />
C'mon, click it!
`,
    selector: '.Tool.function',
    allowClicksThruHole: true,
    position: 'right',
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Function_.editable'),
    ],
  },
  '031': {
    text: `
Click <pre>OK</pre> to deploy function,
`,
    selector: '.Entity.Function_.editable .submit',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.setShowOverlay(false),
      api.waitUntilNotPresent('.Entity.Function_.editable'),
      api.wait(1000),
      api.setShowOverlay(true),

    ],
  },
  '032': {
    text: 'Function is deploying...',
    position: 'right',
    selector: '.Entity.Function_',
    allowClicksThruHole: false,
    triggerNext: api => [
      api.setWaitMethod('waitBySetTimeout'),
      api.waitUntilNotPresent('.CanvasElement.Function_.deploying'),
      api.waitUntilNotPresent('.CanvasElement.Function_.wip'),
      api.waitUntilPresent('.Entity.Function_.highlighted .Toolbox__button--zoom'),
      api.setWaitMethod(),
    ],
  },
  '033': {
    text: `
Selecting this icon will open entity in the details panel.
<br /><br />
C'mon, click it!
`,
    position: 'right',
    selector: '.Entity.Function_ .Toolbox__button--zoom',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel.visible .RnD__content'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(1500),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '034': {
    text: 'LunchBadger includes a built-in editor.',
    selector: '.DetailsPanel .FilesEditor',
    position: 'top',
  },
  '035': {
    text: `
Click <pre>Cancel</pre> to close the details panel.
`,
    selector: '.DetailsPanel .cancel',
    position: 'top',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.DetailsPanel.visible'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(1500),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '040': {
    title: 'Microservice Entities',
    text: '<i>This Entity is still in-development. It\'s not recommended for use at this time.</i>',
    selector: '.Tool.microservice',
    position: 'right',
  },
};
