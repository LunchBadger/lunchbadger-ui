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
    browser.pause(1500);
    page.expect.element('.dataSource.Tool.selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: REST datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'rest');
    browser.pause(1500);
    page.expect.element('.dataSource.Tool.selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: SOAP datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'soap');
    browser.pause(1500);
    page.expect.element('.dataSource.Tool.selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: MongoDB datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'mongodb');
    browser.pause(1500);
    page.expect.element('.dataSource.Tool.selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: Redis datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'redis');
    browser.pause(1500);
    page.expect.element('.dataSource.Tool.selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: MySQL datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'mysql');
    browser.pause(1500);
    page.expect.element('.dataSource.Tool.selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: Ethereum datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'ethereum');
    browser.pause(1500);
    page.expect.element('.dataSource.Tool.selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: Salesforce datasource selected': function (browser) {
    page.addElementFromTooltip('dataSource', 'salesforce');
    browser.pause(1500);
    page.expect.element('.dataSource.Tool.selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: model selected': function (browser) {
    page.addElement('model');
    browser.pause(1500);
    page.expect.element('.model.Tool.selected').to.be.present;
    browser.click(privateSelector + '.Model.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: microservice selected': function (browser) {
    page.addElement('microservice');
    browser.pause(1500);
    page.expect.element('.microservice.Tool.selected').to.be.present;
    browser.click(privateSelector + '.Microservice.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: private endpoint selected': function (browser) {
    page.addElementFromTooltip('endpoint', 'privateendpoint');
    browser.pause(1500);
    page.expect.element('.endpoint.Tool.selected').to.be.present;
    browser.click(privateSelector + '.PrivateEndpoint.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: public endpoint selected': function (browser) {
    page.addElementFromTooltip('endpoint', 'publicendpoint');
    browser.pause(1500);
    page.expect.element('.endpoint.Tool.selected').to.be.present;
    browser.click(publicSelector + '.PublicEndpoint.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: gateway selected': function (browser) {
    page.addElement('gateway');
    browser.pause(3000);
    page.expect.element('.gateway.Tool.selected').to.be.present;
    browser.click(gatewaySelector + '.Gateway.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: api selected': function (browser) {
    page.addElement('api');
    browser.pause(1500);
    page.expect.element('.api.Tool.selected').to.be.present;
    browser.click(publicSelector + '.API.editable .Button.cancel');
    browser.pause(1500);
  },

  'Tools menu: portal selected': function (browser) {
    page.addElement('portal');
    browser.pause(3000);
    page.expect.element('.portal.Tool.selected').to.be.present;
    browser.click(publicSelector + '.Portal.editable .Button.cancel');
    browser.pause(1500);
  },

  after: function () {
    page.close();
  }
};
