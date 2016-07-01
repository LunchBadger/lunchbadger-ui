module.exports = {
	// '@disabled': true,
	'Datasource: add': function (browser) {
		var page = browser.page.lunchBadger();

		page.open();

		page.expect.element('.aside--editing').to.not.be.present;
		page.expect.element('.canvas__container--editing').to.not.be.present;

		page.addElementFromTooltip('.dataSource.tool');

		browser.pause(500);

		page.expect.element('.aside--editing').to.be.present;
		page.expect.element('.canvas__container--editing').to.be.present;
		page.expect.element('.canvas-element.editable.expanded.DataSource').to.be.present;

		page.expect.element('.quadrant:first-child .canvas-element.editable.DataSource .canvas-element__title .canvas-element__input').to.have.value.that.equals('Memory');

		page.setValue('.quadrant:first-child .canvas-element.DataSource:last-child .canvas-element__input', 'Mem');

		browser.click('.quadrant:first-child .canvas-element.editable.DataSource .canvas-element__button');

		browser.pause(2000);

		browser.expect.element('.quadrant:first-child .canvas-element.DataSource:last-child .canvas-element__title').text.to.equal('Mem');

		browser.pause(2000);

		page.close();
	}
};
