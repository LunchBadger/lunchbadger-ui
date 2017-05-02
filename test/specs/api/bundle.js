var page;
var publicEndpointSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint';
var apiSelector = '.quadrant:nth-child(4) .Entity.API';

module.exports = {
  // '@disabled': true,
  before: function (browser) {
    page = browser.page.lunchBadger();

    page.open();
  },

  beforeEach: function (browser) {
    page.addElement('.api.tool');

    browser.pause(2000);

    page.expect.element(apiSelector + '.editable').to.be.present;
    browser.click(apiSelector + '.editable button[type=submit]');
    browser.pause(2000);

    page.addElementFromTooltip('.endpoint.tool', 2);

    browser.pause(2000);

    page.expect.element(publicEndpointSelector + '.editable').to.be.present;
    page.setValue(publicEndpointSelector + '.editable .EntityProperty__field--input', 'PublicEndpointBundled');
    browser.click(publicEndpointSelector + '.editable button[type=submit]');
    browser.pause(2000);

    browser.click(apiSelector + ':nth-last-child(2) .EntityHeader__icon');

    browser.pause(3000);

    page.dragDropElement(
      publicEndpointSelector + ':last-child',
      apiSelector + ':nth-last-child(2) .canvas-element__drop-placeholder'
    );

    browser.pause(5000);
  },

  'API: bundle endpoint - accept': function (browser) {
    browser.click('.modal__actions__button--confirm', function () {
      page.expect.element(publicEndpointSelector + ':last-child').to.not.be.present;
      page.expect.element(apiSelector + ':last-child .EntitySubElements__main .public-endpoint').to.be.present;

      browser.pause(2000);
    });
  },

  'API: bundle endpoint - decline': function (browser) {
    browser.click('.modal__actions__button--discard', function () {
      page.expect.element(publicEndpointSelector + ':last-child').to.be.present;
      page.expect.element(apiSelector + ':last-child .EntitySubElements__main .public-endpoint').to.not.be.present;

      browser.pause(2000);
    });
  },

  after: function () {
    page.close();
  }
};
