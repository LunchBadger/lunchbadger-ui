var page;

const elementSelector = '.quadrant:nth-child(1) .Entity.DataSource:last-child';

function expectInstall(page, finalStatus, finalMsg) {
  page.expect.element('.workspace-status span').to.have.attribute('class')
    .which.contains('workspace-status__progress').before(1000);
  page.expect.element('.workspace-status__info')
    .text.to.contain('Updating dependencies')

  page.expect.element('.workspace-status span').to.have.attribute('class')
    .which.contains(`workspace-status__${finalStatus}`).before(30000);
  page.expect.element('.workspace-status__info').text.to.contain(finalMsg);
}

module.exports = {
  'Connector installation: data source add': function(browser) {
    page = browser.page.lunchBadger();
    page.open();
    browser.click('.workspace-status span');

    page.addElementFromTooltip('.dataSource.tool', 2);
    browser.pause(1000);
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input', 'dumpUrl');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input', 'dumpDatabase');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input', 'dumpUsername');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input', 'dumpPassword');
    browser.click(elementSelector + '.editable button[type=submit]');
    browser.pause(2000);

    expectInstall(page, 'success', 'Workspace OK');
  },

  'Connector installation: add more data source': function(browser) {
    page.addElementFromTooltip('.dataSource.tool', 3);
    browser.pause(1000);
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input', 'dumpUrl');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input', 'dumpDatabase');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input', 'dumpUsername');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input', 'dumpPassword');
    browser.click(elementSelector + '.editable button[type=submit]');
    browser.pause(2000);

    page.addElementFromTooltip('.dataSource.tool', 4);
    browser.pause(1000);
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input', 'dumpUrl');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input', 'dumpDatabase');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input', 'dumpUsername');
    page.setValue(elementSelector + '.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input', 'dumpPassword');
    browser.click(elementSelector + '.editable button[type=submit]');
    browser.pause(2000);

    expectInstall(page, 'failure', '?wsdl')
  },

  'Connector uninstallation: remove datasource': function(browser) {
    page.click(elementSelector + ' .Toolbox__button--delete');
    browser.pause(1000);
    page.click('.modal__actions__button.modal__actions__button--confirm');

    expectInstall(page, 'failure', '?wsdl');
  },

  'Connector uninstallation: trash workspace': function(browser) {
    page.click('.header__menu__element .fa-trash-o');

    expectInstall(page, 'success', 'Workspace OK');
  },

  after: function(browser) {
    page.close();
  }
}
