module.exports = {
	// '@disabled': true,
	'Gateway: add pipeline': function (browser) {
		var page = browser.page.lunchBadger();
		var elementSelector = '.quadrant:nth-child(3) .canvas-element.Gateway:last-child';

		page.open();

		page.addElement('.gateway.tool');

		browser.pause(3500);

		page.expect.element(elementSelector + ' .canvas-element__sub-element').to.not.be.present;

		page.click(elementSelector + ' .canvas-element__sub-elements .canvas-element__add');

		browser.pause(50);

		page.expect.element(elementSelector + ' .canvas-element__sub-element:first-child').to.be.present;

		page.click(elementSelector + ' .canvas-element__sub-elements .canvas-element__add');

		browser.pause(50);

		page.expect.element(elementSelector + ' .canvas-element__sub-element:nth-child(2)').to.be.present;

		page.close();
	}
};
