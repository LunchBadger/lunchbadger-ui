module.exports = {
	'Demo test': function (browser) {
		browser
			.url(browser.launchUrl)
			.maximizeWindow()
			.waitForElementVisible('.app', 5000)
			.assert.title('LunchBadger')
			.assert.containsText('.breadcrumbs', 'Project 01')
			.saveScreenshot('./reports/screenshots/demo/loaded.png')
			.end();
	}
};
