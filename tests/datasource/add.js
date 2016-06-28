module.exports = function (browser) {
	// .dataSource.tool

	browser.click('.dataSource.tool');

	browser.isVisible('.dataSource.tool .tool__context', function (result) {
		this.assert.equal(result.value, true);
	});

	browser.click('.dataSource.tool .tool__context .tool__context__item');

	browser
		.pause(500)
		.isVisible('.aside--editing', function (result) {
			this.assert.equal(result.value, true);
		})
		.isVisible('.canvas__container--editing', function (result) {
			this.assert.equal(result.value, true);
		});

	browser
		.isVisible('.canvas-element.editable.expanded.DataSource', function (result) {
			this.assert.equal(result.value, true);
		});

	browser
		.getValue('.canvas-element.editable.DataSource .canvas-element__title .canvas-element__input', function (result) {
			this.assert.equal(result.value, 'Memory');
		});

	browser
		.setValue('.canvas-element.editable.DataSource .canvas-element__title .canvas-element__input', 'Memory source');

	browser
		.click('.canvas-element.editable.DataSource .canvas-element__button');

	browser.pause(1000);

	browser.getText('.canvas-element.collapsed.DataSource:last-child .canvas-element__title', function (result) {
		this.assert.equal(result.value, 'Memory source');
	});

	browser.pause(2000);
};
