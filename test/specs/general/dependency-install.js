var page;

function expectStatus(browser, status, error) {
  browser.waitForElementPresent('.workspace-status .workspace-status__progress', 120000);
  browser.waitForElementPresent(`.workspace-status .workspace-status__${status}`, 5 * 60 * 1000);
  if (status === 'failure') {
    browser.click('.workspace-status span');
    browser.waitForElementPresent('.SystemDefcon1 .SystemDefcon1__box__content__details--box', 5000);
    page.expect.element('.SystemDefcon1 .SystemDefcon1__box__content__details--box').text.to.contain(error).before(5 * 60 * 1000);
  }
}

module.exports = {
  // '@disabled': true,
  'Dependency installation': function(browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.emptyProject();

    //Connector installation: data source add
    page.addElementFromTooltip('dataSource', 'rest');
    page.setValueSlow(page.getDataSourceSelector(1) + ' .input__operations0templateurl input', 'http://dumpUrl');
    page.submitCanvasEntity(page.getDataSourceSelector(1));
    expectStatus(browser, 'success');

    // Connector installation: add more data source
    page.addElementFromTooltip('dataSource', 'soap');
    page.setValueSlow(page.getDataSourceSelector(2) + ' .input__url input', 'https://www.lunchbadger.com');
    page.submitCanvasEntity(page.getDataSourceSelector(2));
    expectStatus(browser, 'failure', 'WSDL');
    browser.click('.SystemDefcon1 button');
    browser.waitForElementNotPresent('.SystemDefcon1', 5000);
    page.addElementFromTooltip('dataSource', 'mongodb');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__host input', 'dumpUrl');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__port input', '9999');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__database input', 'dumpDatabase');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__username input', 'dumpUsername');
    page.setValueSlow(page.getDataSourceSelector(3) + ' .input__password input', 'dumpPassword');
    page.submitCanvasEntity(page.getDataSourceSelector(3));
    expectStatus(browser, 'failure', 'ENOTFOUND');

    // Connector uninstallation: remove datasource
    browser.click('.SystemDefcon1 button');
    browser.waitForElementNotPresent('.SystemDefcon1', 5000);
    browser.click(page.getDataSourceSelector(3));
    browser.waitForElementVisible(page.getDataSourceSelector(3) + ' .Toolbox__button--delete', 50000);
    browser.click(page.getDataSourceSelector(3) + ' .Toolbox__button--delete');
    browser.waitForElementPresent('.ConfirmModal .confirm', 5000);
    browser.click('.ConfirmModal .confirm');
    expectStatus(browser, 'failure', 'WSDL');

    // Connector uninstallation: trash workspace and reload page
    browser.click('.SystemDefcon1 button');
    page.clearProject();
    browser.waitForElementPresent('.workspace-status .workspace-status__progress', 120000);
    browser.waitForElementNotPresent('.spinner__overlay', 60000);
    browser.waitForElementNotPresent('.workspace-status .workspace-status__progress', 120000);
    browser.pause(10000);
    browser.refresh(function () {
      browser.waitForElementPresent('.workspace-status .workspace-status__success', 120000);
    });

    page.close();
  }
}
