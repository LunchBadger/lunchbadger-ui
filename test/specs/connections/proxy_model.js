module.exports = {
  // '@disabled': true,
  'Connection: proxy model': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.addElement('model');
    page.submitCanvasEntity(page.getModelSelector(1));
    page.addElement('gateway');
    page.submitCanvasEntity(page.getGatewaySelector(1));
    page.connectPorts(page.getModelSelector(1), 'out', page.getGatewaySelector(1), 'in');
    page.waitForElementVisible(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 60000);
    page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('NewModelApiEndpoint');
    page.close();
  }
};
