var page;
var elementSelector = '.quadrant:nth-child(2) .canvas-element.Model:last-child';

module.exports = {
	// '@disabled': true,
	'Model: add': function (browser) {
		page = browser.page.lunchBadger();

		page.open();

		page.expect.element('.aside--editing').to.not.be.present;
		page.expect.element('.canvas__container--editing').to.not.be.present;

		page.addElement('.model.tool');

		browser.pause(500);

		page.expect.element('.aside--editing').to.be.present;
		page.expect.element('.canvas__container--editing').to.be.present;

		page.expect.element(elementSelector + ' .canvas-element__title .canvas-element__input').to.have.value.that.equals('Model');
		page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__properties__property-title').text.to.equal('CONTEXT PATH');
		page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input').to.have.value.that.equals('model');
	},

	'Model: pristine state of context path': function (browser) {
		page.setValue(elementSelector + ' .canvas-element__title .canvas-element__input', 'Model test');
		page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input').to.have.value.that.equals('model-test');

		browser.pause(500);
	},

	'Model: dirty state of context path': function (browser) {
		page.clearValue(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input');

		browser.pause(500);

		page.setValue(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input', 'dirty');
		page.setValue(elementSelector + ' .canvas-element__title .canvas-element__input', 'Model test again');
		page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input').to.have.value.that.equals('dirty');

		browser.pause(500);
	},

	after: function () {
		page.close();
	}
};
