var page;

module.exports = {
  '@disabled': true,
  'Tools menu: microservice selected': function (browser) {
    page = browser.page.lunchBadger();
    page
      .open()
      .addElement('microservice')
      .waitForElementPresent('.microservice.Tool.selected', 8000)
      .discardCanvasEntityChanges(page.getMicroserviceSelector(1))
      .waitForElementNotPresent('.Aside.disabled', 8000)
      .close();
  }

  //
  // 'Tools menu: portal selected': function (browser) {
  //   page.addElement('portal');
  //   browser.waitForElementPresent('.portal.Tool.selected', 8000);
  //   browser.click(publicSelector + '.Portal.editable .Button.cancel');
  //   browser.waitForElementNotPresent('.Aside.disabled', 8000);
  // }
};
