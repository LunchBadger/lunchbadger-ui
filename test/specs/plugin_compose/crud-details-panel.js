var page;

module.exports = {
  'Compose plugin: CRUD on details panel': function (browser) {
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
    page.openEntityInDetailsPanel(page.getModelSelector(1));
    page.selectValueSlow('.DetailsPanel', 'dataSource', 'Memory');
    page.submitDetailsPanel(page.getModelSelector(1));
    page.closeDetailsPanel();

    // check, if Memory-car connection is present
    browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
    browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

    // reload page and check if Memory, REST, Car, Driver and Memory-Car connection are present
    browser.refresh(function () {
      page.checkEntities('Memory,REST', 'Car,Driver');
      browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 50000);
      browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

      // rename Memory into Memory1
      page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
      page.setValueSlow('.DetailsPanel .panel__details--name input', 'Memory1');
      page.submitDetailsPanel(page.getDataSourceSelector(1));
      page.closeDetailsPanel();
      browser.expect.element(page.getDataSourceSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');

      // rename Car into Car1
      page.openEntityInDetailsPanel(page.getModelSelector(1));
      page.setValueSlow('.DetailsPanel .panel__details--name input', 'Car1');
      page.submitDetailsPanel(page.getModelSelector(1));
      page.closeDetailsPanel();
      browser.expect.element(page.getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');

      // check, if Memory1-Car1 connection is present
      browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
      browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

      // reload page and check if Memory1, REST, Car1, Driver and Memory1-Car1 connection are present
      browser.refresh(function () {
        page.checkEntities('Memory1,REST', 'Car1,Driver', 'car,driver');
        browser.waitForElementPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 50000);
        browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

        // reattach connection from Memory1 to REST
        page.openEntityInDetailsPanel(page.getModelSelector(1));
        page.selectValueSlow('.DetailsPanel', 'dataSource', 'REST');
        page.submitDetailsPanel(page.getModelSelector(1));
        page.closeDetailsPanel();

        // check, if REST-Car1 connection is present
        browser.waitForElementNotPresent(page.getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

        // reload page and check if Memory1, REST, Car1, Driver and REST-Car1 connection are present
        browser.refresh(function () {
          page.checkEntities('Memory1,REST', 'Car1,Driver', 'car,driver');
          browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 50000);
          browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

          // reattach connection from Car1 to Driver
          page.openEntityInDetailsPanel(page.getModelSelector(1));
          page.selectValueSlow('.DetailsPanel', 'dataSource', 'None');
          page.submitDetailsPanel(page.getModelSelector(1));
          page.closeDetailsPanel();
          page.openEntityInDetailsPanel(page.getModelSelector(2));
          page.selectValueSlow('.DetailsPanel', 'dataSource', 'REST');
          page.submitDetailsPanel(page.getModelSelector(2));
          page.closeDetailsPanel();

          // check, if REST-Driver connection is present
          browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
          browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
          browser.waitForElementPresent(page.getModelSelector(2) + ' .port-in > .port__anchor--connected', 5000);

          // reload page and check if Memory1, REST, Car1, Driver and REST-Driver connection are present
          browser.refresh(function () {
            page.checkEntities('Memory1,REST', 'Car1,Driver', 'car,driver');
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
              page.checkEntities('Memory1,REST', 'Car1', 'car');
              browser.waitForElementNotPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);

              // connect REST with Car1
              page.openEntityInDetailsPanel(page.getModelSelector(1));
              page.selectValueSlow('.DetailsPanel', 'dataSource', 'REST');
              page.submitDetailsPanel(page.getModelSelector(1));
              page.closeDetailsPanel();

              // check, if REST-Car1 connection is present
              browser.waitForElementPresent(page.getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
              browser.waitForElementPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // remove REST
              page.removeEntity(page.getDataSourceSelector(2));

              // check, is Car1 connection in is also not present
              browser.waitForElementNotPresent(page.getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // reload page and check, if Memory1 and Car1 are present, and Car1 connection in is not present
              browser.refresh(function () {
                page.checkEntities('Memory1', 'Car1', 'car');
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
