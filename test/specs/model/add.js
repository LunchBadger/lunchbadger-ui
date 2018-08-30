var page;
var entitySelector;
var entitySelector2;
var MODEL_NAME = '_ThisIsA_Valid_Value';

module.exports = {
  // '@disabled': true,
  'Model: add': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getModelSelector(1);
    entitySelector2 = page.getModelSelector(2);
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
      .setCanvasEntityName(entitySelector, 'Model test')
      .check({
        value: {
          [`${entitySelector} .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input`]: 'model-test'
        }
      });
  },
  'Model: dirty state of context path': function () {
    page
      .setValueSlow(entitySelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dirty')
      .setCanvasEntityName(entitySelector, 'Model test again')
      .check({
        value: {
          [`${entitySelector} .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input`]: 'dirty'
        }
      });
  },
  'Model: invalid value': function () {
    page
      .setCanvasEntityName(entitySelector, '-Invalid !! Value ++**')
      .submitForm(entitySelector + ' form')
      .check({
        hasClass: {
          [entitySelector]: 'editable'
        }
      });
  },
  'Model: save': function () {
    page
      .setCanvasEntityName(entitySelector, MODEL_NAME)
      .submitCanvasEntityWithoutAutoSave(entitySelector);
  },
  'Model: unique name check': function () {
    page
      .addElement('model')
      .setCanvasEntityName(entitySelector2, MODEL_NAME)
      .expectUniqueNameError(entitySelector2, 'A model');
  },
  'Model: remove': function () {
    page
      .removeEntity(entitySelector)
      .close();
  }
};
