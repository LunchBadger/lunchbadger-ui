var page;
var entitySelector;
var entitySelector2;

module.exports = {
  '@disabled': true,
  'Api Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getApiEndpointSelector(1);
    entitySelector2 = page.getApiEndpointSelector(2);
    page
      .open()
      .addElementFromTooltip('endpoint', 'apiendpoint')
      .waitForElementPresent('.endpoint.Tool.selected', 8000)
      .submitCanvasEntity(entitySelector)
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'ApiEndpoint'
        }
      })
      .waitForElementNotPresent(entitySelector + ' .paths0', 5000);
  },
  'Api Endpoint: unique name check': function () {
    page
      .addElementFromTooltip('endpoint', 'apiendpoint')
      .expectUniqueNameError(entitySelector2, 'An api endpoint');
  },
  'Api Endpoint: add paths': function () {
    page
      .editEntity(entitySelector)
      .setValueSlow(entitySelector + ' .input__name input', 'Cars')
      .clickPresent(entitySelector + ' .button__add__PATHS')
      .setValueSlow(entitySelector + ' .input__paths0 input', '/cars')
      .clickPresent(entitySelector + ' .button__add__PATHS')
      .setValueSlow(entitySelector + ' .input__paths1 input', '/buses')
      .submitCanvasEntity(entitySelector)
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'Cars',
          [`${entitySelector} .paths0 .EntityProperty__field--text`]: '/cars',
          [`${entitySelector} .paths1 .EntityProperty__field--text`]: '/buses'
        }
      })
      .waitForElementNotPresent(entitySelector + ' .paths2', 5000);
  },
  'Api Endpoint: remove path': function () {
    page
      .editEntity(entitySelector)
      .clickVisibleOnHover(entitySelector + ' .paths0', entitySelector + ' .button__remove__paths0')
      .submitCanvasEntity(entitySelector)
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'Cars',
          [`${entitySelector} .paths0 .EntityProperty__field--text`]: '/buses'
        }
      })
      .waitForElementNotPresent(entitySelector + ' .paths1', 5000)
      .close();
  }
};
