var page;
var elementSelector = '.quadrant:nth-child(2) .Entity.Model:last-child';

module.exports = {
  // '@disabled': true,
  'Model: add': function (browser) {
    page = browser.page.lunchBadger();

    page.open();

    page.expect.element('.aside--editing').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    page.addElement('.model.tool');

    browser.pause(2000);

    page.expect.element('.aside--editing').to.be.present;
    page.expect.element('.canvas__container--editing').to.be.present;
    page.expect.element(elementSelector + '.editable').to.be.present;

    page.expect.element(elementSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('NewModel');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityPropertyLabel').text.to.equal('CONTEXT PATH');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input').to.have.value.that.equals('newmodel');
  },

  'Model: pristine state of context path': function (browser) {
    page.clearValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input');
    page.setValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input', 'Model test');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input').to.have.value.that.equals('model-test');

    browser.pause(500);
  },

  'Model: dirty state of context path': function (browser) {
    page.clearValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input');
    page.clearValue(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input');

    browser.pause(500);

    page.setValue(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dirty');
    page.setValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input', 'Model test again');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input').to.have.value.that.equals('dirty');

    browser.pause(500);
  },

  'Model: invalid value': function(browser) {
    page.clearValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input');
    page.setValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input', '-Invalid !! Value ++**');
    browser.click(elementSelector + '.editable button[type=submit]');

    // Still editable
    browser.pause(500);
    page.expect.element(elementSelector).to.have.attribute('class').which.contains('editable');
  },

  'Model: save': function(browser) {
    page.clearValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input');
    page.setValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input', '_ThisIsA_Valid_Value');

    browser.click(elementSelector + '.editable button[type=submit]');

    // No longer editable
    page.expect.element(elementSelector).to.have.attribute('class').which.does.not.contain('editable').before(1000);
  },

  after: function () {
    page.close();
  }
};
