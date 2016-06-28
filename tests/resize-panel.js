module.exports = function (browser) {
	var panelHeight = 0;

	browser
		.click('.header__menu__element .icon-icon-forecaster')
		.pause(1500);

	browser.getElementSize('.panel:nth-child(3) .panel__container', function (result) {
		this.assert.notEqual(result.value.height, 0);
		panelHeight = result.value.height;
	});

	browser
		.pause(500)
		.useCss()
		.moveToElement('.panel:last-child > div:last-child > div', 0, 0)
		.mouseButtonDown(0)
		.moveToElement('body', 0, 150)
		.mouseButtonUp(0)
		.pause(500);

	browser.getElementSize('.panel:nth-child(3) .panel__container', function (result) {
		this.assert.notEqual(result.value.height, panelHeight);
		panelHeight = result.value.height;
	});

	browser
		.click('.header__menu__element .icon-icon-forecaster')
		.pause(1500);

	browser.getElementSize('.panel:nth-child(3) .panel__container', function (result) {
		this.assert.equal(result.value.height, 0);
	});

	browser
		.click('.header__menu__element .icon-icon-forecaster')
		.pause(1500);

	browser.getElementSize('.panel:nth-child(3) .panel__container', function (result) {
		this.assert.equal(result.value.height, panelHeight);
	});

	browser
		.click('.header__menu__element .icon-icon-forecaster')
		.pause(1500);
};
