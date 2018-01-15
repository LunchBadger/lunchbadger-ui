module.exports = {
  '@disabled': true,
  'API: bundle endpoint - accept': function (browser) {
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
    browser.waitForElementPresent('.ConfirmModal .confirm', 10000);
    browser.click('.ConfirmModal .confirm', function () {
      browser.waitForElementNotPresent(page.getApiEndpointSelector(2), 30000);
      browser.waitForElementPresent(page.getApiSelector(1) + ' .EntitySubElements__main .api-endpoint', 30000);
    });
    page.close();
  }
};
