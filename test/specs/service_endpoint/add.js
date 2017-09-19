var page;

module.exports = {
  // '@disabled': true,
  'Service Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.addElementFromTooltip('endpoint', 'serviceendpoint');
    page.submitCanvasEntity(page.getServiceEndpointSelector(1));
    browser.waitForElementPresent(page.getServiceEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text', 5000);
    page.expect.element(page.getServiceEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('ServiceEndpoint');
    page.expect.element(page.getServiceEndpointSelector(1) + ' .urls0 .EntityProperty__field--text').text.to.equal('http://service/endpoint');
    page.waitForElementNotPresent(page.getServiceEndpointSelector(1) + ' .urls1', 5000);
    page.saveProject();

    browser.refresh(function () {
      page.checkEntities();
      page.expect.element(page.getServiceEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('ServiceEndpoint');
      page.expect.element(page.getServiceEndpointSelector(1) + ' .urls0 .EntityProperty__field--text').text.to.equal('http://service/endpoint');
      page.waitForElementNotPresent(page.getServiceEndpointSelector(1) + ' .urls1', 5000);

      page.editEntity(page.getServiceEndpointSelector(1));
      page.setValueSlow(page.getServiceEndpointSelector(1) + ' .input__name input', 'Cars');
      page.click(page.getServiceEndpointSelector(1) + ' .button__add__URL');
      page.click(page.getServiceEndpointSelector(1) + ' .button__add__URLS');
      page.setValueSlow(page.getServiceEndpointSelector(1) + ' .input__urls1 input', 'http://service/car');
      page.setValueSlow(page.getServiceEndpointSelector(1) + ' .input__urls2 input', 'http://service/driver');
      page.submitCanvasEntity(page.getServiceEndpointSelector(1));
      page.expect.element(page.getServiceEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Cars');
      page.expect.element(page.getServiceEndpointSelector(1) + ' .urls0 .EntityProperty__field--text').text.to.equal('http://service/endpoint');
      page.expect.element(page.getServiceEndpointSelector(1) + ' .urls1 .EntityProperty__field--text').text.to.equal('http://service/car');
      page.expect.element(page.getServiceEndpointSelector(1) + ' .urls2 .EntityProperty__field--text').text.to.equal('http://service/driver');
      page.waitForElementNotPresent(page.getServiceEndpointSelector(1) + ' .urls3', 5000);
      page.saveProject();

      browser.refresh(function () {
        page.checkEntities();
        page.expect.element(page.getServiceEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Cars');
        page.expect.element(page.getServiceEndpointSelector(1) + ' .urls0 .EntityProperty__field--text').text.to.equal('http://service/endpoint');
        page.expect.element(page.getServiceEndpointSelector(1) + ' .urls1 .EntityProperty__field--text').text.to.equal('http://service/car');
        page.expect.element(page.getServiceEndpointSelector(1) + ' .urls2 .EntityProperty__field--text').text.to.equal('http://service/driver');
        page.waitForElementNotPresent(page.getServiceEndpointSelector(1) + ' .urls3', 5000);

        page.editEntity(page.getServiceEndpointSelector(1));
        page.click(page.getServiceEndpointSelector(1) + ' .button__remove__urls2');
        page.waitForElementNotVisible(page.getServiceEndpointSelector(1) + ' .button__remove__urls0', 5000);
        page.submitCanvasEntity(page.getServiceEndpointSelector(1));
        page.expect.element(page.getServiceEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Cars');
        page.expect.element(page.getServiceEndpointSelector(1) + ' .urls0 .EntityProperty__field--text').text.to.equal('http://service/endpoint');
        page.expect.element(page.getServiceEndpointSelector(1) + ' .urls1 .EntityProperty__field--text').text.to.equal('http://service/car');
        page.waitForElementNotPresent(page.getServiceEndpointSelector(1) + ' .urls2', 5000);
        page.saveProject();

        browser.refresh(function () {
          page.checkEntities();
          page.expect.element(page.getServiceEndpointSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Cars');
          page.expect.element(page.getServiceEndpointSelector(1) + ' .urls0 .EntityProperty__field--text').text.to.equal('http://service/endpoint');
          page.expect.element(page.getServiceEndpointSelector(1) + ' .urls1 .EntityProperty__field--text').text.to.equal('http://service/car');
          page.waitForElementNotPresent(page.getServiceEndpointSelector(1) + ' .urls2', 5000);
        });
      });
    });
  },

  after: function () {
    page.close();
  }
};
