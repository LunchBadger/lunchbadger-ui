var page;
var elementSelector = '.quadrant:nth-child(2) .Entity.Model:last-child';
var detailsPanelSelector = '.panel__container';

module.exports = {
  // '@disabled': true,
  'Model: edit panel details': function (browser) {
    page = browser.page.lunchBadger();

    page.open();

    // Create model
    page.addElement('model');
    browser.pause(1000);

    // Set name and save
    page.setValue(elementSelector + ' .EntityHeader .EntityProperty__field--input input', 'ModelTest');
    page.click(elementSelector + ' button[type=submit]');
    browser.expect.element('.Entity.expanded.Model').to.be.present.before(2000);

    // Start editing
    page.click(elementSelector);
    browser.pause(1000);

    page.click('@details');
    browser.pause(5000);

    page.clearValue(detailsPanelSelector + ' .details-panel__element .details-panel__fieldset .details-panel__input input');
    page.setValue(detailsPanelSelector + ' .details-panel__element .details-panel__fieldset .details-panel__input input', 'ModelTestChanged');
    browser.pause(1000);

    page.click(detailsPanelSelector + ' .confirm-button__accept.confirm-button__accept--enabled');
    browser.pause(5000);

    browser.expect.element(elementSelector + ' .EntityHeader .EntityProperty__field--text').text.to.equal('ModelTestChanged');

    page.close();
  }
}
