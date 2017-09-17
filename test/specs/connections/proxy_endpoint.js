module.exports = {
  // '@disabled': true,
  'Connection: proxy endpoint': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.addElementFromTooltip('endpoint', 'serviceendpoint');
    page.submitCanvasEntity(page.getServiceEndpointSelector(1));
    page.addElement('gateway');
    page.submitCanvasEntity(page.getGatewaySelector(1));
    page.connectPorts(page.getServiceEndpointSelector(1), 'out', page.getGatewaySelector(1), 'in');
    browser.waitForElementVisible(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 60000);
    page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('ServiceEndpointApiEndpoint');
    page.close();
  }
};
