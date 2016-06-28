module.exports = function (browser) {
	browser
		.assert.title('LunchBadger')
		.assert.containsText('.breadcrumbs', 'Project 01')
};
