var page;

module.exports = {
  '@disabled': true,
  'Workspace status': function(browser) {
    page = browser.page.lunchBadger();
    page
      .open()
      .waitForElementPresent('.workspace-status .workspace-status__success', 120000)
      .checkStatusTooltip('Workspace OK')
      .checkStatusTooltipNotPresent('Workspace OK')
      .close();
  }
}
