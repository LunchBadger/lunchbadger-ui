var page;

module.exports = {
  'Workspace status: ok by default': function(browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.expect.element('.workspace-status').to.be.present;
    browser.waitForElementPresent('.workspace-status .workspace-status__success', 120000);
  },

  'Workspace status: info panel shows OK status': function (browser) {
    page.moveToElement('.workspace-status', 5, 5, function () {
      page.expect.element('.workspace-status .ContextualInformationMessage').to.be.visible.after(1000);
      page.expect.element('.workspace-status .ContextualInformationMessage').text.to.contain('Workspace OK');
    });
  },

  'Workspace status: info panel can close': function (browser) {
    page.moveToElement('.header', 5, 5, function () {
      page.expect.element('.workspace-status .ContextualInformationMessage').to.not.be.present.after(1000);
    });
  },

  after: function() {
    page.close();
  }
}
