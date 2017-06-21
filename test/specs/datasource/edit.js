module.exports = {
  // '@disabled': true,
  'Datasource: edit': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:first-child .Entity.DataSource:last-child';
    var propertySelector = elementSelector + ' .EntityProperties .EntityProperty';

    //canvas-element__input

    page.open();

    page.addElementFromTooltip('dataSource', 'rest');

    browser.pause(1000);

    browser.click('.quadrant:first-child .Entity.editable.DataSource button[type=submit]');

    browser.pause(1000);

    browser.expect.element('.quadrant:first-child .Entity.expanded.highlighted.DataSource:last-child').to.be.present;

    browser.expect.element(propertySelector + ':first-child .EntityPropertyLabel').text.to.equal('URL');
    browser.expect.element(propertySelector + ':first-child .EntityProperty__field--text').text.to.equal('');

    browser.expect.element(propertySelector + ':nth-child(2) .EntityPropertyLabel').text.to.equal('DATABASE');
    browser.expect.element(propertySelector + ':nth-child(2) .EntityProperty__field--text').text.to.equal('');

    browser.expect.element(propertySelector + ':nth-child(3) .EntityPropertyLabel').text.to.equal('USERNAME');
    browser.expect.element(propertySelector + ':nth-child(3) .EntityProperty__field--text').text.to.equal('');

    browser.expect.element(propertySelector + ':last-child .EntityPropertyLabel').text.to.equal('PASSWORD');
    browser.expect.element(propertySelector + ':last-child .EntityProperty__field--text').text.to.equal('');

    browser.expect.element(elementSelector + ' .EntityValidationErrors__fields .EntityValidationErrors__fields__field').to.be.present;

    browser.setValue(propertySelector + ':first-child .EntityProperty__field--input input', 'test url');
    browser.setValue(propertySelector + ':nth-child(2) .EntityProperty__field--input input', 'test schema');
    browser.setValue(propertySelector + ':nth-child(3) .EntityProperty__field--input input', 'test username');
    browser.setValue(propertySelector + ':last-child .EntityProperty__field--input input', 'test password');

    browser.click(elementSelector + ' button[type=submit]');

    browser.pause(2000);

    browser.expect.element(propertySelector + ':first-child .EntityProperty__field--text').text.to.equal('test url');
    browser.expect.element(propertySelector + ':nth-child(2) .EntityProperty__field--text').text.to.equal('test schema');
    browser.expect.element(propertySelector + ':nth-child(3) .EntityProperty__field--text').text.to.equal('test username');
    browser.expect.element(propertySelector + ':last-child .EntityProperty__field--text').text.to.equal('•••••••••••••');

    page.close();
  }
};
