module.exports = {
  // '@disabled': true,
  'Datasource: add': function (browser) {
    var page = browser.page.lunchBadger();

    page.open();

    page.expect.element('.Aside.disabled').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    page.addElementFromTooltip('dataSource');

    browser.pause(1000);

    page.expect.element('.Aside.disabled').to.be.present;
    page.expect.element('.canvas__container--editing').to.be.present;
    page.expect.element('.Entity.editable.expanded.DataSource').to.be.present;

    page.expect.element('.quadrant:first-child .Entity.editable.DataSource .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('REST');

    page.setValue('.quadrant:first-child .Entity.DataSource .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dumpUrl');
    page.setValue('.quadrant:first-child .Entity.DataSource .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input', 'dumpDatabase');
    page.setValue('.quadrant:first-child .Entity.DataSource .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input input', 'dumpUsername');
    page.setValue('.quadrant:first-child .Entity.DataSource .EntityProperties .EntityProperty:last-child .EntityProperty__field--input input', 'dumpPassword');

    browser.click('.quadrant:first-child .Entity.editable.DataSource button[type=submit]');

    browser.pause(2000);

    browser.expect.element('.quadrant:first-child .Entity.DataSource .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').text.to.equal('dumpUrl');
    browser.expect.element('.quadrant:first-child .Entity.DataSource .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--text').text.to.equal('dumpDatabase');
    browser.expect.element('.quadrant:first-child .Entity.DataSource .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--text').text.to.equal('dumpUsername');
    browser.expect.element('.quadrant:first-child .Entity.DataSource .EntityProperties .EntityProperty:last-child .EntityProperty__field--text').text.to.equal('••••••••••••');

    browser.pause(2000);

    page.close();
  }
};
