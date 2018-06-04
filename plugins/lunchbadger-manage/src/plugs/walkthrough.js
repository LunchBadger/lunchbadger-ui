export default {
  '050': {
    title: 'Endpoint Dropdown Menu',
    text: `
Selecting this icon will reveal available Endpoint Entities.
<br /><br />
C'mon, click it!`,
    selector: '.Tool.endpoint',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('div[role=presentation]'),
    ],
  },
  '051': {
    title: 'Service Endpoint Entities',
    text: 'These are references to your backend services. Used as Express Gateway service endpoints when connected to a Gateway Entity.',
    waitForSelector: '.Tool__submenuItem.serviceendpoint',
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
  '060': {
    title: 'API Endpoint Entities',
    text: 'Used as Express Gateway API Endpoints for clients connecting to Gateway Entities.',
    selector: '.Tool__submenuItem.apiendpoint',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: api => [
      api.blockClicks(),
    ],
    onAfter: api => [
      api.unblockClicks(),
      api.unselectEntities(),
    ],
  },
  '0700': {
    title: 'Gateway Entities',
    text: `
This icon creates a new Gateway Entity on the canvas with a corresponding Gateway Deployment running in Kubernetes.
<br /><br />
C'mon, click it!`,
    selector: '.Tool.gateway',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable'),
    ],
  },
  '0701': {
    text: 'Each Gateway consists of one or more Pipelines.',
    selector: '.Entity.Gateway.editable .Gateway',
    position: 'left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0702': {
    text: `
Let's name first pipeline as <pre>CarPipeline</pre>`,
    selector: '.Entity.Gateway.editable .input__pipelines0name',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines0name input[value="CarPipeline"]'),
      api.unselectEntities(),
    ],
  },
  '0703': {
    text: `
Let's add the second pipeline.
`,
    selector: '.Entity.Gateway.editable .button__add__Pipelines',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines1name'),
    ],
  },
  '0704': {
    text: `
Let's name the second pipeline as <pre>FunctionPipeline</pre>.
`,
    selector: '.Entity.Gateway.editable .input__pipelines1name',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines1name input[value="FunctionPipeline"]'),
      api.unselectEntities(),
    ],
  },
  '0705': {
    text: `
Click <pre>OK</pre> to deploy a gateway.
`,
    selector: '.Entity.Gateway.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.setShowOverlay(false),
      api.waitUntilNotPresent('.Entity.Gateway.editable'),
      api.wait(1000),
      api.setShowOverlay(true),
    ],
  },
  '0706': {
    text: 'Gateway is deploying...',
    position: 'left',
    selector: '.Entity.Gateway',
    allowClicksThruHole: false,
    onBefore: () => [],
    triggerNext: api => [
      api.setWaitMethod('waitBySetTimeout'),
      api.waitUntilNotPresent('.CanvasElement.Gateway.deploying'),
      api.waitUntilNotPresent('.CanvasElement.Gateway.wip'),
      api.setWaitMethod(),
    ],
  },
  '0707': {
    text: 'Model, Service Endpoint, and Function Entities can all be connected to the left-hand side of a Pipeline.',
    waitForSelector: '.quadrant.Private .quadrant__body',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0708': {
    text: `
Please connect <pre>Car</pre> model with <pre>CarPipeline</pre> by connecting their ports.
`,
    selector: '.Entity.Model .port-out',
    position: 'left',
    allowClicksThruHole: true,
    onBefore: api => [
      api.setShowOverlay(false),
    ],
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Model .port-out .port__anchor--connected'),
      api.setShowOverlay(true),
    ],
  },
  '0709': {
    text: 'API Endpoint Entities connect to the right-hand side of a Pipeline.',
    selector: '.quadrant.Public .quadrant__body',
    position: 'left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0710': {
    text: `
Let's add a path.
`,
    selector: '.Entity.ApiEndpoint.editable .button__add__PATHS',
    position: 'top',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0'),
    ],
  },
  '0711': {
    text: `
Let's set path here as: <pre>/api/car*</pre>
`,
    selector: '.Entity.ApiEndpoint.editable .input__paths0',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0 input[value="/api/car*"]'),
    ],
  },
  '0712': {
    text: 'Click <pre>OK</pre> to submit Car Api Endpoint',
    selector: '.Entity.ApiEndpoint.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.ApiEndpoint.editable'),
    ],
  },
  '0713': {
    text: `
Please connect <pre>Function</pre> with <pre>FunctionPipeline</pre> by connecting their ports.
`,
    selector: '.Entity.Function_ .port-out',
    position: 'left',
    allowClicksThruHole: true,
    onBefore: api => [
      api.setShowOverlay(false),
    ],
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Function_ .port-out .port__anchor--connected'),
      api.setShowOverlay(true),
    ],
  },
  '0714': {
    text: `
Let's add a path.
`,
    selector: '.Entity.ApiEndpoint.editable .button__add__PATHS',
    position: 'top',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0'),
    ],
  },
  '0715': {
    text: `
Let's set path here as: <pre>/api/myfunction*</pre>
`,
    selector: '.Entity.ApiEndpoint.editable .input__paths0',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0 input[value="/api/myfunction*"]'),
    ],
  },
  '0716': {
    text: 'Click <pre>OK</pre> to submit Function Api Endpoint',
    selector: '.Entity.ApiEndpoint.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.ApiEndpoint.editable'),
    ],
  },
  '0717': {
    text: `
Click on entity box to reveal it's toolbox
`,
    selector: '.Entity.Gateway',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.highlighted'),
    ],
  },
  '0718': {
    text: 'Click this icon to open pipelines details panel',
    selector: '.Entity.Gateway .Toolbox__button--pipelines',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel.visible .BaseDetails.pipelines'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(2000),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '0719': {
    text: `Pipelines contain a list of Policies. Policies contain a list of condition-action pairs.
    <br /><br />
    More details on available conditions and policies can be found in the <a href="https://www.express-gateway.io/" target="_blank">Express Gateway Documentation</a>.`,
    selector: '.DetailsPanel .pipelines .CollapsibleProperties.noDividers',
    position: 'bottom',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0720': {
    text: 'Click this icon to open Consumer Management details panel',
    selector: '.DetailsPanel .Toolbox__button--customerManagement',
    position: 'bottom',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel .BaseDetails.customerManagement'),
    ]
  },
  '0721': {
    text: 'Here, you can add Users, Apps, Credentials, and Scopes.',
    selector: '.DetailsPanel .CustomerManagement',
    position: 'top',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0722': {
    text: 'Click <pre>Cancel</pre> to close details panel',
    selector: '.DetailsPanel .cancel',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.DetailsPanel.visible'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(2000),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '0801': {
    text: `
Let's trace API request on an example call.
<br />
<br />
Click on <pre>CarPipeline</pre> to highlight it.
`,
    selector: '.Entity.Gateway .pipelines0name',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway .EntityProperty__selected .pipelines0name'),
    ],
  },
  '0802': {
    title: 'Accessing Gateway Instances',
    text: `
All gateways will be accessible via the following domain name pattern:
<code>http://{gateway-name}-{user-id}-dev.lunchbadger.io</code>
<br />
For example, if your gateway is named "Gateway" and your User ID is "99", your gateway will be accessible at:
<code>http://gateway-99-dev.lunchbadger.io</code>
`,
    waitForSelector: '.Entity.ApiEndpoint .accessUrl',
    position: 'bottom-right',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0803': {
    title: 'API Request Flow',
    text: 'When an API request is received, it flows through the LunchBadger Entities defined on the Canvas.',
    selector: '.canvas__legend',
    position: 'top',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0804': {
    text: 'First, the API request comes in through an API Endpoint.  In this case, that endpoint is /api/cars.',
    selector: '.Entity.ApiEndpoint .paths0',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0805': {
    text: 'The request is routed to a Gateway Pipeline where it flows through the defined Policies.',
    selector: '.Entity.Gateway .Gateway__pipeline0',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0806': {
    text: 'The API request then makes its way to an Entity in the Private column (Model, Service Endpoint, or Function). In this example, the request is routed to the Car model.',
    selector: '.Entity.Model',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0807': {
    text: 'Models are backed by Data Sources. Behind the scenes, this Loopback model will connect to an in-memory data store.',
    selector: '.Entity.DataSource',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
};
