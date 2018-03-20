var page;
var microserviceSelector1;
var microserviceSelector2;

module.exports = {
  // '@disabled': true,
  'Unique entities names: microservices': function (browser) {
    page = browser.page.lunchBadger();
    microserviceSelector1 = page.getMicroserviceSelector(1);
    microserviceSelector2 = page.getMicroserviceSelector(2);
    page
      .open()
      .addElement('microservice')
      .submitCanvasEntityWithoutAutoSave(microserviceSelector1)
      .addElement('microservice')
      .expectUniqueNameError(microserviceSelector2, 'A microservice')
      .close();
  }
};
