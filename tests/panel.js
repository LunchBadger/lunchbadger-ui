module.exports = function (browser) {
	browser
		.click('.header__menu__element .icon-icon-details')
		.pause(1500);

	browser.getElementSize('.panel:first-child .panel__container', function(result) {
		this.assert.notEqual(result.value.height, 0);
	});

	// browser
	// 	.click('.header__menu__element .icon-icon-metrics')
	// 	.pause(1000);
	//
	// browser.getElementSize('.panel:nth-child(2) .panel__container', function(result) {
	// 	this.assert.notEqual(result.value.height, 0);
	// });
	//
	// browser.getElementSize('.panel:first-child .panel__container', function(result) {
	// 	this.assert.equal(result.value.height, 0);
	// });

	browser
		.click('.header__menu__element .icon-icon-forecaster')
		.pause(1500);

	browser.getElementSize('.panel:nth-child(3) .panel__container', function(result) {
		this.assert.notEqual(result.value.height, 0);
	});

	browser.getElementSize('.panel:first-child .panel__container', function(result) {
		this.assert.equal(result.value.height, 0);
	});

	browser
		.click('.header__menu__element .icon-icon-forecaster')
		.pause(1500);

	browser.getElementSize('.panel:nth-child(3) .panel__container', function(result) {
		this.assert.equal(result.value.height, 0);
	});
};
