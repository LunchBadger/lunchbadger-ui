var page;
var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint';
var apiSelector = '.quadrant:nth-child(4) .Entity.API';

module.exports = {
  // '@disabled': true,
  'API: bundle endpoint - decline': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.addElement('api');
    browser.waitForElementPresent(apiSelector + '.editable', 30000);
    browser.submitForm(apiSelector + '.editable form');
    browser.waitForElementNotPresent('.canvas__container.canvas__container--editing', 30000);
    browser.waitForElementNotPresent('modal__body', 3000);
    page.addElementFromTooltip('endpoint', 'publicendpoint');
    browser.waitForElementPresent(publicEndpointSelector + '.editable', 30000);
    browser.submitForm(publicEndpointSelector + '.editable form');
    browser.waitForElementNotPresent('.canvas__container.canvas__container--editing', 30000);
    page.dragDropElement(
      publicEndpointSelector + ':last-child',
      apiSelector + ':nth-last-child(2) .canvas-element__drop-placeholder'
    );
    browser.waitForElementPresent('.ConfirmModal .discard', 10000);
    browser.click('.ConfirmModal .discard', function () {
      browser.waitForElementPresent(publicEndpointSelector + ':last-child', 30000);
      browser.waitForElementNotPresent(apiSelector + ':last-child .EntitySubElements__main .public-endpoint', 30000);
    });
    page.close();
  }
};
