module.exports = {
	before: function (browser) {
		browser
			.url(browser.launchUrl)
			.maximizeWindow()
			.waitForElementVisible('.app', 5000)
	},
	after: function (browser) {
		browser.end();
	},
	'Demo test': function (browser) {
		require('../tests/demo')(browser);
	}
};
