var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Model: add': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getModelSelector(1);
    page
      .open()
      .addElement('model')
      .waitForElementPresent('.model.Tool.selected', 8000)
      .check({
        text: {
          [`${entitySelector} .EntityProperties .EntityProperty:first-child .EntityPropertyLabel`]: 'CONTEXT PATH'
        },
        value: {
          [`${entitySelector} .EntityHeader .EntityProperty__field--input input`]: 'NewModel',
          [`${entitySelector} .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input`]: 'newmodel'
        }
      });
  },
  'Model: pristine state of context path': function () {
    page
      .setValueSlow(entitySelector + ' .EntityHeader .EntityProperty__field--input input', 'Model test')
      .check({
        value: {
          [`${entitySelector} .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input`]: 'model-test'
        }
      });
  },
  'Model: dirty state of context path': function () {
    page
      .setValueSlow(entitySelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dirty')
      .setValueSlow(entitySelector + ' .EntityHeader .EntityProperty__field--input input', 'Model test again')
      .check({
        value: {
          [`${entitySelector} .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input`]: 'dirty'
        }
      });
  },
  'Model: invalid value': function () {
    page
      .setValueSlow(entitySelector + ' .EntityHeader .EntityProperty__field--input input', '-Invalid !! Value ++**')
      .submitForm(entitySelector + ' form')
      .check({
        hasClass: {
          [entitySelector]: 'editable'
        }
      });
  },
  'Model: save': function () {
    page
      .setValueSlow(entitySelector + ' .EntityHeader .EntityProperty__field--input input', '_ThisIsA_Valid_Value')
      .submitCanvasEntity(entitySelector);
  },
  'Model: remove': function () {
    page
      .removeEntity(entitySelector)
      .close();
  }
};
