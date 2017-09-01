module.exports = {
  '@disabled': true,
  'Connection: proxy endpoint': function (browser) {
    var page = browser.page.lunchBadger();
    var privateEndpointSelector = '.quadrant:nth-child(2) .Entity.PrivateEndpoint:last-child';
    var gatewaySelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';
    var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint:last-child';
    page.open();
    page.addElementFromTooltip('endpoint', 'privateendpoint');
    browser.waitForElementVisible(privateEndpointSelector + '.editable:not(.wip)', 30000);
    browser.submitForm(privateEndpointSelector + '.editable form');
    browser.waitForElementNotPresent('.canvas__container.canvas__container--editing', 30000);
    page.addElement('gateway');
    browser.waitForElementVisible(gatewaySelector + '.editable:not(.wip)', 120000);
    browser.submitForm(gatewaySelector + '.editable form');
    browser.waitForElementNotPresent('.canvas__container.canvas__container--editing', 30000);
    browser
      .pause(500)
      .useCss()
      .moveToElement(privateEndpointSelector + ' .port-out > .port__anchor > .port__inside', null, null)
      .mouseButtonDown(0)
      .moveToElement(gatewaySelector + ' .port-in > .port__anchor > .port__inside', null, null)
      .pause(500)
      .mouseButtonUp(0)
      .pause(1500);
    browser.waitForElementVisible(publicEndpointSelector + '.editable', 60000);
    page.expect.element(publicEndpointSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('PrivateEndpointPublicEndpoint');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input').to.have.value.that.equals('privateendpoint');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').to.have.text.that.equals('http://gateway.customer.lunchbadger.com/privateendpoint');
    page.close();
  }
};
