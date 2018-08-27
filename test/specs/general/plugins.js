var page;

module.exports = {
  // '@disabled': true,
  'Tools menu: plugins': function (browser) {
    page = browser.page.lunchBadger();
    page
      .open()
      .check({
        present,
        notPresent
      })
      .close();
  }
};

const present = [
  '.Tool.dataSource',
  '.Tool.model',
  '.Tool.function',
  // '.Tool.microservice',
  '.Tool.endpoint',
  '.Tool.gateway',

  // on staging, below are enabled
  '.Tool.api',
  '.Tool.portal',
  '.header__menu__link.METRICS_PANEL',
  '.header__menu__link.FORECASTS_PANEL'
];
const notPresent = [

];
