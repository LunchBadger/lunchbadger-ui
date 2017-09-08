module.exports = {
  // '@disabled': true,
  'Connection: proxy model': function (browser) {
    var page = browser.page.lunchBadger();
    var modelSelector = '.quadrant:nth-child(2) .Entity.Model:last-child';
    var gatewaySelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';
    var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint.editable';
    page.open();
    page.addElement('model');
    page.submitCanvasEntity(modelSelector);
    page.addElement('gateway');
    page.submitCanvasEntity(gatewaySelector);
    page.connectPorts(modelSelector, 'out', gatewaySelector, 'in');
    page.waitForElementVisible(publicEndpointSelector, 60000);
    page.expect.element(publicEndpointSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('NewModelPublicEndpoint');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input').to.have.value.that.equals('newmodel');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').to.have.text.that.equals('http://gateway.customer.lunchbadger.com/newmodel');
    page.close();
  }
};
