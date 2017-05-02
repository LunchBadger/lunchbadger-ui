module.exports = {
  // '@disabled': true,
  'Datasource: remove': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:first-child .Entity.DataSource:last-child';
    var propertySelector = elementSelector + ' .EntityProperties .EntityProperty';

    page.open();

    page.addElementFromTooltip('.dataSource.tool');

    browser.pause(1000);

    browser.expect.element('.Entity.editable.expanded.DataSource').to.be.present;

    browser.setValue(propertySelector + ':first-child .EntityProperty__field--input', 'test url');
    browser.setValue(propertySelector + ':nth-child(2) .EntityProperty__field--input', 'test schema');
    browser.setValue(propertySelector + ':nth-child(3) .EntityProperty__field--input', 'test username');
    browser.setValue(propertySelector + ':last-child .EntityProperty__field--input', 'test password');

    browser.click(elementSelector + ' button[type=submit]');

    browser.pause(1000);

    page.click('.Entity.highlighted.expanded.DataSource');

    browser.pause(1000);

    page.click('.Entity.highlighted.expanded.DataSource .Toolbox__button--delete');

    browser.pause(1000);

    page.click('.modal__actions__button.modal__actions__button--confirm');

    browser.pause(1000);

    browser.expect.element('.Entity.highlighted.expanded.DataSource').to.not.be.present;

    page.close();
  }
};
