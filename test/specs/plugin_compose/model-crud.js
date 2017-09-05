var page;

function getModelSelector (nth) {
  return '.quadrant:nth-child(2) .Entity.Model:nth-child(' + nth + ')';
}

module.exports = {
  'Compose plugin: CRUD on canvas': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.expect.element('.Aside.disabled').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    // create Car model
    page.addElement('model');
    browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
    page.clearValue(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.clearValue(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Car');
    browser.pause(1000);
    browser.moveToElement(getModelSelector(1) + ' .submit', 5, 5, function() {
      browser.click(getModelSelector(1) + ' .submit');
    });
    browser.waitForElementNotPresent('.Aside.disabled', 5000);
    browser.pause(3000);

    // create Driver model
    page.addElement('model');
    browser.waitForElementPresent(getModelSelector(2) + ' .submit', 5000);
    page.clearValue(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.clearValue(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--input input', 'Driver');
    browser.pause(1000);
    browser.moveToElement(getModelSelector(2) + ' .submit', 5, 5, function() {
      browser.click(getModelSelector(2) + ' .submit');
    });
    browser.waitForElementNotPresent('.Aside.disabled', 5000);
    browser.pause(3000);

    // Check, if context path is car
    browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
    browser.expect.element(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--text').text.to.equal('car');

    // Update Car name into Car1 and check, if context path is car1
    browser.click(getModelSelector(1));
    browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
    browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
    browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
    browser.pause(1000);
    page.clearValue(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Car1');
    browser.moveToElement(getModelSelector(1) + ' .submit', 5, 5, function() {
      browser.click(getModelSelector(1) + ' .submit');
    });
    browser.waitForElementNotPresent('.Aside.disabled', 5000);
    browser.expect.element(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--text').text.to.equal('car1');

    // Update context path into car12 and check, if context path is car12
    browser.click(getModelSelector(1));
    browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
    browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
    browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
    browser.pause(1000);
    page.clearValue(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--input input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--input input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--input input', 'car12');
    browser.moveToElement(getModelSelector(1) + ' .submit', 5, 5, function() {
      browser.click(getModelSelector(1) + ' .submit');
    });
    browser.waitForElementNotPresent('.Aside.disabled', 5000);
    browser.expect.element(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--text').text.to.equal('car12');

    // Reload page and check, if model is consistent after reload
    browser.refresh(function () {
      page.expect.element('.Aside.disabled').to.not.be.present;
      page.expect.element('.canvas__container--editing').to.not.be.present;
      browser.waitForElementPresent(getModelSelector(1), 5000);
      browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
      browser.expect.element(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--text').text.to.equal('car12');
      browser.waitForElementPresent(getModelSelector(2), 5000);
      browser.expect.element(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');

      // Edit Car1 model, rename Car1 into Bus, rename context path into bus
      browser.click(getModelSelector(1));
      browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
      browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
      browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
      browser.pause(1000);
      page.clearValue(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', '');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input', 'Bus');
      browser.pause(1000);
      page.clearValue(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--input input');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--input input', '');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--input input', 'bus');

      // Cancel editing and check, if model is consistent with data before editing
      browser.moveToElement(getModelSelector(1) + ' .cancel', 5, 5, function() {
        browser.click(getModelSelector(1) + ' .cancel');
      });
      browser.waitForElementNotPresent(getModelSelector(1) + '.editable', 5000);
      browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
      browser.expect.element(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--text').text.to.equal('car12');

      // Edit model and check, if input fields are consistent with data before editing
      browser.click(getModelSelector(1));
      browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
      browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
      browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
      browser.pause(1000);
      browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--input input').value.to.equal('Car1');
      browser.expect.element(getModelSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1) .EntityProperty__field--input input').value.to.equal('car12');

      // Add string properties: engine, color
      // Reload page and check model data
      // Change properties: engine into windows number, color into manual boolean, add object property produced having year (number) and country (string)
      // Reload page and check model data
      // Open model in details panel and rename name into Car, context path into car, plural cars, base model as Model, set default values/notes for properties: windows: 6/note windows, manual: true/note manual, year: 2015/note year, country: USA/note country, set all properties as required and is index
      // Save model and check, if model in canvas has correct data
      // Reload page and check model data in canvas and details panel
      // Edit model in details panel, remove windows property, add new property temp (string)
      // Click on canvas and discard changes
      // Check, if model in details panel has correct data
      // Remove windows property, add new property temp (string)
      // Click on canvas and save changes
      // Reload page and check, if model in canvas and details panel has correct data
      // Edit model in details panel and add 3 user defined fields: field1/string/value1, field2/number/123, field3/object/{„abc”: 234} and 3 relations: field1/hasManu/Driver/driver1, field2/belongsTo/Car/car1, field3/hasAndBelongsToMany/Driver/driver2
      // Reload page and check, if model in details panel has correct data
      // Remove 1st user-defined field and relation, discard changes and check if model in details panel has correct data
      // Remove 1st user-defined field and relation, save changes, reload page and check if model in details panel has correct data
    });
  },

  after: function () {
    page.close();
  }
};
