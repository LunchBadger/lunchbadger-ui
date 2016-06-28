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
	beforeEach: function (browser) {
		browser.pause(1500);
	},
	'Demo test': function (browser) {
		require('../tests/demo')(browser);
	},
	'Panel open/switch/close': function (browser) {
		require('../tests/panel')(browser);
	},
	'Panel resize': function (browser) {
		require('../tests/resize-panel')(browser);
	},
	'Datasource actions': function (browser) {
		require('../tests/datasource/add')(browser);
	}
};
