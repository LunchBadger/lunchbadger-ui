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
    page.addElementFromTooltip('.dataSource.tool', 1);
    browser.pause(1000);
    page.expect.element('.dataSource.tool.tool--selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1000);
  },
  //
  // 'Tools menu: REST datasource selected': function (browser) {
  //   page.addElementFromTooltip('.dataSource.tool', 2);
  //   browser.pause(1000);
  //   page.expect.element('.dataSource.tool.tool--selected').to.be.present;
  //   browser.click(backendSelector + '.DataSource.editable .Button.cancel');
  //   browser.pause(1000);
  // },
  //
  // 'Tools menu: SOAP datasource selected': function (browser) {
  //   page.addElementFromTooltip('.dataSource.tool', 3);
  //   browser.pause(1000);
  //   page.expect.element('.dataSource.tool.tool--selected').to.be.present;
  //   browser.click(backendSelector + '.DataSource.editable .Button.cancel');
  //   browser.pause(1000);
  // },

  'Tools menu: Redis datasource selected': function (browser) {
    page.addElementFromTooltip('.dataSource.tool', 4);
    browser.pause(1000);
    page.expect.element('.dataSource.tool.tool--selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: MongoDB datasource selected': function (browser) {
    page.addElementFromTooltip('.dataSource.tool', 5);
    browser.pause(1000);
    page.expect.element('.dataSource.tool.tool--selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: MySQL datasource selected': function (browser) {
    page.addElementFromTooltip('.dataSource.tool', 6);
    browser.pause(1000);
    page.expect.element('.dataSource.tool.tool--selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: Ethereum datasource selected': function (browser) {
    page.addElementFromTooltip('.dataSource.tool', 7);
    browser.pause(1000);
    page.expect.element('.dataSource.tool.tool--selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: Salesforce datasource selected': function (browser) {
    page.addElementFromTooltip('.dataSource.tool', 8);
    browser.pause(1000);
    page.expect.element('.dataSource.tool.tool--selected').to.be.present;
    browser.click(backendSelector + '.DataSource.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: model selected': function (browser) {
    page.addElement('.model.tool');
    browser.pause(1000);
    page.expect.element('.model.tool.tool--selected').to.be.present;
    browser.click(privateSelector + '.Model.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: microservice selected': function (browser) {
    page.addElement('.microservice.tool');
    browser.pause(1000);
    page.expect.element('.microservice.tool.tool--selected').to.be.present;
    browser.click(privateSelector + '.Microservice.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: private endpoint selected': function (browser) {
    page.addElementFromTooltip('.endpoint.tool', 1);
    browser.pause(1000);
    page.expect.element('.endpoint.tool.tool--selected').to.be.present;
    browser.click(privateSelector + '.PrivateEndpoint.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: public endpoint selected': function (browser) {
    page.addElementFromTooltip('.endpoint.tool', 2);
    browser.pause(1000);
    page.expect.element('.endpoint.tool.tool--selected').to.be.present;
    browser.click(publicSelector + '.PublicEndpoint.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: gateway selected': function (browser) {
    page.addElement('.gateway.tool');
    browser.pause(3000);
    page.expect.element('.gateway.tool.tool--selected').to.be.present;
    browser.click(gatewaySelector + '.Gateway.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: api selected': function (browser) {
    page.addElement('.api.tool');
    browser.pause(1000);
    page.expect.element('.api.tool.tool--selected').to.be.present;
    browser.click(publicSelector + '.API.editable .Button.cancel');
    browser.pause(1000);
  },

  'Tools menu: portal selected': function (browser) {
    page.addElement('.portal.tool');
    browser.pause(3000);
    page.expect.element('.portal.tool.tool--selected').to.be.present;
    browser.click(publicSelector + '.Portal.editable .Button.cancel');
    browser.pause(1000);
  },

  after: function () {
    page.close();
  }
};
