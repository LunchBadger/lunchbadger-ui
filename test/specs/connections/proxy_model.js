module.exports = {
  // '@disabled': true,
  'Connection: proxy model': function (browser) {
    var page = browser.page.lunchBadger();
    var modelSelector = '.quadrant:nth-child(2) .Entity.Model:last-child';
    var gatewaySelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';
    var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint:last-child';

    page.open();

    page.addElement('.model.tool');
    browser.pause(1000);
    browser.clearValue(modelSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input');
    browser.setValue(modelSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input', 'test-model');
    browser.click(modelSelector + '.editable button[type=submit]');
    browser.pause(1000);

    page.addElement('.gateway.tool');
    browser.pause(3500);
    browser.clearValue(gatewaySelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input');
    browser.setValue(gatewaySelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input', 'blip-bloop');
    browser.click(gatewaySelector + '.editable button[type=submit]');
    browser.pause(2000);

    browser
      .pause(1000)
      .useCss()
      .moveToElement(modelSelector + ' .port-out > .port__anchor > .port__inside', null, null)
      .mouseButtonDown(0)
      .moveToElement(gatewaySelector + ' .port-in > .port__anchor > .port__inside', null, null)
      .mouseButtonUp(0)
      .pause(1000);

    page.expect.element(publicEndpointSelector + '.editable').to.be.present;
    page.expect.element(publicEndpointSelector + ' .EntityHeader .EntityProperty__field--input').to.have.value.that.equals('ModelPublicEndpoint');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input').to.have.value.that.equals('test-model');
    page.expect.element(publicEndpointSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').to.have.text.that.equals('http://blip-bloop.customer.lunchbadger.com/test-model');


    browser.pause(1500);

    page.close();
  }
};
