var page;

function getDataSourceSelector (nth) {
  return '.quadrant:first-child .Entity.DataSource:nth-child(' + nth + ')';
}

function getModelSelector (nth) {
  return '.quadrant:nth-child(2) .Entity.Model:nth-child(' + nth + ')';
}

function getDataSourceFieldSelector (nth) {
  return getDataSourceSelector(2) + ' .EntityProperties .EntityProperty:nth-child(' + nth + ') .EntityProperty__field--input input';
}

module.exports = {
  'Compose plugin: CRUD on canvas': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.checkEntities();

    // create Memory datasource
    page.addElementFromTooltip('dataSource', 'memory');
    page.submitCanvasEntity(getDataSourceSelector(1));

    // create REST datasource
    page.addElementFromTooltip('dataSource', 'rest');
    page.setValueSlow(getDataSourceFieldSelector(1), 'dumpUrl');
    page.setValueSlow(getDataSourceFieldSelector(2), 'dumpDatabase');
    page.setValueSlow(getDataSourceFieldSelector(3), 'dumpUsername');
    page.setValueSlow(getDataSourceFieldSelector(4), 'dumpPassword');
    page.submitCanvasEntity(getDataSourceSelector(2));

    // create Car model
    page.addElement('model');
    page.setValueSlow(getModelSelector(1) + ' .input__name input', 'Car');
    page.submitCanvasEntity(getModelSelector(1));

    // create Driver model
    page.addElement('model');
    page.setValueSlow(getModelSelector(2) + ' .input__name input', 'Driver');
    page.submitCanvasEntity(getModelSelector(2));

    // connect Memory with Car
    page.connectPorts(getDataSourceSelector(1), 'out', getModelSelector(1), 'in');

    // check, if Memory-car connection is present
    browser.waitForElementPresent(getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
    browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

    // reload page and check if Memory, REST, Car, Driver and Memory-Car connection are present
    browser.refresh(function () {
      page.checkEntities('Memory,REST', 'Car,Driver');
      browser.waitForElementPresent(getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 50000);
      browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

      // rename Memory into Memory1
      page.editEntity(getDataSourceSelector(1));
      page.setValueSlow(getDataSourceSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Memory1');
      page.submitCanvasEntity(getDataSourceSelector(1));
      browser.expect.element(getDataSourceSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Memory1');

      // rename Car into Car1
      page.editEntity(getModelSelector(1));
      page.setValueSlow(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Car1');
      page.submitCanvasEntity(getModelSelector(1));
      browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');

      // check, if Memory1-Car1 connection is present
      browser.waitForElementPresent(getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
      browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

      // reload page and check if Memory1, REST, Car1, Driver and Memory1-Car1 connection are present
      browser.refresh(function () {
        page.checkEntities('Memory1,REST', 'Car1,Driver');
        browser.waitForElementPresent(getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 50000);
        browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

        // reattach connection from Memory1 to REST
        page.connectPorts(getDataSourceSelector(1), 'out', getDataSourceSelector(2), 'out');

        // check, if REST-Car1 connection is present
        browser.waitForElementNotPresent(getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
        browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

        // reload page and check if Memory1, REST, Car1, Driver and REST-Car1 connection are present
        browser.refresh(function () {
          page.checkEntities('Memory1,REST', 'Car1,Driver');
          browser.waitForElementPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 50000);
          browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 50000);

          // reattach connection from Car1 to Driver
          page.connectPorts(getModelSelector(1), 'in', getModelSelector(2), 'in');

          // check, if REST-Driver connection is present
          browser.waitForElementNotPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
          browser.waitForElementPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
          browser.waitForElementPresent(getModelSelector(2) + ' .port-in > .port__anchor--connected', 5000);

          // reload page and check if Memory1, REST, Car1, Driver and REST-Driver connection are present
          browser.refresh(function () {
            page.checkEntities('Memory1,REST', 'Car1,Driver');
            browser.waitForElementNotPresent(getDataSourceSelector(1) + ' .port-out > .port__anchor--connected', 5000);
            browser.waitForElementNotPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
            browser.waitForElementPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 50000);
            browser.waitForElementPresent(getModelSelector(2) + ' .port-in > .port__anchor--connected', 50000);

            // remove Driver
            page.removeEntity(getModelSelector(2));

            // check, if REST-Driver connection is also not present
            browser.waitForElementNotPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);

            // reload page and check if Memory1, REST, Car1 are present, and REST connection out is not present
            browser.refresh(function () {
              page.checkEntities('Memory1,REST', 'Car1');
              browser.waitForElementNotPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);

              // connect REST with Car1
              page.connectPorts(getDataSourceSelector(2), 'out', getModelSelector(1), 'in');

              // check, if REST-Car1 connection is present
              browser.waitForElementPresent(getDataSourceSelector(2) + ' .port-out > .port__anchor--connected', 5000);
              browser.waitForElementPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // remove REST
              page.removeEntity(getDataSourceSelector(2));

              // check, is Car1 connection in is also not present
              browser.waitForElementNotPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);

              // reload page and check, if Memory1 and Car1 are present, and Car1 connection in is not present
              browser.refresh(function () {
                page.checkEntities('Memory1', 'Car1');
                browser.waitForElementNotPresent(getModelSelector(1) + ' .port-in > .port__anchor--connected', 5000);
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
