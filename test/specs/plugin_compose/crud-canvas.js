var page;

module.exports = {
  'Compose plugin: CRUD on canvas': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.checkEntities();

    // create Memory datasource
    page.addElementFromTooltip('dataSource', 'memory');
    page.submitCanvasEntity(page.getDataSourceSelector(1));

    // create REST datasource
    page.addElementFromTooltip('dataSource', 'rest');
    page.setValueSlow(page.getDataSourceFieldSelector(2, 1), 'dumpUrl');
    page.submitCanvasEntity(page.getDataSourceSelector(2));

    // create Car model
    page.addElement('model');
    page.setValueSlow(page.getModelSelector(1) + ' .input__name input', 'Car');
    page.submitCanvasEntity(page.getModelSelector(1));

    // create Driver model
    page.addElement('model');
    page.setValueSlow(page.getModelSelector(2) + ' .input__name input', 'Driver');
    page.submitCanvasEntity(page.getModelSelector(2));

    // connect Memory with Car
    page.connectPorts(page.getDataSourceSelector(1), 'out', page.getModelSelector(1), 'in');

    // check, if Memory-car connection is present
    browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
    browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

    // reload page and check if Memory, REST, Car, Driver and Memory-Car connection are present
    browser.refresh(function () {
      page.checkEntities('Memory,REST', 'Car,Driver');
      browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 50000);
      browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

      // rename Memory into Memory1
      page.editEntity(page.getDataSourceSelector(1));
      page.setValueSlow(page.getDataSourceSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Memory1');
      page.submitCanvasEntity(page.getDataSourceSelector(1));
      browser.expect.element(page.getDataSourceSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');

      // rename Car into Car1
      page.editEntity(page.getModelSelector(1));
      page.setValueSlow(page.getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Car1');
      page.submitCanvasEntity(page.getModelSelector(1));
      browser.expect.element(page.getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');

      // check, if Memory1-Car1 connection is present
      browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
      browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

      // reload page and check if Memory1, REST, Car1, Driver and Memory1-Car1 connection are present
      browser.refresh(function () {
        page.checkEntities('Memory1,REST', 'Car1,Driver');
        browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 50000);
        browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

        // reattach connection from Memory1 to REST
        page.connectPorts(page.getDataSourceSelector(1), 'out', page.getDataSourceSelector(2), 'out');

        // check, if REST-Car1 connection is present
        browser.waitForElementNotPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

        // reload page and check if Memory1, REST, Car1, Driver and REST-Car1 connection are present
        browser.refresh(function () {
          page.checkEntities('Memory1,REST', 'Car1,Driver');
          browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 50000);
          browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

          // reattach connection from Car1 to Driver
          page.connectPorts(page.getModelSelector(1), 'in', page.getModelSelector(2), 'in');

          // check, if REST-Driver connection is present
          browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
          browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
          browser.waitForElementPresent(page.getModelSelector(2) + ' .port-in > .port__anchor--connected', 5000);

          // reload page and check if Memory1, REST, Car1, Driver and REST-Driver connection are present
          browser.refresh(function () {
            page.checkEntities('Memory1,REST', 'Car1,Driver');
            browser.waitForElementNotPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
            browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
            browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 50000);
            browser.waitForElementPresent(page.getModelSelector(2) + ' .port-in > .port__anchor--connected', 50000);

            // remove Driver
            page.removeEntity(page.getModelSelector(2));

            // check, if REST-Driver connection is also not present
            browser.waitForElementNotPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);

            // reload page and check if Memory1, REST, Car1 are present, and REST connection out is not present
            browser.refresh(function () {
              page.checkEntities('Memory1,REST', 'Car1');
              browser.waitForElementNotPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);

              // connect REST with Car1
              page.connectPorts(page.getDataSourceSelector(2), 'out', page.getModelSelector(1), 'in');

              // check, if REST-Car1 connection is present
              browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
              browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // remove REST
              page.removeEntity(getDataSourceSelector(2));

              // check, is Car1 connection in is also not present
              browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // reload page and check, if Memory1 and Car1 are present, and Car1 connection in is not present
              browser.refresh(function () {
                page.checkEntities('Memory1', 'Car1');
                browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
              });
            });
          });
        });
      });
    });
  },

  after: function () {
    page.close();
  }
};
