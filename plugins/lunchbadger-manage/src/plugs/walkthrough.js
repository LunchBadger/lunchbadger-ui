import React from 'react';
import {CopyOnHover} from '../../../lunchbadger-ui/src';

export default {
  //   '050': {
  //     title: 'Endpoint Dropdown Menu',
  //     text: `
  // Selecting this icon will reveal available Endpoint Entities.
  // `,
  //     selector: '.Tool.endpoint',
  //     position: 'right',
  //     allowClicksThruHole: false,
  //   },
  //   '051': {
  //     title: 'Service Endpoint Entities',
  //     text: 'These are references to your backend services. Used as Express Gateway service endpoints when connected to a Gateway Entity.',
  //     waitForSelector: '.Tool__submenuItem.serviceendpoint',
  //     position: 'right',
  //     allowClicksThruHole: false,
  //     onBefore: api => [
  //       api.openEntitySubmenu('endpoint'),
  //       api.blockClicks(),
  //     ],
  //     onAfter: api => [
  //       api.unblockClicks(),
  //     ],
  //   },
  //   '060': {
  //     title: 'API Endpoint Entities',
  //     text: 'Used as Express Gateway API Endpoints for clients connecting to Gateway Entities.',
  //     waitForSelector: '.Tool__submenuItem.apiendpoint',
  //     position: 'right',
  //     allowClicksThruHole: false,
  //     onBefore: api => [
  //       api.blockClicks(),
  //     ],
  //     onAfter: api => [
  //       api.unblockClicks(),
  //       api.openEntitySubmenu('endpoint'),
  //     ],
  //   },
  '0700': {
    title: 'Gateway Entities Overview',
    text: `
This icon creates a new Gateway Entity on the canvas with a corresponding Gateway Deployment running in Kubernetes.
<br /><br />
C'mon, click it!`,
    waitForSelector: '.Tool.gateway',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable', false),
    ],
    onBefore: api => [
      api.focus('.Tool.gateway button'),
    ],
  },
  '0701': {
    title: 'Pipeline Overview',
    text: `
Each Gateway Entity exposes microservices built from models, functions, and service endpoints for public consumption as an API.  A Gateway consists of one or more Pipelines.
<br /><br />
A Pipeline is a set of policies that is executed on each API request.
`,
    waitForSelector: '.Entity.Gateway.editable .Gateway',
    position: 'left',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: () => [],
  },
  '0702': {
    title: 'Name the CarPipeline',
    text: `
Let's name the first pipeline <pre>CarPipeline</pre>`,
    waitForSelector: '.Entity.Gateway.editable .input__pipelines0name',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines0name input[value="CarPipeline"]'),
    ],
    onBefore: api => [
      api.focus('.Entity.Gateway.editable .input__pipelines0name input'),
    ],
  },
  '0703': {
    title: 'Add a Second Pipeline',
    text: `
Let's add a second pipeline.
`,
    waitForSelector: '.Entity.Gateway.editable .button__add__Pipelines',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines1name', false),
    ],
    onBefore: api => [
      api.focus('.Entity.Gateway.editable .button__add__Pipelines')
    ],
  },
  '0704': {
    title: 'Add Function Pipeline',
    text: `
Let's name the second pipeline <pre>FunctionPipeline</pre>.
`,
    selector: '.Entity.Gateway.editable .input__pipelines1name',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.Gateway.editable .input__pipelines1name input[value="FunctionPipeline"]'),
    ],
  },
  '0705': {
    title: 'Deploy Gateway',
    text: `
Click <pre>OK</pre> to deploy a gateway.
`,
    waitForSelector: '.Entity.Gateway.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.Gateway.editable'),
      api.setShowOverlay(false),
      api.wait(1000),
      api.setShowOverlay(true),
    ],
    onBefore: api => [
      api.focus('.Entity.Gateway.editable .submit'),
    ],
  },
  '0706': {
    title: 'Gateway is Deploying',
    text: 'Please wait till the <pre>Gateway</pre> is deployed and the walkthrough will continue automatically.',
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
    title: 'Private Quadrant Overview',
    text: 'Model, Service Endpoint, and Function Entities can all be connected to the left-hand side of a Pipeline.',
    waitForSelector: '.quadrant.Private .quadrant__body',
    position: 'right',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0708': {
    title: 'Connect Car Model with CarPipeline',
    text: `
Connect the <pre>Car</pre> Model Entity with the <pre>CarPipeline</pre> by clicking and dragging from one circular port to the other.
`,
    selector: '.Entity.Model .port-out',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    unblockNext: true,
    triggerNext: api => [
      api.addClass('.CanvasElement.Function_ .port-out', 'port__disabled'),
      api.addClass('.Entity.Gateway .Gateway__pipeline1 .port-in', 'port__disabled'),
      api.setHole({
        width: '69px',
        height: '114px',
      }),
      api.waitUntilPresent('.Entity.Model .port-out .port__anchor--connected'),
      api.removeClass('.CanvasElement.Function_ .port-out', 'port__disabled'),
      api.removeClass('.Entity.Gateway .Gateway__pipeline1 .port-in', 'port__disabled'),
    ],
    onPageReload: api => [
      api.disconnectPorts('.Entity.Model .port-out', '.Entity.Gateway .Gateway__pipeline0 .port-in'),
    ],
    onExit: api => [
      api.removeClass('.CanvasElement.Function_ .port-out', 'port__disabled'),
      api.removeClass('.Entity.Gateway .Gateway__pipeline1 .port-in', 'port__disabled'),
    ],
  },
  '0709': {
    title: 'API Endpoint Explanation',
    text: 'When connecting a microservice entity such as a model, function or service-endpoint, for the first time a new API Endpoint Entity is created automatically. API Endpoint Entities define what will be exposed by a Gateway.',
    selector: '.quadrant.Public .quadrant__body',
    position: 'left',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: () => [],
  },
  '0710': {
    title: 'Adding a Path to CarApiEndpoint',
    text: `
Let's add a path.
`,
    waitForSelector: '.Entity.ApiEndpoint.editable .button__add__PATHS',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0', false),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .button__add__PATHS'),
    ],
  },
  '0711': {
    title: 'Setting a Path on CarApiEndpoint',
    text: `
Add the following path: <pre>/cars*</pre>
`,
    waitForSelector: '.Entity.ApiEndpoint.editable .input__paths0',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0 input[value="/cars*"]'),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .input__paths0 input'),
    ],
  },
  '0712': {
    title: 'Create Car API Endpoint',
    text: 'Click <pre>OK</pre> to create the Api Endpoint Entity',
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
    title: 'Connect Function to FunctionPipeline',
    text: `
Connect the <pre>myfunction</pre> Function Entity with the <pre>FunctionPipeline</pre> by clicking and dragging from one circular port to the other.
`,
    selector: '.Entity.Function_ .port-out',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    unblockNext: true,
    triggerNext: api => [
      api.addClass('.CanvasElement.Model .port-out', 'port__disabled'),
      api.addClass('.Entity.Gateway .Gateway__pipeline0 .port-in', 'port__disabled'),
      api.setHole({
        top: -60,
        width: '69px',
        height: '92px',
      }),
      api.waitUntilPresent('.Entity.Function_ .port-out .port__anchor--connected'),
      api.removeClass('.CanvasElement.Model .port-out', 'port__disabled'),
      api.removeClass('.Entity.Gateway .Gateway__pipeline0 .port-in', 'port__disabled'),
    ],
    onPageReload: api => [
      api.disconnectPorts('.Entity.Function_ .port-out', '.Entity.Gateway .Gateway__pipeline1 .port-in'),
    ],
    onExit: api => [
      api.removeClass('.CanvasElement.Model .port-out', 'port__disabled'),
      api.removeClass('.Entity.Gateway .Gateway__pipeline0 .port-in', 'port__disabled'),
    ],
  },
  '0714': {
    title: 'Add a path to FunctionApiEndpoint',
    text: `
Once again, an API Endpoint Entity is created automatically. Let's add a path.
`,
    waitForSelector: '.Entity.ApiEndpoint.editable .button__add__PATHS',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0', false),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .button__add__PATHS'),
    ],
  },
  '0715': {
    title: 'Setting a Path on FunctionApiEndpoint',
    text: `
Add the following path: <pre>/myfunction*</pre>
`,
    waitForSelector: '.Entity.ApiEndpoint.editable .input__paths0',
    position: 'left',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilPresent('.Entity.ApiEndpoint.editable .input__paths0 input[value="/myfunction*"]'),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .input__paths0 input'),
    ],
  },
  '0716': {
    title: 'Create Function API Endpoint',
    text: 'Click <pre>OK</pre> to create the API Endpoint Entity.',
    waitForSelector: '.Entity.ApiEndpoint.editable .submit',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.Entity.ApiEndpoint.editable'),
      api.callGAEvent('Completed'),
    ],
    onBefore: api => [
      api.focus('.Entity.ApiEndpoint.editable .submit'),
    ],
  },
  // '0718': {
  //   text: 'Click this icon to open pipelines details panel',
  //   waitForSelector: '.Entity.Gateway .Toolbox__button--pipelines',
  //   position: 'left',
  //   allowClicksThruHole: true,
  //   triggerNext: api => [
  //     api.waitUntilPresent('.DetailsPanel.visible .BaseDetails.pipelines', false),
  //     api.setShowOverlay(false),
  //     api.setShowTooltip(false),
  //     api.wait(2000),
  //     api.setShowTooltip(true),
  //     api.setShowOverlay(true),
  //   ],
  //   onBefore: api => [
  //     api.click('.Entity.Gateway .EntityHeader'),
  //     api.focus('.Entity.Gateway .Toolbox__button--pipelines'),
  //   ],
  // },
  // '0719': {
  //   text: `Pipelines contain a list of Policies. Policies contain a list of condition-action pairs.
  //   <br /><br />
  //   More details on available conditions and policies can be found in the <a href="https://www.express-gateway.io/" target="_blank">Express Gateway Documentation</a>.`,
  //   waitForSelector: '.DetailsPanel .pipelines .CollapsibleProperties.noDividers',
  //   position: 'bottom',
  //   allowClicksThruHole: false,
  //   onBefore: () => [],
  // },
  // '0720': {
  //   text: 'Click this icon to open Consumer Management details panel',
  //   waitForSelector: '.DetailsPanel .Toolbox__button--customerManagement',
  //   position: 'bottom-right',
  //   allowClicksThruHole: true,
  //   triggerNext: api => [
  //     api.waitUntilPresent('.DetailsPanel .BaseDetails.customerManagement', false),
  //   ],
  //   onBefore: api => [
  //     api.focus('.DetailsPanel .Toolbox__button--customerManagement'),
  //   ],
  // },
  // '0721': {
  //   text: 'Here, you can add Users, Apps, Credentials, and Scopes.',
  //   waitForSelector: '.DetailsPanel .CustomerManagement',
  //   position: 'bottom',
  //   allowClicksThruHole: false,
  //   onBefore: () => [],
  // },
  // '0722': {
  //   text: 'Click <pre>Cancel</pre> to close details panel',
  //   waitForSelector: '.DetailsPanel .cancel',
  //   position: 'top-right',
  //   allowClicksThruHole: true,
  //   triggerNext: api => [
  //     api.waitUntilNotPresent('.DetailsPanel.visible'),
  //     api.setShowOverlay(false),
  //     api.setShowTooltip(false),
  //     api.wait(2000),
  //     api.setShowTooltip(true),
  //     api.setShowOverlay(true),
  //   ],
  //   onBefore: api => [
  //     api.focus('.DetailsPanel .cancel'),
  //   ],
  // },
  '0802': {
    title: 'Accessing Gateways',
    selector: '.Entity.ApiEndpoint .accessUrl',
    position: 'bottom-right',
    allowClicksThruHole: false,
    onBefore: api => [
      api.setStepText(
        <div>
          All gateways will be accessible via the following domain name pattern:
          <code>{'http://{gateway-name}'}-{api.getReplacement('USER_ID')}-dev.lunchbadger.io</code>
          <br />
          Your Gateway will be accessible at:
          <code>
            {api.getReplacement('ROOT_URL')}
          </code>
        </div>
      ),
    ],
  },
  '0803': {
    title: 'API Request Flow',
    text: 'When an API request is received, it flows through the LunchBadger Entities defined on the Canvas.',
    waitForSelector: '.Entity.ApiEndpoint',
    position: 'top',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0804': {
    title: 'Flow through API Endpoint',
    text: 'First, the API request comes in through an API Endpoint.  In this case, that endpoint is /cars.',
    waitForSelector: '.Entity.ApiEndpoint .paths0',
    position: 'bottom-right',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0805': {
    title: 'Flow through Gateway Pipeline',
    text: 'The request is routed to a Gateway Pipeline where it flows through the defined Policies.',
    waitForSelector: '.Entity.Gateway .Gateway__pipeline0',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0806': {
    title: 'Flow through Private Quadrant',
    text: 'The API request then makes its way to an Entity in the Private quadrant (Model, Service Endpoint, or Function). In this example, the request is routed to <pre>Car</pre> Model Entity.',
    waitForSelector: '.Entity.Model',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0807': {
    title: 'Flow to Connector',
    text: 'Finally, if the request is routed to a Model Entity connected to a data source or service through a Connector, the connected data source or service will be queried or updated.',
    waitForSelector: '.Entity.DataSource',
    position: 'bottom-left',
    allowClicksThruHole: false,
    onBefore: () => [],
  },
  '0808': {
    title: 'Accessing an API Endpoint',
    waitForSelector: '.canvas',
    position: 'bottom',
    allowClicksThruHole: false,
    onBefore: api => [
      api.setStepText(
        <div>
          Now that you''ve created your first LunchBadger Project, try interacting with your new endpoints!
          <code>
            <CopyOnHover copy={`curl ${api.getReplacement('ROOT_URL')}/myfunction`}>
              $ curl {api.getReplacement('ROOT_URL')}/myfunction
            </CopyOnHover>
            <br />
            <strong>{'LunchBadger Node.js 8 function'}</strong>
            <br />
            <br />
            <CopyOnHover copy={`curl ${api.getReplacement('ROOT_URL')}/cars -X POST -d "{\\"year\\":${(new Date()).getFullYear()}}" --header "Content-Type: application/json"`}>
              {`$ curl ${api.getReplacement('ROOT_URL')}/cars -X POST -d "{\\"year\\":${(new Date()).getFullYear()}}" --header "Content-Type: application/json"`}
            </CopyOnHover>
            <br />
            <strong>
              {`{"year":${(new Date()).getFullYear()},"id":1}`}
            </strong>
          </code>
        </div>
      )
    ],
  }
};
