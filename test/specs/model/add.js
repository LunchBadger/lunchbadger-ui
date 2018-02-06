var page;
var elementSelector;

module.exports = {
  // '@disabled': true,
  'Model: add': function (browser) {
    page = browser.page.lunchBadger();
    elementSelector = page.getModelSelector(1);
    page.open();
    page.addElement('model');
    page.waitForElementPresent('.model.Tool.selected', 8000);
    page.expect.element(elementSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('NewModel');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityPropertyLabel').text.to.equal('CONTEXT PATH');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input').to.have.value.that.equals('newmodel');
  },

  'Model: pristine state of context path': function () {
    page.setValueSlow(elementSelector + ' .EntityHeader .EntityProperty__field--input input', 'Model test');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input').to.have.value.that.equals('model-test');
  },

  'Model: dirty state of context path': function () {
    page.setValueSlow(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dirty');
    page.setValueSlow(elementSelector + ' .EntityHeader .EntityProperty__field--input input', 'Model test again');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input').to.have.value.that.equals('dirty');
  },

  'Model: invalid value': function () {
    page.setValueSlow(elementSelector + ' .EntityHeader .EntityProperty__field--input input', '-Invalid !! Value ++**');
    page.submitForm(elementSelector + ' form');
    page.expect.element(elementSelector).to.have.attribute('class').which.contains('editable');
  },

  'Model: save': function () {
    page.setValueSlow(elementSelector + ' .EntityHeader .EntityProperty__field--input input', '_ThisIsA_Valid_Value');
    page.submitCanvasEntity(elementSelector);
    page.close();
  }
};
