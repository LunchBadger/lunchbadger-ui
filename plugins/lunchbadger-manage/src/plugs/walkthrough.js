export default {
  '050': {
    title: 'Endpoint Dropdown Menu',
    text: 'Selecting this icon will reveal available Endpoint Entities.',
    selector: '.Tool.endpoint',
    position: 'right',
  },
  '051': {
    title: 'Service Endpoint Entities',
    text: 'These are references to your backend services. Used as Express Gateway service endpoints when connected to a Gateway Entity.',
    waitForSelector: '.Tool__submenuItem.serviceendpoint',
    position: 'right',
    onBefore: api => [
      api.openEntitySubmenu('endpoint'),
    ],
  },
  '060': {
    title: 'API Endpoint Entities',
    text: 'Used as Express Gateway API Endpoints for clients connecting to Gateway Entities.',
    selector: '.Tool__submenuItem.apiendpoint',
    position: 'right',
    onAfter: api => [
      api.unselectEntities(),
    ],
  },
  '070': {
    title: 'Gateway Entities',
    text: 'Clicking this icon creates a new Gateway Entity on the canvas with a corresponding Gateway Deployment running in Kubernetes.',
    selector: '.Tool.gateway',
    position: 'right',
  },
  '071': {
    text: 'Each Gateway consists of one or more Pipelines.',
    waitForSelector: '.Entity.Gateway .Gateway',
    position: 'left',
    onBefore: api => [
      api.addEntity('gateway'),
      api.setTextValue('.Entity.Gateway .input__pipelines0name', 'CarPipeline'),
      api.click('.button__add__pipelines0policy'),
      api.setSelectValue('.Entity.Gateway .select__pipelines0policies0name', 'proxy'),
      api.click('.button__add__Pipelines'),
      api.setTextValue('.Entity.Gateway .input__pipelines1name', 'FunctionPipeline'),
      api.click('.button__add__pipelines1policy'),
      api.setSelectValue('.Entity.Gateway .select__pipelines1policies0name', 'proxy'),
    ],
    onAfter: api => [
      api.deployGateway('Gateway'),
      api.unselectEntities(),
    ],
  },
  '072': {
    text: 'Model, Service Endpoint, and Function Entities can all be connected to the left-hand side of a Pipeline.',
    selector: '.quadrant.Private .quadrant__body',
    position: 'right',
  },
  '073': {
    text: 'API Endpoint Entities connect to the right-hand side of a Pipeline.',
    waitForSelector: '.quadrant.Public .quadrant__body',
    position: 'left',
    onBefore: api => [
      api.connectPorts('.Entity.Model .port-out', '.Entity.Gateway .Gateway__pipeline0 .port-in'),
      api.click('.Entity.ApiEndpoint .button__add__PATHS'),
      api.setTextValue('.Entity.ApiEndpoint .input__paths0', '/api/cars'),
      api.submitCanvasEntity('ApiEndpoint'),
      api.connectPorts('.Entity.Function_ .port-out', '.Entity.Gateway .Gateway__pipeline1 .port-in'),
      api.click('.Entity.ApiEndpoint.editable .button__add__PATHS'),
      api.setTextValue('.Entity.ApiEndpoint.editable .input__paths0', '/api/myfunction'),
      api.submitCanvasEntity('ApiEndpoint'),
      api.unselectEntities(),
    ],
  },
  '074': {
    text: `Pipelines contain a list of Policies. Policies contain a list of condition-action pairs.
    <br /><br />
    More details on available conditions and policies can be found in the <a href="https://www.express-gateway.io/" target="_blank">Express Gateway Documentation</a>.`,
    waitForSelector: '.DetailsPanel .pipelines .CollapsibleProperties.noDividers',
    position: 'bottom',
    onBefore: api => [
      api.openEntityDetails('Gateway', 'pipelines'),
    ],
    onAfter: api => [
      api.discardEntityDetails(),
      api.unselectEntities(),
    ],
  },
  '075': {
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
  '076': {
    title: 'Consumer Management',
    text: 'All Gateway Entities contain an icon for accessing Consumer Management. This icon will open up a Consumer Management panel.',
    waitForSelector: '.Entity.Gateway .Toolbox__button--customerManagement',
    position: 'left',
    onBefore: api => [
      api.click('.Entity.Gateway'),
    ],
    onAfter: api => [
      api.unselectEntities(),
    ],
  },
  '077': {
    text: 'Here, you can add Users, Apps, Credentials, and Scopes.',
    waitForSelector: '.DetailsPanel .CustomerManagement',
    position: 'top',
    onBefore: api => [
      api.openEntityDetails('Gateway', 'customerManagement', 1500),
    ],
    onAfter: api => [
      api.discardEntityDetails(),
      api.unselectEntities(),
    ],
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
