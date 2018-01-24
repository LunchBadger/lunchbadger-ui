module.exports = {
  '@disabled': true, // FIXME: enable when EG will start to work fine
  'Connection: proxy model': function (browser) {
    var page = browser.page.lunchBadger();
    const gatewayName = 'Gateway' + Date.now();
    page.open();
    page.addElement('model');
    page.submitCanvasEntity(page.getModelSelector(1));
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
    page.connectPorts(page.getModelSelector(1), 'out', page.getGatewaySelector(1), 'in');
    page.waitForElementVisible(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 60000);
    page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('NewModelApiEndpoint');
    page.submitCanvasEntity(page.getApiEndpointSelector(1));
    page.saveProject();

    page.refresh(function () {
      page.checkEntities();
      page.expect.element(page.getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('NewModel');
      page.expect.element(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(gatewayName);
      page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('NewModelApiEndpoint');
      page.close();
    });
  }
};
