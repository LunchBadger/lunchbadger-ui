const request = require('request');

var page;
var memorySelector;
var modelSelector;
var serviceEndpointSelector;
var gatewaySelector;
var apiEndpointModelSelector;
var apiEndpointServiceEndpointSelector;
var SERVICE_ENDPOINT_URL = 'https://api.ipify.org/';
var SERVICE_ENDPOINT_RESPONSE = '54.221.82.10';
var MEMORY_NAME;
var MODEL_NAME;
var GATEWAY_NAME;
var SERVICE_ENDPOINT_NAME;
var API_ENDPOINT_1_NAME;
var API_ENDPOINT_2_NAME;
var GATEWAY_MODEL_URL;
var GATEWAY_SERVICE_ENDPOINT_URL;
var url;
var model;
var color;
var form;
var expectedModelJSON;

module.exports = {
  // '@disabled': true,
  'EG integration: add datasource': function (browser) {
    page = browser.page.lunchBadger();
    memorySelector = page.getDataSourceSelector(1);
    modelSelector = page.getModelSelector(1);
    serviceEndpointSelector = page.getServiceEndpointSelector(2);
    gatewaySelector = page.getGatewaySelector(1);
    apiEndpointModelSelector = page.getApiEndpointSelector(1);
    apiEndpointServiceEndpointSelector = page.getApiEndpointSelector(2);
    MEMORY_NAME = page.getUniqueName('memory');
    MODEL_NAME = page.getUniqueName('car');
    GATEWAY_NAME = page.getUniqueName('gateway');
    SERVICE_ENDPOINT_NAME = page.getUniqueName('endpoint');
    API_ENDPOINT_1_NAME = `${MODEL_NAME}ApiEndpoint`;
    API_ENDPOINT_2_NAME = `${SERVICE_ENDPOINT_NAME}ApiEndpoint`;
    GATEWAY_MODEL_URL = `http://${GATEWAY_NAME}-test-dev.staging.lunchbadger.io/api/${MODEL_NAME}`;
    GATEWAY_SERVICE_ENDPOINT_URL = `http://${GATEWAY_NAME}-test-dev.staging.lunchbadger.io`;
    url = `http://test-dev.staging.lunchbadger.io/api/${MODEL_NAME}`;
    model = page.getUniqueName('model');
    color = page.getUniqueName('color');
    form = {model, color};
    expectedModelJSON = JSON.stringify(Object.assign({}, form, {id: 1}));
    page
      .open()
      .addElementFromTooltip('dataSource', 'memory')
      .setValueSlow(memorySelector + ' .input__name input', MEMORY_NAME)
      .submitCanvasEntity(memorySelector);
  },
  'EG integration: add model': function () {
    page
      .addElement('model')
      .setValueSlow(modelSelector + ' .input__name input', MODEL_NAME)
      .clickPresent(modelSelector + ' .button__add__Properties')
      .setValueSlow(modelSelector + ' .input__properties0name input', 'model')
      .clickPresent(modelSelector + ' .button__add__Properties')
      .setValueSlow(modelSelector + ' .input__properties1name input', 'color')
      .submitCanvasEntity(modelSelector);
  },
  'EG integration: connect datasource and model': function () {
    page
      .connectPorts(memorySelector, 'out', modelSelector, 'in');
  },
  'EG integration: add service endpoint': function () {
    page
      .addElementFromTooltip('endpoint', 'serviceendpoint')
      .setValueSlow(serviceEndpointSelector + ' .input__name input', SERVICE_ENDPOINT_NAME)
      .setValueSlow(serviceEndpointSelector + ' .input__urls0 input', SERVICE_ENDPOINT_URL)
      .submitCanvasEntity(serviceEndpointSelector);
  },
  'EG integration: deploy gateway': function () {
    page
      .addElement('gateway')
      .setValueSlow(gatewaySelector + ' .input__name input', GATEWAY_NAME)
      .clickPresent(gatewaySelector + ' .button__add__pipelines0policy')
      .selectValueSlow(gatewaySelector, 'pipelines0policies0name', 'proxy')
      .submitGatewayDeploy(gatewaySelector, GATEWAY_NAME)
      .editEntity(gatewaySelector)
      .clickPresent(gatewaySelector + ' .button__add__Pipelines')
      .check({
        value: {
          [`${gatewaySelector} .name input`]: GATEWAY_NAME,
          [`${gatewaySelector} .pipelines0name input`]: 'Pipeline',
          [`${gatewaySelector} .pipelines1name input`]: 'Pipeline'
        },
        present: [
          `${gatewaySelector} .select__pipelines0policies0name .pipelines0policies0name__proxy`
        ]
      })
      .clickPresent(gatewaySelector + ' .button__add__pipelines1policy')
      .check({
        value: {
          [`${gatewaySelector} .name input`]: GATEWAY_NAME,
          [`${gatewaySelector} .pipelines0name input`]: 'Pipeline',
          [`${gatewaySelector} .pipelines1name input`]: 'Pipeline'
        },
        present: [
          `${gatewaySelector} .select__pipelines0policies0name .pipelines0policies0name__proxy`,
          `${gatewaySelector} .select__pipelines1policies0name .pipelines1policies0name__basic-auth`
        ]
      })
      .selectValueSlow(gatewaySelector, 'pipelines1policies0name', 'proxy')
      .submitCanvasEntity(gatewaySelector)
      .check({
        text: {
          [`${gatewaySelector} .EntityHeader .EntityProperty__field--text`]: GATEWAY_NAME,
          [`${gatewaySelector} .pipelines0name`]: 'Pipeline',
          [`${gatewaySelector} .pipelines0policies0name`]: 'proxy',
          [`${gatewaySelector} .pipelines1name`]: 'Pipeline',
          [`${gatewaySelector} .pipelines1policies0name`]: 'proxy'
        }
      })
      .connectPorts(modelSelector, 'out', gatewaySelector, 'in', 0)
      .waitForElementVisible(apiEndpointModelSelector + ' .EntityHeader .EntityProperty__field--input input', 60000)
      .check({
        value: {
          [`${apiEndpointModelSelector} .EntityHeader .EntityProperty__field--input input`]: API_ENDPOINT_1_NAME
        }
      })
      .clickPresent(apiEndpointModelSelector + ' .button__add__PATHS')
      .setValueSlow(apiEndpointModelSelector + ' .input__paths0 input', `/api/${MODEL_NAME}*`)
      .submitCanvasEntity(apiEndpointModelSelector)
      .connectPorts(serviceEndpointSelector, 'out', gatewaySelector, 'in', 1)
      .waitForElementVisible(apiEndpointServiceEndpointSelector + ' .EntityHeader .EntityProperty__field--input input', 60000)
      .check({
        value: {
          [`${apiEndpointServiceEndpointSelector} .EntityHeader .EntityProperty__field--input input`]: API_ENDPOINT_2_NAME
        },
        equal: [
          [url, url],
          [GATEWAY_MODEL_URL, GATEWAY_MODEL_URL],
          [GATEWAY_SERVICE_ENDPOINT_URL, GATEWAY_SERVICE_ENDPOINT_URL]
        ]
      })
      .clickPresent(apiEndpointServiceEndpointSelector + ' .button__add__PATHS')
      .setValueSlow(apiEndpointServiceEndpointSelector + ' .input__paths0 input', '/')
      .submitCanvasEntity(apiEndpointServiceEndpointSelector)
      .saveProject()
      .pause(30000);
  },
  'EG integration: api calls': function () {
    page
      .waitForElementNotPresent(gatewaySelector + '.semitransparent', 60000);
    request.put({url, form}, (err, res, putBody) => {
      page
        .check({
          equal: [[putBody, expectedModelJSON]]
        });
      request(GATEWAY_MODEL_URL, function (errModel, resModel, getModelBody) {
        page
          .check({
            equal: [[getModelBody, `[${expectedModelJSON}]`]]
          });
        request(GATEWAY_SERVICE_ENDPOINT_URL, function (errSE, resSE, getServiceEndpointBody) {
          page
            .check({
              equal: [[getServiceEndpointBody, SERVICE_ENDPOINT_RESPONSE]]
            });
        });
      });
    });
  },
  after: function () {
    page
      .pause(10000)
      .close();
  }
};
