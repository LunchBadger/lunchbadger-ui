module.exports = function (browser) {
	// .dataSource.tool

	browser.expect.element('.aside--editing').to.not.be.present;
	browser.expect.element('.canvas__container--editing').to.not.be.present;

	browser.click('.dataSource.tool');

	browser.expect.element('.dataSource.tool .tool__context').to.be.visible;

	browser.click('.dataSource.tool .tool__context .tool__context__item');

	browser.pause(500);

	browser.expect.element('.aside--editing').to.be.present;
	browser.expect.element('.canvas__container--editing').to.be.present;
	browser.expect.element('.canvas-element.editable.expanded.DataSource').to.be.present;

	browser.expect.element('.canvas-element.editable.DataSource .canvas-element__title .canvas-element__input').to.have.value.that.equals('Memory');

	browser
		.setValue('.canvas-element.editable.DataSource .canvas-element__title .canvas-element__input', 'Memory source');

	browser.click('.canvas-element.editable.DataSource .canvas-element__button');

	browser.pause(1000);

	browser.expect.element('.canvas-element.collapsed.DataSource:last-child .canvas-element__title').text.to.equal('Memory source');

	browser.pause(2000);
};
