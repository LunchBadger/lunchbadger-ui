var pageCommands = {
	open: function () {
		var page = this.api.page.lunchBadger().navigate();

		this.api.maximizeWindow();
		this.waitForElementVisible('.app', 5000);

		return page;
	},

	close: function () {
		this.api.end();
	},
	
	addElementFromTooltip: function (element, option) {
		option = option || 1;

		this.moveToElement(element, 5, 5, function () {
			this.waitForElementVisible(element + ' .tool__context li:nth-child(' + option + ') .tool__context__item', 500);
			this.click(element + ' .tool__context li:nth-child(' + option +') .tool__context__item');
		});
	},

	addElement: function (element) {
		this.click(element);
	}
};

module.exports = {
	commands: [pageCommands],
	url: function () {
		return this.api.launchUrl;
	},
	elements: {
		forecaster: {
			selector: '.header__menu__element .icon-icon-forecaster'
		},
		forecasterPanel: {
			selector: '.panel:nth-child(3) .panel__container'
		},
		details: {
			selector: '.header__menu__element .icon-icon-details'
		},
		detailsPanel: {
			selector: '.panel:first-child .panel__container'
		}
	}
};