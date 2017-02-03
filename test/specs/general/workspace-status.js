var page;
var modelSelector = '.quadrant:nth-child(2) .canvas-element.Model:last-child';

module.exports = {
  'Workspace status: ok by default': function(browser) {
    page = browser.page.lunchBadger();
    page.open();

    page.expect.element('.workspace-status').to.be.present;
    page.expect.element('.workspace-status i').to.have.attribute('class')
      .which.contains('workspace-status__success').after(5000);
  },

  'Workspace status: info panel shows OK status': function(browser) {
    browser.click('.workspace-status i');
    page.expect.element('.workspace-status__info').to.be.visible.after(1000);
    page.expect.element('.workspace-status__info').text.to.contain('Workspace OK');
  },

  'Workspace status: info panel can close': function(browser) {
    browser.click('.workspace-status i');
    page.expect.element('.workspace-status__info').to.not.be.present.after(1000);
  },

  'Workspace status: error when bad configuration': function(browser) {
    page.addElement('.model.tool');
    browser.pause(500);
    // the name "Model" should cause an error as it is already used within
    // LoopBack
    page.setValue(modelSelector + ' .canvas-element__title .canvas-element__input', 'Model');
    browser.click(modelSelector + ' .canvas-element__button');

    page.expect.element('.workspace-status i').to.have.attribute('class')
      .which.contains('workspace-status__failure').after(5000);
  },

  'Workspace status: info panel shows error': function(browser) {
    browser.click('.workspace-status i');
    page.expect.element('.workspace-status__info').text.to.contain('Model must be a descendant of loopback.Model').after(1000);
    browser.click('.workspace-status i');
  },

  after: function() {
    page.close();
  }
}
