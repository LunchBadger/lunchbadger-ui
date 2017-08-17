var page;
var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint';
var apiSelector = '.quadrant:nth-child(4) .Entity.API';

module.exports = {
  // '@disabled': true,
  'API: bundle endpoint - accept': function (browser) {
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
    browser.waitForElementPresent('.modal__actions__button--confirm', 10000);
    browser.click('.modal__actions__button--confirm', function () {
      browser.waitForElementNotPresent(publicEndpointSelector + ':last-child', 30000);
      browser.waitForElementPresent(apiSelector + ':last-child .EntitySubElements__main .public-endpoint', 30000);
    });
    page.close();
  }
};
