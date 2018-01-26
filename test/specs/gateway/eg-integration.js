const request = require('request');
const SERVICE_ENDPOINT_URL = 'https://api.ipify.org/';
const SERVICE_ENDPOINT_RESPONSE = '188.252.18.27';

module.exports = {
  // '@disabled': true,
  'Gateway: EG integration': function (browser) {
    var page = browser.page.lunchBadger();
    const MEMORY_NAME = page.createUniqueName('memory');
    const MODEL_NAME = page.createUniqueName('car');
    const GATEWAY_NAME = page.createGatewayName();
    const SERVICE_ENDPOINT_NAME = page.createUniqueName('endpoint');
    const API_ENDPOINT_1_NAME = `${MODEL_NAME}ApiEndpoint`;
    const API_ENDPOINT_2_NAME = `${SERVICE_ENDPOINT_NAME}ApiEndpoint`;
    const GATEWAY_MODEL_URL = `http://${GATEWAY_NAME}-test-dev.staging.lunchbadger.io/api/${MODEL_NAME}`;
    const GATEWAY_SERVICE_ENDPOINT_URL = `http://${GATEWAY_NAME}-test-dev.staging.lunchbadger.io/api/${SERVICE_ENDPOINT_NAME}`;
    const url = `http://test-dev.staging.lunchbadger.io/api/${MODEL_NAME}`;
    const model = page.createUniqueName('model');
    const color = page.createUniqueName('color');
    const form = {model, color};
    const expect = JSON.stringify(Object.assign({}, form, {id: 1}));
    page.open();
    page.checkEntities();
    page.addElementFromTooltip('dataSource', 'memory');
    page.setValueSlow(page.getDataSourceSelector(1) + ' .input__name input', MEMORY_NAME);
    page.submitCanvasEntity(page.getDataSourceSelector(1));
    page.addElement('model');
    page.setValueSlow(page.getModelSelector(1) + ' .input__name input', MODEL_NAME);
    page.clickSlow(page.getModelSelector(1) + ' .button__add__Properties', 2);
    page.setValueSlow(page.getModelSelector(1) + ' .input__properties0name input', 'model');
    page.setValueSlow(page.getModelSelector(1) + ' .input__properties1name input', 'color');
    page.submitCanvasEntity(page.getModelSelector(1));
    page.connectPorts(page.getDataSourceSelector(1), 'out', page.getModelSelector(1), 'in');
    page.addElementFromTooltip('endpoint', 'serviceendpoint');
    page.setValueSlow(page.getServiceEndpointSelector(2) + ' .input__name input', SERVICE_ENDPOINT_NAME);
    page.setValueSlow(page.getServiceEndpointSelector(2) + ' .input__urls0 input', SERVICE_ENDPOINT_URL);
    page.submitCanvasEntity(page.getServiceEndpointSelector(2));
    page.addElement('gateway');
    page.setValueSlow(page.getGatewaySelector(1) + ' .input__name input', GATEWAY_NAME);
    page.clickSlow(page.getGatewaySelector(1) + ' .button__add__pipelines0policy');
    page.selectValueSlow(page.getGatewaySelector(1), 'pipelines0policies0name', 'proxy');
    page.clickSlow(page.getGatewaySelector(1) + ' .button__add__Pipelines');
    page.clickSlow(page.getGatewaySelector(1) + ' .button__add__pipelines1policy');
    page.selectValueSlow(page.getGatewaySelector(1), 'pipelines1policies0name', 'proxy');
    page.submitCanvasEntity(page.getGatewaySelector(1));
    page.expect.element(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(GATEWAY_NAME);
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0name').text.to.equal('Pipeline');
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies0name').text.to.equal('proxy');
    page.submitGatewayDeploy(page.getGatewaySelector(1), GATEWAY_NAME);
    page.connectPorts(page.getModelSelector(1), 'out', page.getGatewaySelector(1), 'in', 0);
    page.waitForElementVisible(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 60000);
    page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals(API_ENDPOINT_1_NAME);
    page.clickSlow(page.getApiEndpointSelector(1) + ' .button__add__PATHS');
    page.setValueSlow(page.getApiEndpointSelector(1) + ' .input__paths0 input', `/api/${MODEL_NAME}*`);
    page.submitCanvasEntity(page.getApiEndpointSelector(1));
    page.connectPorts(page.getServiceEndpointSelector(2), 'out', page.getGatewaySelector(1), 'in', 1);
    page.waitForElementVisible(page.getApiEndpointSelector(2) + ' .EntityHeader .EntityProperty__field--input input', 60000);
    page.expect.element(page.getApiEndpointSelector(2) + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals(API_ENDPOINT_2_NAME);
    page.clickSlow(page.getApiEndpointSelector(2) + ' .button__add__PATHS');
    page.setValueSlow(page.getApiEndpointSelector(2) + ' .input__paths0 input', '/');
    page.submitCanvasEntity(page.getApiEndpointSelector(2));
    page.saveProject();
    page.api.pause(5000);
    page.refresh(function () {
      request.put({url, form}, (err, res, putBody) => {
        page.assert.equal(putBody, expect);
        request(GATEWAY_MODEL_URL, function (errModel, resModel, getModelBody) {
          page.assert.equal(getModelBody, `[${expect}]`);
          request(GATEWAY_SERVICE_ENDPOINT_URL, function (errSE, resSE, getServiceEndpointBody) {
            page.assert.equal(getServiceEndpointBody, SERVICE_ENDPOINT_RESPONSE);
            page.close(true);
          });
        });
      });
    });
  }
};
