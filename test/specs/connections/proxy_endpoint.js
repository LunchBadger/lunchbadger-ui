module.exports = {
  // '@disabled': true,
  'Connection: proxy endpoint': function (browser) {
    var page = browser.page.lunchBadger();
    var privateEndpointSelector = '.quadrant:nth-child(2) .Entity.PrivateEndpoint:last-child';
    var gatewaySelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';
    var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint:last-child';
    page.open();
    page.addElementFromTooltip('endpoint', 'privateendpoint');
    browser.waitForElementPresent(privateEndpointSelector + '.editable:not(.wip)', 30000);
    browser.clearValue(privateEndpointSelector + ' .EntityHeader .EntityProperty__field--input input');
    browser.setValue(privateEndpointSelector + ' .EntityHeader .EntityProperty__field--input input', 'FooBar');
    browser.submitForm(privateEndpointSelector + '.editable form');
    browser.waitForElementNotPresent('.canvas__container.canvas__container--editing', 30000);
    page.addElement('gateway');
    browser.waitForElementPresent(gatewaySelector + '.editable:not(.wip)', 30000);
    browser.clearValue(gatewaySelector + ' .EntityProperty:nth-child(2) .EntityProperty__field--input input');
    browser.setValue(gatewaySelector + ' .EntityProperty:nth-child(2) .EntityProperty__field--input input', 'blip-bloop');
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
    page.expect.element(publicEndpointSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('FooBarPublicEndpoint');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input').to.have.value.that.equals('foobar');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').to.have.text.that.equals('http://blip-bloop.customer.lunchbadger.com/foobar');
    page.close();
  }
};
