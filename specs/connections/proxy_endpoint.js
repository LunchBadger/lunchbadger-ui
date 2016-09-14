module.exports = {
  // '@disabled': true,
  'Connection: proxy endpoint': function (browser) {
    var page = browser.page.lunchBadger();
    var privateEndpointSelector = '.quadrant:nth-child(2) .canvas-element.PrivateEndpoint:last-child';
    var gatewaySelector = '.quadrant:nth-child(3) .canvas-element.Gateway:last-child';
    var publicEndpointSelector = '.quadrant:nth-child(4) .canvas-element.PublicEndpoint:last-child';

    page.open();

    page.addElementFromTooltip('.endpoint.tool', 1);
    browser.pause(500);
    browser.clearValue(privateEndpointSelector + ' .canvas-element__properties__property:first-child .canvas-element__input');
    browser.setValue(privateEndpointSelector + ' .canvas-element__properties__property:first-child .canvas-element__input', 'test-endpoint');
    browser.click(privateEndpointSelector + '.editable .canvas-element__button');
    browser.pause(1000);

    page.addElement('.gateway.tool');
    browser.pause(3500);
    browser.clearValue(gatewaySelector + ' .canvas-element__properties__property:first-child .canvas-element__input');
    browser.setValue(gatewaySelector + ' .canvas-element__properties__property:first-child .canvas-element__input', 'https://lunchbadger.test');
    browser.click(gatewaySelector + '.editable .canvas-element__add');
    browser.click(gatewaySelector + '.editable .canvas-element__button');
    browser.pause(1000);

    browser
      .pause(500)
      .useCss()
      .moveToElement(privateEndpointSelector + ' .port-out > .port__anchor > .port__inside', null, null)
      .mouseButtonDown(0)
      .moveToElement(gatewaySelector + ' .port-in > .port__anchor > .port__inside', null, null)
      .mouseButtonUp(0)
      .pause(500);

    page.expect.element(publicEndpointSelector + '.editable').to.be.present;
    page.expect.element(publicEndpointSelector + ' .canvas-element__title .canvas-element__input').to.have.value.that.equals('Public Endpoint');
    page.expect.element(publicEndpointSelector + ' .canvas-element__properties__property .canvas-element__input').to.have.value.that.equals('https://lunchbadger.test/test-endpoint');

    browser.pause(1500);

    page.close();
  }
};
