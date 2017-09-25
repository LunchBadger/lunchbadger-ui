var page;
var backendSelector = '.quadrant:nth-child(1) .Entity:last-child';
var privateSelector = '.quadrant:nth-child(2) .Entity:last-child';
var gatewaySelector = '.quadrant:nth-child(3) .Entity:last-child';
var publicSelector = '.quadrant:nth-child(4) .Entity:last-child';

module.exports = {
  // '@disabled': true,
  'Tools menu: memory datasource selected': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.addElementFromTooltip('dataSource', 'memory');
    browser.waitForElementPresent('.dataSource.Tool.selected', 8000);
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: REST datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'rest');
    browser.waitForElementPresent('.dataSource.Tool.selected', 8000);
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: SOAP datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'soap');
    browser.waitForElementPresent('.dataSource.Tool.selected', 8000);
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: MongoDB datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'mongodb');
    browser.waitForElementPresent('.dataSource.Tool.selected', 8000);
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: Redis datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'redis');
    browser.waitForElementPresent('.dataSource.Tool.selected', 8000);
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: MySQL datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'mysql');
    browser.waitForElementPresent('.dataSource.Tool.selected', 8000);
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: Ethereum datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'ethereum');
    browser.waitForElementPresent('.dataSource.Tool.selected', 8000);
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: Salesforce datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'salesforce');
    browser.waitForElementPresent('.dataSource.Tool.selected', 8000);
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: model selected': function (browser) {
    page.addElement('model');
    browser.waitForElementPresent('.model.Tool.selected', 8000);
    browser.click(privateSelector + '.Model.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: microservice selected': function (browser) {
    page.addElement('microservice');
    browser.waitForElementPresent('.microservice.Tool.selected', 8000);
    browser.click(privateSelector + '.Microservice.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: private endpoint selected': function (browser) {
    page.addElementFromTooltip('endpoint', 'privateendpoint');
    browser.waitForElementPresent('.endpoint.Tool.selected', 8000);
    browser.click(privateSelector + '.PrivateEndpoint.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: public endpoint selected': function (browser) {
    page.addElementFromTooltip('endpoint', 'publicendpoint');
    browser.waitForElementPresent('.endpoint.Tool.selected', 8000);
    browser.click(publicSelector + '.PublicEndpoint.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: gateway selected': function (browser) {
    page.addElement('gateway');
    browser.waitForElementPresent('.gateway.Tool.selected', 8000);
    browser.click(gatewaySelector + '.Gateway.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: api selected': function (browser) {
    page.addElement('api');
    browser.waitForElementPresent('.api.Tool.selected', 8000);
    browser.click(publicSelector + '.API.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  'Tools menu: portal selected': function (browser) {
    page.addElement('portal');
    browser.waitForElementPresent('.portal.Tool.selected', 8000);
    browser.click(publicSelector + '.Portal.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    browser.pause(1000);
  },

  after: function () {
    page.close();
  }
};
