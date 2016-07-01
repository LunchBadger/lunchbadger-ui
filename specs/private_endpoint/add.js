var page;
var elementSelector = '.quadrant:nth-child(2) .canvas-element.PrivateEndpoint:last-child';

module.exports = {
	// '@disabled': true,
	'Private Endpoint: add': function (browser) {
		page = browser.page.lunchBadger();

		page.open();

		page.expect.element('.aside--editing').to.not.be.present;
		page.expect.element('.canvas__container--editing').to.not.be.present;

		page.addElementFromTooltip('.endpoint.tool', 1);

		browser.pause(500);

		page.expect.element('.aside--editing').to.be.present;
		page.expect.element('.canvas__container--editing').to.be.present;

		page.expect.element(elementSelector + ' .canvas-element__title .canvas-element__input').to.have.value.that.equals('Private Endpoint');
		page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__properties__property-title').text.to.equal('CONTEXT PATH');
		page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input').to.have.value.that.equals('private-endpoint');
	},

	'Private Endpoint: pristine state of context path': function (browser) {
		page.setValue(elementSelector + ' .canvas-element__title .canvas-element__input', 'Private Endpoint test');
		page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input').to.have.value.that.equals('private-endpoint-test');

		browser.pause(500);
	},

	'Private Endpoint: dirty state of context path': function (browser) {
		page.clearValue(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input');

		browser.pause(500);

		page.setValue(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input', 'dirty');
		page.setValue(elementSelector + ' .canvas-element__title .canvas-element__input', 'Private endpoint test again');
		page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input').to.have.value.that.equals('dirty');

		browser.pause(500);
	},

	after: function () {
		page.close();
	}
};
