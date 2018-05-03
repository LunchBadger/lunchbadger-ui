export default {
  '05': {
    title: 'Endpoint Dropdown Menu',
    text: 'Selecting this icon will reveal available Endpoint Entities.',
    selector: '.Tool.endpoint',
    position: 'right',
  },
  '06': {
    title: 'Gateway Entities',
    text: 'Clicking this icon creates a new Gateway Entity on the canvas with a corresponding Gateway Deployment running in Kubernetes.',
    selector: '.Entity.Gateway',
    position: 'left',
  },
  '07': {
    title: 'Pipelines',
    text: 'Each Gateway consists of one or more Pipelines. Model, Service Endpoint, and Function Entities can all be connected to the left-hand side of a Pipeline. API Endpoint Entities connect to the right-hand side of a Pipeline.',
    selector: '.Gateway__pipelines',
    position: 'left',
  },
  '08': {
    title: 'Accessing Gateway Instances',
    text: `All gateways will be accessible via the following domain name pattern:
<br /><br />
http://{gateway-name}-{user-id}-dev.lunchbadger.io
<br /><br />
For example, if your gateway is named "Gateway" and your User ID is "999", your gateway will be accessible at:
<br /><br />
http://gateway-999-dev.lunchbadger.io
`,
    selector: '.Gateway__pipeline0 > div:nth-child(2) > div',
    position: 'left',
  },
  '09': {
    title: 'Consumer Management',
    text: 'All Gateway Entities contain an icon for accessing Consumer Management. This icon will open up a Consumer Management panel. Here, you can add Users, Apps, Credentials, and Scopes.',
    selector: '.Toolbox__button--customerManagement',
    position: 'bottom',
  },
  '10': {
    title: 'API Request Flow',
    text: 'When an API request is received, it flows through the LunchBadger Entities defined on the Canvas.',
    selector: '.Entity.Gateway',
    position: 'bottom',
  },
  '11': {
    text: 'First, the API request comes in through an API Endpoint.  In this case, that endpoint is /api/cars.',
    selector: '.Entity.ApiEndpoint',
    position: 'bottom',
  },
  '12': {
    text: 'The request is routed to a Gateway Pipeline where it flows through the defined Policies.',
    selector: '.Gateway__pipeline0 .EntityProperty',
    position: 'bottom',
  },
  '13': {
    text: 'The API request then makes its way to an Entity in the Private column (Model, Service Endpoint, or Function). In this example, the request is routed to the Car model.',
    selector: '.Entity.Model',
    position: 'bottom',
  },
  '14': {
    text: 'Models are backed by Data Sources.  Behind the scenes, this Loopback model will connect to an in-memory data store.',
    selector: '.Entity.DataSource',
    position: 'bottom',
  },
  '15': {
    title: 'Need Help?',
    text: 'Now that you\'re armed with the basics of how to use LunchBadger, have fun! Feel free to play around with Entities on the Canvas and direct any questions to your LunchBadger Support Team at hello@lunchbadger.com.',
    selector: '.Logo',
    position: 'bottom-left',
  },
};
