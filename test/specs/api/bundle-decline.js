module.exports = {
  '@disabled': true, // FIXME enable when monetize plugin will be turned on
  'API: bundle endpoint - decline': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.addElement('api');
    page.submitCanvasEntity(page.getApiSelector(1));
    page.addElementFromTooltip('endpoint', 'apiendpoint');
    page.submitCanvasEntity(page.getApiEndpointSelector(2));
    page.dragDropElement(
      page.getApiEndpointSelector(2),
      page.getApiSelector(1) + ' .canvas-element__drop-placeholder'
    );
    browser.waitForElementPresent('.ConfirmModal .discard', 10000);
    browser.click('.ConfirmModal .discard', function () {
      browser.waitForElementPresent(page.getApiEndpointSelector(2), 30000);
      browser.waitForElementNotPresent(page.getApiSelector(1) + ' .EntitySubElements__main .api-endpoint', 30000);
    });
    page.close();
  }
};
