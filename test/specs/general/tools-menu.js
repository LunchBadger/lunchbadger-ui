var page;
var privateSelector = '.quadrant:nth-child(2) .Entity:last-child';
// var publicSelector = '.quadrant:nth-child(4) .Entity:last-child';

module.exports = {
  '@disabled': true,
  'Tools menu: microservice selected': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.addElement('microservice');
    browser.waitForElementPresent('.microservice.Tool.selected', 8000);
    browser.click(privateSelector + '.Microservice.editable .Button.cancel');
    browser.waitForElementNotPresent('.Aside.disabled', 8000);
    page.close();
  }

  //
  // 'Tools menu: portal selected': function (browser) {
  //   page.addElement('portal');
  //   browser.waitForElementPresent('.portal.Tool.selected', 8000);
  //   browser.click(publicSelector + '.Portal.editable .Button.cancel');
  //   browser.waitForElementNotPresent('.Aside.disabled', 8000);
  // }
};
