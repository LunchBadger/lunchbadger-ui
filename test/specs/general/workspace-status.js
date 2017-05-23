var page;
var modelSelector = '.quadrant:nth-child(2) .Entity.Model:last-child';

module.exports = {
  'Workspace status: ok by default': function(browser) {
    page = browser.page.lunchBadger();
    page.open();

    page.expect.element('.workspace-status').to.be.present;
    page.expect.element('.workspace-status span').to.have.attribute('class')
      .which.contains('workspace-status__success').after(5000);
  },

  'Workspace status: info panel shows OK status': function(browser) {
    page.moveToElement('.workspace-status', 5, 5, function () {
      page.expect.element('.workspace-status .ContextualInformationMessage').to.be.visible.after(1000);
      page.expect.element('.workspace-status .ContextualInformationMessage').text.to.contain('Workspace OK');
    });
  },

  'Workspace status: info panel can close': function(browser) {
    page.moveToElement('.header', 5, 5, function () {
      page.expect.element('.workspace-status .ContextualInformationMessage').to.not.be.present.after(1000);
    });
  },

  after: function() {
    page.close();
  }
}
