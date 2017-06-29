var page;

const elementSelector = '.quadrant:nth-child(1) .Entity.DataSource:last-child';
const workspaceStatusSelector = '.workspace-status .ContextualInformationMessage';

function expectInstall(browser, page, finalStatus, finalMsg, skipUpdatingDependenciesCheck) {
  page.expect.element('.workspace-status span').to.have.attribute('class')
    .which.contains('workspace-status__progress').before(10000);
  if (!skipUpdatingDependenciesCheck) {
    page.moveToElement('.logotype', 5, 5);
    page.click('.logotype');
    page.moveToElement('.workspace-status', 5, 5, function () {
      page.waitForElementVisible(workspaceStatusSelector, 5000);
      page.expect.element(workspaceStatusSelector).text.to.contain('Updating dependencies');
    });
  }
  page.expect.element('.workspace-status span').to.have.attribute('class')
    .which.contains(`workspace-status__${finalStatus}`).before(120000);
  if (finalStatus === 'success') {
    page.moveToElement('.workspace-status', 5, 5, function () {
      page.waitForElementVisible(workspaceStatusSelector, 5000);
      page.expect.element(workspaceStatusSelector).text.to.contain(finalMsg);
    });
  } else {
    page.click('.workspace-status span');
    page.waitForElementVisible('.SystemDefcon1', 5000);
    page.click('.SystemDefcon1__box__content__details--link');
    browser.pause(1000);
    page.expect.element('.SystemDefcon1 .SystemDefcon1__box__content__details--box').text.to.contain(finalMsg);
  }
}

module.exports = {
  // '@disabled': true,
  'Connector installation: data source add': function(browser) {
    page = browser.page.lunchBadger();
    page.open();
    browser.click('.workspace-status span');
    page.addElementFromTooltip('dataSource', 'rest');
    page.waitForElementVisible(elementSelector + '.rest.editable button[type=submit]', 5000);
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dumpUrl');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input', 'dumpDatabase');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input input', 'dumpUsername');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input input', 'dumpPassword');
    browser.click(elementSelector + '.editable button[type=submit]');
    expectInstall(browser, page, 'success', 'Workspace OK');
  },

  'Connector installation: add more data source': function(browser) {
    page.addElementFromTooltip('dataSource', 'soap');
    page.waitForElementVisible(elementSelector + '.soap.editable button[type=submit]', 5000);
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dumpUrl');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input', 'dumpDatabase');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input input', 'dumpUsername');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input input', 'dumpPassword');
    browser.click(elementSelector + '.editable button[type=submit]');
    page.waitForElementVisible('.SystemDefcon1', 120000);
    page.click('.SystemDefcon1 button');
    page.waitForElementNotPresent('.SystemDefcon1', 5000);
    page.addElementFromTooltip('dataSource', 'mongodb');
    page.waitForElementVisible(elementSelector + '.mongodb.editable button[type=submit]', 5000);
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'mongodb://dumpUrl');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input', 'dumpDatabase');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input input', 'dumpUsername');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input input', 'dumpPassword');
    browser.click(elementSelector + '.editable button[type=submit]');
    expectInstall(browser, page, 'failure', '?wsdl')
  },

  'Connector uninstallation: remove datasource': function(browser) {
    page.click('.SystemDefcon1 button');
    page.waitForElementNotPresent('.SystemDefcon1', 5000);
    page.click(elementSelector);
    page.waitForElementVisible(elementSelector + ' .Toolbox__button--delete', 5000);
    page.click(elementSelector + ' .Toolbox__button--delete');
    browser.pause(1500);
    page.click('.modal__actions__button.modal__actions__button--confirm');
    expectInstall(browser, page, 'failure', '?wsdl');
  },

  'Connector uninstallation: trash workspace': function(browser) {
    page.click('.SystemDefcon1 button');
    page.waitForElementNotPresent('.SystemDefcon1', 5000);
    page.click('.header__menu__element .fa-trash-o');
    expectInstall(browser, page, 'success', 'Workspace OK', true);
  },

  after: function(browser) {
    page.close();
  }
}
