var page;
var microserviceSelector;
var microserviceSelector2;

module.exports = {
  // '@disabled': true,
  'Microservice: aside tools menu selected': function (browser) {
    page = browser.page.lunchBadger();
    microserviceSelector = page.getMicroserviceSelector(1);
    microserviceSelector2 = page.getMicroserviceSelector(2);
    page
      .open()
      .addElement('microservice')
      .waitForElementPresent('.microservice.Tool.selected', 8000)
      .submitCanvasEntityWithoutAutoSave(microserviceSelector);
  },
  'Microservice: unique name check': function () {
    page
      .addElement('microservice')
      .expectUniqueNameError(microserviceSelector2, 'A microservice')
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
