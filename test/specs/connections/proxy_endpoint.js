module.exports = {
  '@disabled': true, // FIXME: enable when EG will start to work fine
  'Connection: proxy endpoint': function (browser) {
    var page = browser.page.lunchBadger();
    var gatewayName = 'Gateway' + Date.now();
    page.open();
    page.addElementFromTooltip('endpoint', 'serviceendpoint');
    page.submitCanvasEntity(page.getServiceEndpointSelector(1));
    page.addElement('gateway');
    page.setValueSlow(page.getGatewaySelector(1) + ' .input__name input', gatewayName);
    page.submitCanvasEntity(page.getGatewaySelector(1));
    page.waitForElementVisible('.SystemInformationMessages', 5000);
    page.expect.element('.SystemInformationMessages .SystemInformationMessages__item:first-child .SystemInformationMessages__item__message').text.to.equal(gatewayName + ' successfully deployed');
    page.waitForElementNotPresent('.SystemInformationMessages .SystemInformationMessages__item:first-child', 15000);
    page.editEntity(page.getGatewaySelector(1));
    page.click(page.getGatewaySelector(1) + ' .button__add__pipelines0policy');
    page.selectValueSlow(page.getGatewaySelector(1), 'pipelines0policies0name', 'proxy');
    page.submitCanvasEntity(page.getServiceEndpointSelector(1));
    page.connectPorts(page.getServiceEndpointSelector(1), 'out', page.getGatewaySelector(1), 'in');
    page.waitForElementVisible(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 60000);
    page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('ServiceEndpointApiEndpoint');
    page.submitCanvasEntity(page.getApiEndpointSelector(1));
    page.saveProject();

    page.refresh(function () {
      page.checkEntities();
      page.expect.element(page.getServiceEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('ServiceEndpoint');
      page.expect.element(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(gatewayName);
      page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('ServiceEndpointApiEndpoint');
      page.close();
    });
  }
};
