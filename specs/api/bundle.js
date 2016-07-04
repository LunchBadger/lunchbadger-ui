var page;
var publicEndpointSelector = '.quadrant:nth-child(4) .canvas-element.PublicEndpoint';
var apiSelector = '.quadrant:nth-child(4) .canvas-element.API';

module.exports = {
	// '@disabled': true,
	'API: bundle endpoint - accept': function (browser) {
		page = browser.page.lunchBadger();

		page.open();

		page.addElement('.api.tool');

		browser.pause(500);

		page.expect.element(apiSelector + '.editable').to.be.present;
		browser.click(apiSelector + '.editable .canvas-element__button');
		browser.pause(1000);

		page.addElementFromTooltip('.endpoint.tool', 2);

		browser.pause(500);

		page.expect.element(publicEndpointSelector + '.editable').to.be.present;
		page.setValue(publicEndpointSelector + '.editable .canvas-element__input', 'PUBLIC ENDPOINT BUNDLED');
		browser.click(publicEndpointSelector + '.editable .canvas-element__button');
		browser.pause(1000);

		browser.click(apiSelector + ':nth-last-child(2) .canvas-element__icon');

		browser.pause(500);

		page.dragDropElement(
			publicEndpointSelector + ':last-child',
			apiSelector + ':nth-last-child(2) .canvas-element__drop-placeholder'
		);

		browser.pause(500);

		browser.click('.modal__actions__button--confirm', function () {
			page.expect.element(publicEndpointSelector + ':last-child').to.not.be.present;
			page.expect.element(apiSelector + ':last-child .canvas-element__sub-element .public-endpoint').to.be.present;
			page.expect.element(apiSelector + ':last-child .canvas-element__sub-element .public-endpoint__name').text.to.equal('PUBLIC ENDPOINT BUNDLED');

			browser.pause(1000);
		});
	},

	after: function () {
		page.close();
	}
};
