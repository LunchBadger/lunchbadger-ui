module.exports = {
  // '@disabled': true,
  'Connection: proxy endpoint': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.addElementFromTooltip('endpoint', 'serviceendpoint');
    page.submitCanvasEntity(page.getServiceEndpointSelector(1));
    page.addElement('gateway');
    page.submitCanvasEntity(page.getGatewaySelector(1));
    page.waitForElementVisible('.SystemInformationMessages', 5000);
    page.expect.element('.SystemInformationMessages .SystemInformationMessages__item:first-child .SystemInformationMessages__item__message').text.to.equal('Gateway successfully deployed');
    page.waitForElementNotPresent('.SystemInformationMessages .SystemInformationMessages__item:first-child', 15000);
    page.editEntity(page.getGatewaySelector(1));
    page.click(page.getGatewaySelector(1) + ' .button__add__pipelines0policy');
    page.selectValueSlow(page.getGatewaySelector(1), 'pipelines0policies0name', 'proxy');
    page.submitCanvasEntity(page.getServiceEndpointSelector(1));
    page.connectPorts(page.getServiceEndpointSelector(1), 'out', page.getGatewaySelector(1), 'in');
    browser.waitForElementVisible(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 60000);
    page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('ServiceEndpointApiEndpoint');
    page.close();
  }
};
