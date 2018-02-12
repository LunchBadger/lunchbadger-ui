var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Api Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getApiEndpointSelector(1);
    page
      .open()
      .addElementFromTooltip('endpoint', 'apiendpoint')
      .waitForElementPresent('.endpoint.Tool.selected', 8000)
      .submitCanvasEntity(entitySelector)
      .saveProject()
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'ApiEndpoint',
          [`${entitySelector} .host .EntityProperty__field--text`]: '*'
        }
      })
      .waitForElementNotPresent(entitySelector + ' .paths0', 5000);
  },
  'Api Endpoint: add paths': function () {
    page
      .editEntity(entitySelector)
      .setValueSlow(entitySelector + ' .input__name input', 'Cars')
      .setValueSlow(entitySelector + ' .input__host input', '*.cars.com')
      .clickPresent(entitySelector + ' .button__add__PATHS')
      .setValueSlow(entitySelector + ' .input__paths0 input', '/cars')
      .clickPresent(entitySelector + ' .button__add__PATHS')
      .setValueSlow(entitySelector + ' .input__paths1 input', '/buses')
      .submitCanvasEntity(entitySelector)
      .saveProject()
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'Cars',
          [`${entitySelector} .host .EntityProperty__field--text`]: '*.cars.com',
          [`${entitySelector} .paths0 .EntityProperty__field--text`]: '/cars',
          [`${entitySelector} .paths1 .EntityProperty__field--text`]: '/buses'
        }
      })
      .waitForElementNotPresent(entitySelector + ' .paths2', 5000);
  },
  'Api Endpoint: remove path': function () {
    page
      .editEntity(entitySelector)
      .clickPresent(entitySelector + ' .button__remove__paths0')
      .submitCanvasEntity(entitySelector)
      .saveProject()
      .reloadPage()
      .check({
        text: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--text`]: 'Cars',
          [`${entitySelector} .host .EntityProperty__field--text`]: '*.cars.com',
          [`${entitySelector} .paths0 .EntityProperty__field--text`]: '/buses'
        }
      })
      .waitForElementNotPresent(entitySelector + ' .paths1', 5000)
      .close();
  }
};
