module.exports = {
  // '@disabled': true,
  'Connection: proxy model': function (browser) {
    var page = browser.page.lunchBadger();
    var modelSelector = '.quadrant:nth-child(2) .Entity.Model:last-child';
    var gatewaySelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';
    var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint:last-child';
    page.open();
    page.addElement('model');
    browser.waitForElementVisible(modelSelector + '.editable .submit', 60000);
    browser.moveToElement(modelSelector + '.editable .submit', 5, 5, function() {
      browser.click(modelSelector + '.editable .submit');
    });
    browser.waitForElementNotPresent('.canvas__container.canvas__container--editing', 30000);
    page.addElement('gateway');
    browser.waitForElementVisible(gatewaySelector + '.editable .submit', 60000);
    browser.waitForElementVisible(gatewaySelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input', 60000);
    browser.moveToElement(gatewaySelector + '.editable .submit', 5, 5, function() {
      browser.click(gatewaySelector + '.editable .submit');
    });
    browser.waitForElementNotPresent('.canvas__container.canvas__container--editing', 30000);
    browser
      .pause(1000)
      .useCss()
      .moveToElement(modelSelector + ' .port-out > .port__anchor > .port__inside', null, null)
      .mouseButtonDown(0)
      .moveToElement(gatewaySelector + ' .port-in > .port__anchor > .port__inside', null, null)
      .mouseButtonUp(0)
      .pause(1000);
    page.waitForElementVisible(publicEndpointSelector + '.editable', 60000);
    page.expect.element(publicEndpointSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('NewModelPublicEndpoint');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input').to.have.value.that.equals('newmodel');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').to.have.text.that.equals('http://gateway.customer.lunchbadger.com/newmodel');
    page.close();
  }
};
