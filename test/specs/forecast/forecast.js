var page;
var apiSelector = '.quadrant:nth-child(4) .Entity.API';
var forecasterSelector = '.panel-container .panel__body.forecasts';
var apiForecastSelector = forecasterSelector + ' .api-forecast';

var moment = require('moment');

module.exports = {
  '@disabled': true, // FIXME enable when optimize plugin will be turned on
  before: function (browser) {
    page = browser.page.lunchBadger();

    // first close forecaster if already exists
    browser.element('css selector', apiForecastSelector + ' .api-forecast__header__nav li:nth-child(1) > a', function (result) {
      if (result.status > -1) {
        browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(1) > a');
      }
    });

    page.open();

    // Create an API
    page.addElement('api');
    browser.pause(1000);
    browser.click(apiSelector + ' button[type=submit]');

    browser.pause(500);
  },

  'Forecast: create': function (browser) {
    page.click('@forecaster');
    browser.pause(1500);

    page.dragDropElement(
      apiSelector,
      forecasterSelector
    );
    browser.pause(4000);
    browser.expect.element(apiForecastSelector).to.be.present;

    browser.getText(apiSelector + ' .EntityHeader .EntityProperty__field--text', function (result) {
      browser.expect.element(apiForecastSelector + ' .api-forecast__header__title').text.to.contain(result.value);
    });

    browser.element('css selector', apiForecastSelector + '.expanded', function (result) {
      if (result.status > -1) {
        browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(2) > a');
      }
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
    browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(2) > a');
    browser.expect.element(apiForecastSelector + '.expanded').to.be.present;

    browser.pause(500);

    const month = new RegExp('^' + moment().format('MMM')[0]);
    browser.expect.element(apiForecastSelector + ' .date-slider__mark.current').text.to.match(month);

    browser
      .pause(500)
      .useCss()
      .moveToElement(apiForecastSelector + ' .rc-slider-handle:first-child', 10, 10)
      .mouseButtonDown(0)
      .moveToElement(apiForecastSelector + ' .date-slider__mark.current + .date-slider__mark', 10, 10)
      .mouseButtonUp(0)
      .pause(500);

    browser.elements('css selector', apiForecastSelector + ' .barlayer .trace:nth-child(3) .points path', function (result) {
      browser.assert.equal(result.value.length, Math.ceil(moment().add(1, 'months').diff('2017-01-01', 'months', true)));
    });

    browser.pause(2000);
  },

  'Forecast: change current month': function (browser) {
    browser
      .pause(500)
      .useCss()
      .moveToElement(apiForecastSelector + ' .barlayer .trace:nth-child(3) .points .point:last-child path', 10, 10)
      .mouseButtonClick(0)
      .pause(500);

    const monthAbbr = moment().add(1, 'months').format('MMM')[0];
    browser.expect.element(apiForecastSelector + ' .date-slider__mark.selected').text.to.match(new RegExp('^' + monthAbbr));

    browser.pause(2000);
  },

  'Forecast: change date range': function (browser) {
    var startDate;
    var endDate;

    var startEndDiff = 1;

    // start date
    browser.click(apiForecastSelector + ' .react-datepicker__input-container:first-child > input');
    browser.click('.react-datepicker__navigation--next');
    browser.click('.react-datepicker__month .react-datepicker__week:nth-child(2) .react-datepicker__day:first-child');

    browser.getValue(apiForecastSelector + ' .react-datepicker__input-container:first-child > input', function(result) {
      startDate = moment(result.value, 'D MMM YYYY');
    });

    // end date
    browser.click(apiForecastSelector + ' .react-datepicker__input-container:nth-child(3) > input');
    browser.click('.react-datepicker__navigation--next');
    browser.click('.react-datepicker__navigation--next');
    browser.click('.react-datepicker__month .react-datepicker__week:nth-child(4) .react-datepicker__day:first-child');

    browser.getValue(apiForecastSelector + ' .react-datepicker__input-container:nth-child(3) > input', function(result) {
      endDate = moment(result.value, 'D MMM YYYY');
    });

    browser.elements('css selector', apiForecastSelector + ' .barlayer .trace:nth-child(3) .points path', function (result) {
      browser.assert.equal(result.value.length, endDate.diff(startDate, 'months') + startEndDiff);
    });

    browser.expect.element(apiForecastSelector + ' .date-slider__mark.selected').text.to.equal(moment().add(1, 'months').format('MMM')[0]);

    browser.pause(2000);
  },

  'Forecast: remove': function (browser) {
    browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(2) > a');
    browser.click(apiForecastSelector + ' .api-forecast__header__nav li:nth-child(1) > a');
    browser.pause(500);

    browser.expect.element(apiForecastSelector).to.not.be.present;

    browser.pause(1500);
  },

  after: function () {
    page.close();
  }
};
