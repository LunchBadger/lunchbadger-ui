var page;
var entitySelector;
var entitySelector2;

module.exports = {
  '@disabled': true,
  'Service Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getServiceEndpointSelector(1);
    entitySelector2 = page.getServiceEndpointSelector(2);
    page
      .open()
      .addElementFromTooltip('endpoint', 'serviceendpoint')
      .waitForElementPresent('.endpoint.Tool.selected', 8000)
      .submitCanvasEntity(entitySelector)
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'ServiceEndpoint',
          [`${entitySelector} .urls0 .EntityProperty__field--text`]: 'http://example.org'
        },
        notPresent: [
          `${entitySelector} .urls1`
        ]
      });
  },
  'Service Endpoint: unique name check': function () {
    page
      .addElementFromTooltip('endpoint', 'serviceendpoint')
      .expectUniqueNameError(entitySelector2, 'A service endpoint');
  },
  'Service Endpoint: add urls': function () {
    page
      .editEntity(entitySelector)
      .setValueSlow(entitySelector + ' .input__name input', 'Cars')
      .clickPresent(entitySelector + ' .button__add__URL')
      .setValueSlow(entitySelector + ' .input__urls1 input', 'http://service/car')
      .clickPresent(entitySelector + ' .button__add__URLS')
      .setValueSlow(entitySelector + ' .input__urls2 input', 'http://service/driver')
      .submitCanvasEntity(entitySelector)
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'Cars',
          [`${entitySelector} .urls0 .EntityProperty__field--text`]: 'http://example.org',
          [`${entitySelector} .urls1 .EntityProperty__field--text`]: 'http://service/car',
          [`${entitySelector} .urls2 .EntityProperty__field--text`]: 'http://service/driver'
        },
        notPresent: [
          `${entitySelector} .urls3`
        ]
      });
  },
  'Service endpoint: remove url': function () {
    page
      .editEntity(entitySelector)
      .clickVisibleOnHover(entitySelector + ' .input__urls1', entitySelector + ' .button__remove__urls1')
      .waitForElementNotVisible(entitySelector + ' .button__remove__urls0', 5000)
      .submitCanvasEntity(entitySelector)
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'Cars',
          [`${entitySelector} .urls0 .EntityProperty__field--text`]: 'http://example.org',
          [`${entitySelector} .urls1 .EntityProperty__field--text`]: 'http://service/driver'
        },
        notPresent: [
          `${entitySelector} .urls2`
        ]
      });
  },
  'Service endpoint: remove': function () {
    page
      .removeEntity(entitySelector)
      .close();
  }
};
