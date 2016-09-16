module.exports = {
  // '@disabled': true,
  'Connection: proxy model': function (browser) {
    var page = browser.page.lunchBadger();
    var modelSelector = '.quadrant:nth-child(2) .canvas-element.Model:last-child';
    var gatewaySelector = '.quadrant:nth-child(3) .canvas-element.Gateway:last-child';
    var publicEndpointSelector = '.quadrant:nth-child(4) .canvas-element.PublicEndpoint:last-child';

    page.open();

    page.addElement('.model.tool');
    browser.pause(500);
    browser.clearValue(modelSelector + ' .canvas-element__properties__property:first-child .canvas-element__input');
    browser.setValue(modelSelector + ' .canvas-element__properties__property:first-child .canvas-element__input', 'test-model');
    browser.click(modelSelector + '.editable .canvas-element__button');
    browser.pause(1000);

    page.addElement('.gateway.tool');
    browser.pause(3500);
    browser.clearValue(gatewaySelector + ' .canvas-element__properties__property:nth-child(2) .canvas-element__input');
    browser.setValue(gatewaySelector + ' .canvas-element__properties__property:nth-child(2) .canvas-element__input', 'blip-bloop');
    browser.click(gatewaySelector + '.editable .canvas-element__button');
    browser.pause(2000);

    browser
      .pause(500)
      .useCss()
      .moveToElement(modelSelector + ' .port-out > .port__anchor > .port__inside', null, null)
      .mouseButtonDown(0)
      .moveToElement(gatewaySelector + ' .port-in > .port__anchor > .port__inside', null, null)
      .mouseButtonUp(0)
      .pause(500);

    page.expect.element(publicEndpointSelector + '.editable').to.be.present;
    page.expect.element(publicEndpointSelector + ' .canvas-element__title .canvas-element__input').to.have.value.that.equals('Model Public Endpoint');
    page.expect.element(publicEndpointSelector + ' .canvas-element__properties__property .canvas-element__input').to.have.value.that.equals('test-model');
    page.expect.element(publicEndpointSelector + ' .canvas-element__properties__property .canvas-element__properties__property-value').to.have.text.that.equals('http://blip-bloop.customer.lunchbadger.com/test-model');


    browser.pause(1500);

    page.close();
  }
};
