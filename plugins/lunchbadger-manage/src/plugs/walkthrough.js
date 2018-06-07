export default {
  '050': {
    title: 'Endpoint Dropdown Menu',
    text: `
Selecting this icon will reveal available Endpoint Entities.
`,
    selector: '.Tool.endpoint',
    position: 'right',
    allowClicksThruHole: false,
  },
  '051': {
    title: 'Service Endpoint Entities',
    text: 'These are references to your backend services. Used as Express Gateway service endpoints when connected to a Gateway Entity.',
    waitForSelector: '.Tool__submenuItem.serviceendpoint',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: api => [
      api.openEntitySubmenu('endpoint'),
      api.blockClicks(),
    ],
    onAfter: api => [
      api.unblockClicks(),
    ],
  },
  '060': {
    title: 'API Endpoint Entities',
    text: 'Used as Express Gateway API Endpoints for clients connecting to Gateway Entities.',
    waitForSelector: '.Tool__submenuItem.apiendpoint',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: api => [
      api.blockClicks(),
    ],
    onAfter: api => [
      api.unblockClicks(),
      api.openEntitySubmenu('endpoint'),
    ],
  },
  '0700': {
    title: 'Gateway Entities',
    text: `
This icon creates a new Gateway Entity on the canvas with a corresponding Gateway Deployment running in Kubernetes.
<br /><br />
C'mon, click it!`,
    waitForSelector: '.Tool.gateway',
    position: 'right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable', false),
    ],
    onBefore: api => [
      api.focus('.Tool.gateway button'),
    ],
  },
  '0701': {
    text: 'Each Gateway consists of one or more Pipelines.',
    waitForSelector: '.Entity.Gateway.editable .Gateway',
    position: 'left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0702': {
    text: `
Let's name first pipeline as <pre>CarPipeline</pre>`,
    waitForSelector: '.Entity.Gateway.editable .input__pipelines0name',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines0name input[value="CarPipeline"]'),
    ],
    onBefore: api => [
      api.focus('.Entity.Gateway.editable .input__pipelines0name input'),
    ],
  },
  '0703': {
    text: `
Let's add the second pipeline.
`,
    waitForSelector: '.Entity.Gateway.editable .button__add__Pipelines',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines1name', false),
    ],
    onBefore: api => [
      api.focus('.Entity.Gateway.editable .button__add__Pipelines')
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
    ],
  },
  '0705': {
    text: `
Click <pre>OK</pre> to deploy a gateway.
`,
    waitForSelector: '.Entity.Gateway.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.setShowOverlay(false),
      api.waitUntilNotPresent('.Entity.Gateway.editable'),
      api.wait(1000),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.focus('.Entity.Gateway.editable .submit'),
    ],
  },
  '0706': {
    text: 'Gateway is deploying...',
    position: 'left',
    waitForSelector: '.Entity.Gateway',
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
    waitForSelector: '.Entity.ApiEndpoint.editable .button__add__PATHS',
    position: 'top',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0', false),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .button__add__PATHS'),
    ],
  },
  '0711': {
    text: `
Let's set path here as: <pre>/api/car*</pre>
`,
    waitForSelector: '.Entity.ApiEndpoint.editable .input__paths0',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0 input[value="/api/car*"]', false),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .input__paths0 input'),
    ],
  },
  '0712': {
    text: 'Click <pre>OK</pre> to submit Car Api Endpoint',
    waitForSelector: '.Entity.ApiEndpoint.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.ApiEndpoint.editable', false),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .submit'),
    ]
  },
  '0713': {
    text: `
Please connect <pre>Function</pre> with <pre>FunctionPipeline</pre> by connecting their ports.
`,
    waitForSelector: '.Entity.Function_ .port-out',
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
    waitForSelector: '.Entity.ApiEndpoint.editable .button__add__PATHS',
    position: 'top',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0', false),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .button__add__PATHS'),
    ],
  },
  '0715': {
    text: `
Let's set path here as: <pre>/api/myfunction*</pre>
`,
    waitForSelector: '.Entity.ApiEndpoint.editable .input__paths0',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0 input[value="/api/myfunction*"]', false),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .input__paths0 input'),
    ],
  },
  '0716': {
    text: 'Click <pre>OK</pre> to submit Function Api Endpoint',
    waitForSelector: '.Entity.ApiEndpoint.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.ApiEndpoint.editable'),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .submit'),
    ],
  },
  '0718': {
    text: 'Click this icon to open pipelines details panel',
    waitForSelector: '.Entity.Gateway .Toolbox__button--pipelines',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel.visible .BaseDetails.pipelines', false),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(2000),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.click('.Entity.Gateway .EntityHeader'),
      api.focus('.Entity.Gateway .Toolbox__button--pipelines'),
    ],
  },
  '0719': {
    text: `Pipelines contain a list of Policies. Policies contain a list of condition-action pairs.
    <br /><br />
    More details on available conditions and policies can be found in the <a href="https://www.express-gateway.io/" target="_blank">Express Gateway Documentation</a>.`,
    waitForSelector: '.DetailsPanel .pipelines .CollapsibleProperties.noDividers',
    position: 'bottom',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0720': {
    text: 'Click this icon to open Consumer Management details panel',
    waitForSelector: '.DetailsPanel .Toolbox__button--customerManagement',
    position: 'bottom-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel .BaseDetails.customerManagement', false),
    ],
    onBefore: api => [
      api.focus('.DetailsPanel .Toolbox__button--customerManagement'),
    ],
  },
  '0721': {
    text: 'Here, you can add Users, Apps, Credentials, and Scopes.',
    waitForSelector: '.DetailsPanel .CustomerManagement',
    position: 'bottom',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0722': {
    text: 'Click <pre>Cancel</pre> to close details panel',
    waitForSelector: '.DetailsPanel .cancel',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.DetailsPanel.visible'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(2000),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.focus('.DetailsPanel .cancel'),
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
    waitForSelector: '.canvas__legend',
    position: 'top',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0804': {
    text: 'First, the API request comes in through an API Endpoint.  In this case, that endpoint is /api/cars.',
    waitForSelector: '.Entity.ApiEndpoint .paths0',
    position: 'bottom-right',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0805': {
    text: 'The request is routed to a Gateway Pipeline where it flows through the defined Policies.',
    waitForSelector: '.Entity.Gateway .Gateway__pipeline0',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0806': {
    text: 'The API request then makes its way to an Entity in the Private column (Model, Service Endpoint, or Function). In this example, the request is routed to the Car model.',
    waitForSelector: '.Entity.Model',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0807': {
    text: 'Models are backed by Data Sources. Behind the scenes, this Loopback model will connect to an in-memory data store.',
    waitForSelector: '.Entity.DataSource',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
};
