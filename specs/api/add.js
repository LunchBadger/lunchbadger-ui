module.exports = {
	// '@disabled': true,
	'API: add': function (browser) {
		var page = browser.page.lunchBadger();
		var elementSelector = '.quadrant:nth-child(4) .canvas-element.API:last-child';

		page.open();

		page.expect.element('.aside--editing').to.not.be.present;
		page.expect.element('.canvas__container--editing').to.not.be.present;

		page.addElement('.api.tool');

		browser.pause(500);

		page.expect.element('.aside--editing').to.be.present;
		page.expect.element('.canvas__container--editing').to.be.present;

		page.expect.element(elementSelector + ' .canvas-element__title .canvas-element__input').to.have.value.that.equals('API');
		page.expect.element(elementSelector + ' .canvas-element__sub-elements .canvas-element__sub-elements__title').text.to.equal('ENDPOINTS');
		page.expect.element(elementSelector + ' .canvas-element__sub-element').to.not.be.present;

		browser.pause(500);

		page.close();
	}
};
