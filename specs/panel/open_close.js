module.exports = {
	// '@disabled': true,
	'Panel: open/close': function (browser) {
		var page = browser.page.lunchBadger();

		page.open();

		page.click('@details');
		browser.pause(2000);

		page.getElementSize('@detailsPanel', function(result) {
			page.assert.notEqual(result.value.height, 0);
		});

		page.click('@forecaster');
		browser.pause(2000);

		page.getElementSize('@forecasterPanel', function(result) {
			page.assert.notEqual(result.value.height, 0);
		});

		page.getElementSize('@detailsPanel', function(result) {
			page.assert.equal(result.value.height, 0);
		});

		page.click('@forecaster');
		browser.pause(2000);

		page.getElementSize('@forecasterPanel', function(result) {
			page.assert.equal(result.value.height, 0);
		});

		page.close();
	}
};
