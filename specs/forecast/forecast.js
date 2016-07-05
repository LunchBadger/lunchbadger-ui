var page;
var apiSelector = '.quadrant:nth-child(4) .canvas-element.API';
var forecasterSelector = '.panel:nth-child(3) .panel__container .panel__body';
var apiForecastSelector = forecasterSelector + ' .api-forecast';

var moment = require('moment');

module.exports = {
	// '@disabled': true,
	before: function (browser) {
		page = browser.page.lunchBadger();

		// first close forecaster if already exists
		browser.element('css selector', apiForecastSelector + ' .api-forecast__header__nav li:nth-child(1) > a', function (result) {
			if (result.status > -1) {
				browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(1) > a');
			}
		});

		page.open();
	},

	'Forecast: create': function (browser) {
		page.click('@forecaster');
		browser.pause(1500);

		page.dragDropElement(
			apiSelector,
			forecasterSelector
		);

		browser.expect.element(apiForecastSelector).to.be.present;

		browser.getText(apiSelector + ' .canvas-element__name', function (result) {
			browser.expect.element(apiForecastSelector + ' .api-forecast__header__title').text.to.equal(result.value);
		});

		browser.pause(2000);
	},

	'Forecast: expand': function (browser) {
		browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(2) > a');
		browser.expect.element(apiForecastSelector + '.expanded').to.be.present;

		browser.pause(2000);
	},

	'Forecast: collapse': function (browser) {
		browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(2) > a');
		browser.expect.element(apiForecastSelector + '.expanded').to.not.be.present;

		browser.pause(2000);
	},

	'Forecast: forecast next month': function (browser) {
		var markWidth = 0;

		browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(2) > a');
		browser.expect.element(apiForecastSelector + '.expanded').to.be.present;

		browser.pause(500);

		browser.expect.element(apiForecastSelector + ' .date-slider__mark.current').text.to.equal(moment().format('MMM')[0]);
		browser.elements('css selector', apiForecastSelector + ' .barlayer .trace:nth-child(3) .points path', function (result) {
			browser.assert.equal(result.value.length, parseInt(moment().format('M'), 10));
		});

		browser.getElementSize(apiForecastSelector + ' .date-slider__mark.current', function (result) {
			markWidth = result.value.width;
		});

		browser
			.pause(500)
			.useCss()
			.moveToElement(apiForecastSelector + ' .rc-slider-handle:first-child', 10, 10)
			.mouseButtonDown(0)
			.moveToElement(apiForecastSelector + ' .date-slider__mark.current + .date-slider__mark', 10, 10)
			.mouseButtonUp(0)
			.pause(500);

		browser.elements('css selector', apiForecastSelector + ' .barlayer .trace:nth-child(3) .points path', function (result) {
			browser.assert.equal(result.value.length, parseInt(moment().add(1, 'months').format('M'), 10));
		});

		browser.pause(2000);
	},

	'Forecast: change current month': function (browser) {
		browser
			.pause(500)
			.useCss()
			.moveToElement(apiForecastSelector + ' .barlayer .trace:nth-child(3) .points path:last-child', 10, 10)
			.mouseButtonClick(0)
			.pause(500);

		browser.expect.element(apiForecastSelector + ' .date-slider__mark.selected').text.to.equal(moment().add(1, 'months').format('MMM')[0]);

		browser.pause(2000);
	},

	'Forecast: change date range': function (browser) {
		var startDate;
		var endDate;

		var startEndDiff = 2;

		// start date
		browser.click(apiForecastSelector + ' .react-datepicker__input-container:first-child > input');
		browser.click('.react-datepicker__navigation--next');
		browser.click('.react-datepicker__month .react-datepicker__week:nth-child(3) .react-datepicker__day:first-child');

		browser.getValue(apiForecastSelector + ' .react-datepicker__input-container:first-child > input', function(result) {
			startDate = moment(result.value, 'D MMM YYYY');
		});

		// end date
		browser.click(apiForecastSelector + ' .react-datepicker__input-container:nth-child(3) > input');
		browser.click('.react-datepicker__navigation--previous');
		browser.click('.react-datepicker__navigation--previous');
		browser.click('.react-datepicker__month .react-datepicker__week:nth-child(3) .react-datepicker__day:first-child');

		browser.getValue(apiForecastSelector + ' .react-datepicker__input-container:nth-child(3) > input', function(result) {
			endDate = moment(result.value, 'D MMM YYYY');
		});

		browser.elements('css selector', apiForecastSelector + ' .barlayer .trace:nth-child(3) .points path', function (result) {
			browser.assert.equal(result.value.length, endDate.diff(startDate, 'months') + startEndDiff);
		});

		browser.expect.element(apiForecastSelector + ' .date-slider__mark.selected').text.to.equal(moment().subtract(1, 'months').format('MMM')[0]);

		browser.pause(2000);
	},

	'Forecast: remove': function (browser) {
		browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(1) > a');
		browser.pause(500);

		browser.expect.element(apiForecastSelector).to.not.be.present;

		browser.pause(1500);
	},

	after: function () {
		page.close();
	}
};
