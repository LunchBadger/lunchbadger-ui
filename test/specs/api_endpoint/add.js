var page;

module.exports = {
  // '@disabled': true,
  'Api Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.addElementFromTooltip('endpoint', 'apiendpoint');
    page.submitCanvasEntity(page.getApiEndpointSelector(1));
    browser.waitForElementPresent(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text', 5000);
    page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('ApiEndpoint');
    page.expect.element(page.getApiEndpointSelector(1) + ' .host .EntityProperty__field--text').text.to.equal('*');
    page.waitForElementNotPresent(page.getApiEndpointSelector(1) + ' .paths0', 5000);
    page.saveProject();

    page.refresh(function () {
      page.checkEntities();
      page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('ApiEndpoint');
      page.expect.element(page.getApiEndpointSelector(1) + ' .host .EntityProperty__field--text').text.to.equal('*');
      page.waitForElementNotPresent(page.getApiEndpointSelector(1) + ' .paths0', 5000);

      page.editEntity(page.getApiEndpointSelector(1));
      page.setValueSlow(page.getApiEndpointSelector(1) + ' .input__name input', 'Cars');
      page.setValueSlow(page.getApiEndpointSelector(1) + ' .input__host input', '*.cars.com');
      page.click(page.getApiEndpointSelector(1) + ' .button__add__PATHS');
      page.click(page.getApiEndpointSelector(1) + ' .button__add__PATHS');
      page.setValueSlow(page.getApiEndpointSelector(1) + ' .input__paths0 input', '/cars');
      page.setValueSlow(page.getApiEndpointSelector(1) + ' .input__paths1 input', '/buses');
      page.submitCanvasEntity(page.getApiEndpointSelector(1));
      page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Cars');
      page.expect.element(page.getApiEndpointSelector(1) + ' .host .EntityProperty__field--text').text.to.equal('*.cars.com');
      page.expect.element(page.getApiEndpointSelector(1) + ' .paths0 .EntityProperty__field--text').text.to.equal('/cars');
      page.expect.element(page.getApiEndpointSelector(1) + ' .paths1 .EntityProperty__field--text').text.to.equal('/buses');
      page.waitForElementNotPresent(page.getApiEndpointSelector(1) + ' .paths2', 5000);
      page.saveProject();

      page.refresh(function () {
        page.checkEntities();
        page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Cars');
        page.expect.element(page.getApiEndpointSelector(1) + ' .host .EntityProperty__field--text').text.to.equal('*.cars.com');
        page.expect.element(page.getApiEndpointSelector(1) + ' .paths0 .EntityProperty__field--text').text.to.equal('/cars');
        page.expect.element(page.getApiEndpointSelector(1) + ' .paths1 .EntityProperty__field--text').text.to.equal('/buses');
        page.waitForElementNotPresent(page.getApiEndpointSelector(1) + ' .paths2', 5000);

        page.editEntity(page.getApiEndpointSelector(1));
        page.click(page.getApiEndpointSelector(1) + ' .button__remove__paths1');
        page.submitCanvasEntity(page.getApiEndpointSelector(1));
        page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Cars');
        page.expect.element(page.getApiEndpointSelector(1) + ' .host .EntityProperty__field--text').text.to.equal('*.cars.com');
        page.expect.element(page.getApiEndpointSelector(1) + ' .paths0 .EntityProperty__field--text').text.to.equal('/cars');
        page.waitForElementNotPresent(page.getApiEndpointSelector(1) + ' .paths1', 5000);
        page.saveProject();

        page.refresh(function () {
          page.checkEntities();
          page.expect.element(page.getApiEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Cars');
          page.expect.element(page.getApiEndpointSelector(1) + ' .host .EntityProperty__field--text').text.to.equal('*.cars.com');
          page.expect.element(page.getApiEndpointSelector(1) + ' .paths0 .EntityProperty__field--text').text.to.equal('/cars');
          page.waitForElementNotPresent(page.getApiEndpointSelector(1) + ' .paths1', 5000);
        });
      });
    });
  },

  after: function () {
    page.close();
  }
};
