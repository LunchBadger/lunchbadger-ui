export default {
  '051': {
    title: 'Endpoint Dropdown Menu',
    text: 'Selecting this icon will reveal available Endpoint Entities.',
    selector: '.Tool.endpoint',
    position: 'right',
    onAfter: cb => {
      document.querySelector('.Tool.endpoint .Tool__box').click();
      setTimeout(cb, 500);
    },
  },
  '052': {
    text: 'Endpoint Entities',
    selector: 'div[role=presentation]',
    position: 'right',
    onAfter: cb => {
      document.querySelector('.logotype').click();
      document.querySelector('.canvas__wrapper').scrollTop = 9999;
      cb();
    },
  },
  '053': {
    title: 'Service Endpoint Entities',
    text: 'These are references to your backend services. Used as Express Gateway service endpoints when connected to a Gateway Entity.',
    selector: '.Entity.ServiceEndpoint',
    position: 'right',
    onAfter: cb => {
      document.querySelector('.canvas__wrapper').scrollTop = 0;
      cb();
    },
  },
  '054': {
    title: 'API Endpoint Entities',
    text: 'Used as Express Gateway API Endpoints for clients connecting to Gateway Entities.',
    selector: '.Entity.ApiEndpoint',
    position: 'left',
  },
  '06': {
    title: 'Gateway Entities',
    text: 'Clicking this icon creates a new Gateway Entity on the canvas with a corresponding Gateway Deployment running in Kubernetes.',
    selector: '.Tool.gateway',
    position: 'right',
  },
  '071': {
    text: 'Each Gateway consists of one or more Pipelines. Model, Service Endpoint, and Function Entities can all be connected to the left-hand side of a Pipeline. API Endpoint Entities connect to the right-hand side of a Pipeline.',
    selector: '.Entity.Gateway .Entity__data',
    position: 'bottom',
    onAfter: cb => {
      document.querySelector('.Entity.Gateway').click();
      setTimeout(() => {
        document.querySelector('.Entity.Gateway .Toolbox__button--pipelines').click();
        setTimeout(cb, 1500);
      }, 200);
    },
  },
  '072': {
    text: `Pipelines contain a list of Policies. Policies contain a list of condition-action pairs.
    <br /><br />
    More details on available conditions and policies can be found in the <a href="https://www.express-gateway.io/" target="_blank">Express Gateway Documentation</a>.`,
    selector: '.DetailsPanel .pipelines .CollapsibleProperties.noDividers',
    position: 'right',
    onAfter: cb => {
      document.querySelector('.DetailsPanel .cancel').click();
      setTimeout(cb, 1000);
    },
  },
  '08': {
    title: 'Accessing Gateway Instances',
    text: `All gateways will be accessible via the following domain name pattern:
<br /><br />
<code>http://{gateway-name}-{user-id}-dev.lunchbadger.io</code>
<br /><br />
For example, if your gateway is named "Gateway" and your User ID is "999", your gateway will be accessible at:
<br /><br />
<code>http://gateway-999-dev.lunchbadger.io</code>
`,
    selector: '.Gateway__pipeline0 > div:nth-child(2) > div',
    position: 'left',
    onAfter: cb => {
      document.querySelector('.Entity.Gateway').click();
      setTimeout(cb, 500);
    },
  },
  '091': {
    title: 'Consumer Management',
    text: 'All Gateway Entities contain an icon for accessing Consumer Management. This icon will open up a Consumer Management panel.',
    selector: '.Toolbox__button--customerManagement',
    position: 'left',
    onAfter: cb => {
      document.querySelector('.Entity.Gateway .Toolbox__button--customerManagement').click();
      setTimeout(cb, 1500);
    },
  },
  '092': {
    text: 'Here, you can add Users, Apps, Credentials, and Scopes.',
    selector: '.DetailsPanel .CustomerManagement',
    position: 'top',
    onAfter: cb => {
      document.querySelector('.DetailsPanel .cancel').click();
      setTimeout(() => {
        document.querySelector('.quadrant__title').click();
        setTimeout(cb, 200);
      }, 1500);
    },
  },
  '10': {
    title: 'API Request Flow',
    text: 'When an API request is received, it flows through the LunchBadger Entities defined on the Canvas.',
    selector: '.Entity.Gateway',
    position: 'left',
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
    text: `Now that you\'re armed with the basics of how to use LunchBadger, have fun!
    Feel free to play around with Entities on the Canvas and direct any questions to your LunchBadger Support Team at <a href="mailto:hello@lunchbadger.com" target="_blank">hello@lunchbadger.com</a>.`,
    selector: '.Logo',
    position: 'bottom-left',
  },
};
