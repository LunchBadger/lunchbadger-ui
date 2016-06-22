module.exports = {
	'Demo test': function (browser) {
		browser
			.url(browser.launchUrl)
			.waitForElementVisible('.app', 5000)
			.assert.title('LunchBadger')
			.assert.containsText('.breadcrumbs', 'Project 01')
			.end();
	}
};
