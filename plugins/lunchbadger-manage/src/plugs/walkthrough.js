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
    selector: '.Tool__submenuItem.apiendpoint',
    position: 'right',
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
    text: 'Clicking this icon creates a new Gateway Entity on the canvas with a corresponding Gateway Deployment running in Kubernetes.',
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
Let's add a policy to the pipeline.
`,
    selector: '.Entity.Gateway.editable .button__add__pipelines0policy',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .select__pipelines0policies0name'),
    ],
  },
  '0704': {
    text: `
Let's set <pre>proxy</pre> as policy here.
`,
    selector: '.Entity.Gateway.editable .select__pipelines0policies0name',
    position: 'left',
    allowClicksThruHole: true,
    onBefore: api => [
      api.setOverlayBack(true),
    ],
    onAfter: api => [
      api.setOverlayBack(false),
    ],
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.Gateway.editable .Gateway__pipeline0 .port-in.port__disabled'),
    ],
  },
  '0705': {
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
  '0706': {
    text: `
Let's name <pre>FunctionPipeline</pre> as the second pipeline.
`,
    selector: '.Entity.Gateway.editable .input__pipelines1name',
    position: 'left',
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines1name input[value="FunctionPipeline"]'),
      api.unselectEntities(),
    ],
  },
  '0707': {
    text: `
Let's add a policy to the second pipeline.
`,
    selector: '.Entity.Gateway.editable .button__add__pipelines1policy',
    position: 'top-right',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .select__pipelines1policies0name'),
    ],
  },
  '0708': {
    text: `
Let's set <pre>proxy</pre> as policy here also.
`,
    selector: '.Entity.Gateway.editable .select__pipelines1policies0name',
    position: 'left',
    allowClicksThruHole: true,
    onBefore: api => [
      api.setOverlayBack(true),
    ],
    onAfter: api => [
      api.setOverlayBack(false),
    ],
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.Gateway.editable .Gateway__pipeline1 .port-in.port__disabled'),
    ],
  },
  '0709': {
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
  '0710': {
    text: 'Gateway is deploying...',
    position: 'left',
    selector: '.Entity.Gateway',
    allowClicksThruHole: false,
    triggerNext: api => [
      api.setWaitMethod('waitBySetTimeout'),
      api.waitUntilNotPresent('.CanvasElement.Gateway.deploying'),
      api.setWaitMethod(),
      api.setStepText('Gateway has been deployed!'),
      api.waitUntilLoadersGone(),
    ],
  },
  '0711': {
    text: 'Model, Service Endpoint, and Function Entities can all be connected to the left-hand side of a Pipeline.',
    selector: '.quadrant.Private .quadrant__body',
    position: 'right',
  },
  '0712': {
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
      api.setStepText('Entities are connecting...'),
      api.waitUntilProjectSaved(),
      api.setShowOverlay(true),
    ],
  },
  '0713': {
    text: 'API Endpoint Entities connect to the right-hand side of a Pipeline.',
    selector: '.quadrant.Public .quadrant__body',
    position: 'left',
    allowClicksThruHole: false,
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
      Let's set path here as: <pre>/api/car*</pre>
`,
    selector: '.Entity.ApiEndpoint.editable .input__paths0',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0 input[value="/api/car*"]'),
    ],
  },
  '0716': {
    text: 'Click <pre>OK</pre> to submit Car Api Endpoint',
    selector: '.Entity.ApiEndpoint.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.setShowOverlay(false),
      api.waitUntilNotPresent('.Entity.ApiEndpoint.editable'),
      api.setShowTooltip(false),
      api.waitUntilProjectSaved(),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '0717': {
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
      api.setStepText('Entities are connecting...'),
      api.waitUntilProjectSaved(),
      api.setShowOverlay(true),
    ],
  },
  '0718': {
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
  '0719': {
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
  '0720': {
    text: 'Click <pre>OK</pre> to submit Function Api Endpoint',
    selector: '.Entity.ApiEndpoint.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.setShowOverlay(false),
      api.waitUntilNotPresent('.Entity.ApiEndpoint.editable'),
      api.setShowTooltip(false),
      api.waitUntilProjectSaved(),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '0721': {
    text: 'Click this icon to open pipelines details panel',
    waitForSelector: '.Entity.Gateway .Toolbox__button--pipelines',
    position: 'left',
    allowClicksThruHole: true,
    onBefore: api => [
      api.click('.Entity.Gateway'),
    ],
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel.visible .BaseDetails.pipelines'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(2000),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '0722': {
    text: `Pipelines contain a list of Policies. Policies contain a list of condition-action pairs.
    <br /><br />
    More details on available conditions and policies can be found in the <a href="https://www.express-gateway.io/" target="_blank">Express Gateway Documentation</a>.`,
    selector: '.DetailsPanel .pipelines .CollapsibleProperties.noDividers',
    position: 'bottom',
    allowClicksThruHole: false,
  },
  '0723': {
    text: 'Click this icon to open Consumer Management details panel',
    selector: '.DetailsPanel .Toolbox__button--customerManagement',
    position: 'bottom',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.DetailsPanel .BaseDetails.customerManagement'),
    ]
  },
  '0724': {
    text: 'Here, you can add Users, Apps, Credentials, and Scopes.',
    selector: '.DetailsPanel .CustomerManagement',
    position: 'top',
  },
  '0725': {
    text: 'Click <pre>Cancel</pre> to close details panel',
    selector: '.DetailsPanel .cancel',
    triggerNext: api => [
      api.waitUntilNotPresent('.DetailsPanel.visible'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(2000),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '0726': {
    title: 'Accessing Gateway Instances',
    text: `
All gateways will be accessible via the following domain name pattern:
<code>http://{gateway-name}-{user-id}-dev.lunchbadger.io</code>
<br />
For example, if your gateway is named "Gateway" and your User ID is "99", your gateway will be accessible at:
<code>http://gateway-99-dev.lunchbadger.io</code>
`,
    selector: '.Gateway__pipeline0 > div:nth-child(2) > div',
    position: 'left',
  },
  '080': {
    title: 'API Request Flow',
    text: 'When an API request is received, it flows through the LunchBadger Entities defined on the Canvas.',
    selector: '.canvas__legend',
    position: 'top',
  },
  '081': {
    text: 'First, the API request comes in through an API Endpoint.  In this case, that endpoint is /api/cars.',
    selector: '.Entity.ApiEndpoint',
    position: 'bottom',
  },
  '082': {
    text: 'The request is routed to a Gateway Pipeline where it flows through the defined Policies.',
    selector: '.Entity.Gateway .Gateway',
    position: 'bottom',
  },
  '083': {
    text: 'The API request then makes its way to an Entity in the Private column (Model, Service Endpoint, or Function). In this example, the request is routed to the Car model.',
    selector: '.Entity.Model',
    position: 'bottom',
  },
  '084': {
    text: 'Models are backed by Data Sources. Behind the scenes, this Loopback model will connect to an in-memory data store.',
    selector: '.Entity.DataSource',
    position: 'bottom',
  },
};
