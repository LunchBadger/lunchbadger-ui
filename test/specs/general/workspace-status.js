var page;

module.exports = {
  '@disabled': true,
  'Workspace status': function(browser) {
    page = browser.page.lunchBadger();
    page.open();

    // OK by default
    page.expect.element('.workspace-status').to.be.present;
    browser.waitForElementPresent('.workspace-status .workspace-status__success', 120000);

    browser.pause(10000);

    // info panel shows OK status
    page.moveToElement('.workspace-status', 5, 5, function () {
      page.expect.element('.ContextualInformationMessage.Workspace-OK .rc-tooltip-inner').text.to.contain('Workspace OK').before(6000);
    });

    // info panel can close
    page.moveToElement('.header', 5, 5, function () {
      page.waitForElementNotPresent('.ContextualInformationMessage.Workspace-OK', 3000);
    });

    page.close();
  }
}
