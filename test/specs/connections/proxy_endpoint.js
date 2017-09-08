module.exports = {
  // '@disabled': true,
  'Connection: proxy endpoint': function (browser) {
    var page = browser.page.lunchBadger();
    var privateEndpointSelector = '.quadrant:nth-child(2) .Entity.PrivateEndpoint:last-child';
    var gatewaySelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';
    var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint.editable';
    page.open();
    page.addElementFromTooltip('endpoint', 'privateendpoint');
    page.submitCanvasEntity(privateEndpointSelector);
    page.addElement('gateway');
    page.submitCanvasEntity(gatewaySelector);
    page.connectPorts(privateEndpointSelector, 'out', gatewaySelector, 'in');
    browser.waitForElementVisible(publicEndpointSelector, 60000);
    page.expect.element(publicEndpointSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('PrivateEndpointPublicEndpoint');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input').to.have.value.that.equals('privateendpoint');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').to.have.text.that.equals('http://gateway.customer.lunchbadger.com/privateendpoint');
    page.close();
  }
};
