var page;
var elementSelector = '.quadrant:nth-child(2) .Entity.Model:last-child';

module.exports = {
  // '@disabled': true,
  'Model: delete': function (browser) {
    page = browser.page.lunchBadger();

    page.open();

    // Create model
    page.addElement('model');
    browser.pause(500);

    // Set name and save
    page.setValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input', 'ModelTest');
    page.click(elementSelector + ' button[type=submit]');
    browser.expect.element('.Entity.expanded.Model').to.be.present.before(2000);

    // Start editing
    page.click(elementSelector);
    browser.pause(500);

    // Remove it
    page.click(elementSelector + ' .Toolbox__button--delete');
    page.click('.ConfirmModal .confirm');
    browser.expect.element('.Entity.expanded.Model').to.not.be.present.before(2000);
  },

  'Model: delete after first cancel': function (browser) {
    // Create model
    page.addElement('model');
    browser.pause(500);

    page.click(elementSelector + ' .EntityActionButtons__inner .cancel');
    browser.pause(500);
    browser.expect.element('.canvas-element.expanded.Model').to.not.be.present.before(2000);
  },

  after: function () {
    page.close();
  }
}
