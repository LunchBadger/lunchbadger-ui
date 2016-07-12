module.exports = {
	// '@disabled': true,
	'Datasource: edit': function (browser) {
		var page = browser.page.lunchBadger();
		var elementSelector = '.quadrant:first-child .canvas-element.DataSource:last-child';
		var propertySelector = elementSelector + ' .canvas-element__extra .canvas-element__properties__property';

		//canvas-element__input

		page.open();

		page.addElementFromTooltip('.dataSource.tool');

		browser.pause(200);

		browser.click('.quadrant:first-child .canvas-element.editable.DataSource .canvas-element__button');

		browser.pause(1000);

		browser.expect.element('.quadrant:first-child .canvas-element.expanded.highlighted.DataSource:last-child').to.be.present;

		browser.expect.element(propertySelector + ':first-child .canvas-element__properties__property-title').text.to.equal('URL');
		browser.expect.element(propertySelector + ':first-child .hide-while-edit').text.to.equal('');

		browser.expect.element(propertySelector + ':nth-child(2) .canvas-element__properties__property-title').text.to.equal('SCHEMA');
		browser.expect.element(propertySelector + ':nth-child(2) .hide-while-edit').text.to.equal('');

		browser.expect.element(propertySelector + ':nth-child(3) .canvas-element__properties__property-title').text.to.equal('USERNAME');
		browser.expect.element(propertySelector + ':nth-child(3) .hide-while-edit').text.to.equal('');

		browser.expect.element(propertySelector + ':last-child .canvas-element__properties__property-title').text.to.equal('PASSWORD');
		browser.expect.element(propertySelector + ':last-child .hide-while-edit').text.to.equal('');

		browser.moveTo(elementSelector + ' .canvas-element__title', null, null, function () {
			browser.click(elementSelector + ' .canvas-element__icon');
			browser.pause(1000);
			browser.click(elementSelector + ' .canvas-element__icon');
			browser.pause(1000);
			browser.doubleClick();
			browser.pause(200);
			browser.click(elementSelector + ' .canvas-element__icon');
		});

		browser.pause(1000);

		browser.expect.element('.quadrant:first-child .canvas-element.expanded.editable.DataSource:last-child').to.be.present;

		browser.pause(200);

		browser.setValue(propertySelector + ':first-child .canvas-element__input', 'test url');
		browser.setValue(propertySelector + ':nth-child(2) .canvas-element__input', 'test schema');
		browser.setValue(propertySelector + ':nth-child(3) .canvas-element__input', 'test username');
		browser.setValue(propertySelector + ':last-child .canvas-element__input', 'test password');

		browser.click(elementSelector + ' .canvas-element__button');

		browser.pause(200);

		browser.click(elementSelector + ' .canvas-element__icon');

		browser.expect.element(propertySelector + ':first-child .hide-while-edit').text.to.equal('test url');
		browser.expect.element(propertySelector + ':nth-child(2) .hide-while-edit').text.to.equal('test schema');
		browser.expect.element(propertySelector + ':nth-child(3) .hide-while-edit').text.to.equal('test username');
		browser.expect.element(propertySelector + ':last-child .hide-while-edit').text.to.equal('test password');

		page.close();
	}
};
