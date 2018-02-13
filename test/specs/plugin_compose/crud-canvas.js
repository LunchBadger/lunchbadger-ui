var page;

module.exports = {
  '@disabled': true,
  'Compose plugin: CRUD on canvas': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.checkEntities();

    // create Memory1 datasource
    page.addElementFromTooltip('dataSource', 'memory');
    page.setValueSlow(page.getDataSourceSelector(1) + ' .input__name input', 'Memory1');
    page.submitCanvasEntity(page.getDataSourceSelector(1));
    page.checkEntities('Memory1');

    // create Memory2 datasource
    page.addElementFromTooltip('dataSource', 'memory');
    page.setValueSlow(page.getDataSourceSelector(2) + ' .input__name input', 'Memory2');
    page.submitCanvasEntity(page.getDataSourceSelector(2));
    page.checkEntities('Memory1,Memory2');

    // create Car model
    page.addElement('model');
    page.setValueSlow(page.getModelSelector(1) + ' .input__name input', 'Car');
    page.submitCanvasEntity(page.getModelSelector(1));
    page.checkEntities('Memory1,Memory2', 'Car');

    // create Driver model
    page.addElement('model');
    page.setValueSlow(page.getModelSelector(2) + ' .input__name input', 'Driver');
    page.submitCanvasEntity(page.getModelSelector(2));
    page.checkEntities('Memory1,Memory2', 'Car,Driver');

      // connect Memory1 with Car
    page.connectPorts(page.getDataSourceSelector(1), 'out', page.getModelSelector(1), 'in');

    // check, if Memory1-car connection is present
    browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
    browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

    // reload page and check if Memory1, Memory2, Car, Driver and Memory1-Car connection are present
    page.refresh(function () {
      page.checkEntities('Memory1,Memory2', 'Car,Driver');
      browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 50000);
      browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

      // rename Memory1 into Memory1New
      page.editEntity(page.getDataSourceSelector(1));
      page.setValueSlow(page.getDataSourceSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Memory1New');
      page.submitCanvasEntity(page.getDataSourceSelector(1));
      browser.expect.element(page.getDataSourceSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1New');

      // rename Car into Car1
      page.editEntity(page.getModelSelector(1));
      page.setValueSlow(page.getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Car1');
      page.submitCanvasEntity(page.getModelSelector(1));
      browser.expect.element(page.getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');

      // check, if Memory1New-Car1 connection is present
      browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
      browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

      // reload page and check if Memory1New, Memory2, Car1, Driver and Memory1New-Car1 connection are present
      page.refresh(function () {
        page.checkEntities('Memory1New,Memory2', 'Car1,Driver');
        browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 50000);
        browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

        // reattach connection from Memory1New to Memory2
        page.connectPorts(page.getDataSourceSelector(1), 'out', page.getDataSourceSelector(2), 'out');

        // check, if Memory2-Car1 connection is present
        browser.waitForElementNotPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

        // reload page and check if Memory1New, Memory2, Car1, Driver and Memory2-Car1 connection are present
        page.refresh(function () {
          page.checkEntities('Memory1New,Memory2', 'Car1,Driver');
          browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 50000);
          browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

          // reattach connection from Car1 to Driver
          page.connectPorts(page.getModelSelector(1), 'in', page.getModelSelector(2), 'in');

          // check, if Memory2-Driver connection is present
          browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
          browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
          browser.waitForElementPresent(page.getModelSelector(2) + ' .port-in > .port__anchor--connected', 5000);

          // reload page and check if Memory1New, Memory2, Car1, Driver and Memory2-Driver connection are present
          page.refresh(function () {
            page.checkEntities('Memory1New,Memory2', 'Car1,Driver');
            browser.waitForElementNotPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
            browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
            browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 50000);
            browser.waitForElementPresent(page.getModelSelector(2) + ' .port-in > .port__anchor--connected', 50000);

            // remove Driver
            page.removeEntity(page.getModelSelector(2));

            // check, if Memory2-Driver connection is also not present
            browser.waitForElementNotPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);

            // reload page and check if Memory1New, Memory2, Car1 are present, and Memory2 connection out is not present
            page.refresh(function () {
              page.checkEntities('Memory1New,Memory2', 'Car1');
              browser.waitForElementNotPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);

              // connect Memory2 with Car1
              page.connectPorts(page.getDataSourceSelector(2), 'out', page.getModelSelector(1), 'in');

              // check, if Memory2-Car1 connection is present
              browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
              browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // remove Memory2
              page.removeEntity(page.getDataSourceSelector(2));

              // check, is Car1 connection in is also not present
              browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // reload page and check, if Memory1New and Car1 are present, and Car1 connection in is not present
              page.refresh(function () {
                page.checkEntities('Memory1New', 'Car1');
                browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
                page.close();
              });
            });
          });
        });
      });
    });
  }
};
