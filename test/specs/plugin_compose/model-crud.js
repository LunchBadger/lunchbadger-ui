var page;

function checkProperties (browser, names = '', types = '') {
  if (names === '') {
    browser.waitForElementNotPresent(page.getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1)', 5000);
  } else {
    names.split(',').forEach((name, idx) => {
      browser.expect.element(page.getModelSelector(1) + ` .Model__properties .ModelPropertyCollapsed:nth-child(${idx + 1}) .ModelProperty__col.name .EntityProperty__field--text`).text.to.equal(name);
    });
    browser.waitForElementNotPresent(page.getModelSelector(1) + ` .Model__properties .ModelPropertyCollapsed:nth-child(${names.split(',').length + 1})`, 5000);
  }
  if (types !== '') {
    types.split(',').forEach((name, idx) => {
      browser.expect.element(page.getModelSelector(1) + ` .Model__properties .ModelPropertyCollapsed:nth-child(${idx + 1}) .ModelProperty__col.type .EntityProperty__field--text`).text.to.equal(name);
    });
  }
}

function checkDetailsProperties (names = '', types = '', defaults = '', descriptions = '', requireds = '', indexes = '') {
  page.checkDetailsFields(names, 'properties', 'name');
  page.checkDetailsFields(types, 'properties', 'type', 'select');
  page.checkDetailsFields(defaults, 'properties', 'default_');
  page.checkDetailsFields(descriptions, 'properties', 'description');
  page.checkDetailsFields(requireds, 'properties', 'required', 'checkbox');
  page.checkDetailsFields(indexes, 'properties', 'index', 'checkbox');
}

function checkDetailsUDF (browser, names = '', types = '', values = '') {
  page.checkDetailsFields(names, 'userFields', 'name');
  page.checkDetailsFields(types, 'userFields', 'type', 'select');
  if (values !== '') {
    values.split(',').forEach((name, idx) => {
      if (types.split(',')[idx] === 'Object') {
        browser.expect.element(`.DetailsPanel .input__userFields${idx}value textarea:nth-child(2)`).value.to.contain('abc');
        browser.expect.element(`.DetailsPanel .input__userFields${idx}value textarea:nth-child(2)`).value.to.contain('234');
      } else {
        browser.expect.element(`.DetailsPanel .input__userFields${idx}value input`).value.to.equal(name);
      }
    });
  }
}

function checkDetailsRelations (names = '', types = '', models = '', foreignKeys = '') {
  page.checkDetailsFields(names, 'relations', 'name');
  page.checkDetailsFields(types, 'relations', 'type', 'select');
  page.checkDetailsFields(models, 'relations', 'model', 'select');
  page.checkDetailsFields(foreignKeys, 'relations', 'foreignKey');
}

module.exports = {
  '@disabled': true,
  'Compose plugin: Model CRUD': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.emptyProject();
    page.checkEntities();

    // create Car model and check, if context path is car
    page.addElement('model');
    page.setValueSlow(page.getModelSelector(1) + ' .input__name input', 'Car');
    browser.expect.element(page.getModelSelector(1) + ' .input__name input').value.to.equal('Car');
    browser.expect.element(page.getModelSelector(1) + ' .input__httppath input').value.to.equal('car');
    page.submitCanvasEntity(page.getModelSelector(1));
    page.checkEntities('', 'Car');

    // Reload page and check, if Car is present
    browser.refresh(function () {
      page.waitUntilWorkspaceLoaded();
      page.checkEntities('', 'Car');

      // create Driver model
      page.addElement('model');
      page.setValueSlow(page.getModelSelector(2) + ' .input__name input', 'Driver');
      browser.expect.element(page.getModelSelector(2) + ' .input__name input').value.to.equal('Driver');
      browser.expect.element(page.getModelSelector(2) + ' .input__httppath input').value.to.equal('driver');
      page.submitCanvasEntity(page.getModelSelector(2));
      page.checkEntities('', 'Car,Driver');

      // Reload page and check, if models are consistent after reload
      browser.refresh(function () {
        page.waitUntilWorkspaceLoaded();
        page.checkEntities('', 'Car,Driver');

        // Update Car name into Car1 and check, if context path is car1
        page.editEntity(page.getModelSelector(1));
        page.setValueSlow(page.getModelSelector(1) + ' .input__name input', 'Car1');
        browser.expect.element(page.getModelSelector(1) + ' .input__name input').value.to.equal('Car1');
        browser.expect.element(page.getModelSelector(1) + ' .input__httppath input').value.to.equal('car1');
        page.submitCanvasEntity(page.getModelSelector(1));
        page.checkEntities('', 'Car1,Driver');

        // Reload page and check, if models are consistent after reload
        browser.refresh(function () {
          page.waitUntilWorkspaceLoaded();
          page.checkEntities('', 'Car1,Driver');

          // Update context path into car12 and check, if context path is car12
          page.editEntity(page.getModelSelector(1));
          page.setValueSlow(page.getModelSelector(1) + ' .input__httppath input', 'car12');
          browser.expect.element(page.getModelSelector(1) + ' .input__httppath input').value.to.equal('car12');
          page.submitCanvasEntity(page.getModelSelector(1));
          page.checkEntities('', 'Car1,Driver', 'car12,driver');

          // Reload page and check, if model is consistent after reload
          browser.refresh(function () {
            page.waitUntilWorkspaceLoaded();
            page.checkEntities('', 'Car1,Driver', 'car12,driver');

            // Edit Car1 model, rename Car1 into Bus, rename context path into bus
            page.editEntity(page.getModelSelector(1));
            page.setValueSlow(page.getModelSelector(1) + ' .input__name input', 'Bus');
            page.setValueSlow(page.getModelSelector(1) + ' .input__httppath input', 'bus');

            // Cancel editing and check, if model is consistent with data before editing
            page.discardCanvasEntityChanges(page.getModelSelector(1));
            page.checkEntities('', 'Car1,Driver', 'car12,driver');

            // Edit model and check, if input fields are consistent with data before editing
            page.editEntity(page.getModelSelector(1));
            browser.expect.element(page.getModelSelector(1) + ' .input__name input').value.to.equal('Car1');
            browser.expect.element(page.getModelSelector(1) + ' .input__httppath input').value.to.equal('car12');

            // Add string properties: color, engine
            browser.click(page.getModelSelector(1) + ' .EntitySubElements__title__add');
            browser.click(page.getModelSelector(1) + ' .EntitySubElements__title__add');
            page.setValueSlow(page.getModelSelector(1) + ' .input__properties0name input', 'color');
            page.setValueSlow(page.getModelSelector(1) + ' .input__properties1name input', 'engine');
            page.submitCanvasEntity(page.getModelSelector(1));

            // Reload page and check model data
            browser.refresh(function () {
              page.waitUntilWorkspaceLoaded();
              page.checkEntities('', 'Car1,Driver', 'car12,driver');
              checkProperties(browser, 'color,engine', 'String,String');

              // Change properties: engine into windows number, color into manual boolean, add object property produced having year (number) and country (string)
              page.editEntity(page.getModelSelector(1));
              page.setValueSlow(page.getModelSelector(1) + ' .input__properties0name input', 'manual');
              page.selectValueSlow(page.getModelSelector(1), 'properties0type', 'Boolean');
              page.setValueSlow(page.getModelSelector(1) + ' .input__properties1name input', 'windows');
              page.selectValueSlow(page.getModelSelector(1), 'properties1type', 'Number');
              page.submitCanvasEntity(page.getModelSelector(1));

              // Reload page and check model data
              browser.refresh(function () {
                page.waitUntilWorkspaceLoaded();
                page.checkEntities('', 'Car1,Driver', 'car12,driver');
                checkProperties(browser, 'manual,windows', 'Boolean,Number');

                // Open model in details panel and rename name into Car, context path into car, plural cars, base model as Model,
                // set default values/notes for properties:
                // windows renamed as windowsNew: 6/note windows,
                // manual renamed as manualNew: true/note manual,
                // year: 2015/note year, country: USA/note country,
                // set all properties as required and is index
                page.openEntityInDetailsPanel(page.getModelSelector(1));
                page.setValueSlow('.DetailsPanel .input__httppath input', 'car');
                page.setValueSlow('.DetailsPanel .input__plural input', 'cars');
                page.selectValueSlow('.DetailsPanel', 'base', 'Model');
                page.setValueSlow('.DetailsPanel .input__properties0default_ input', 'true');
                page.setValueSlow('.DetailsPanel .input__properties0description input', 'notes manual');
                page.setValueSlow('.DetailsPanel .input__properties1default_ input', '6');
                page.setValueSlow('.DetailsPanel .input__properties1description input', 'notes windows');
                browser.click('.DetailsPanel .checkbox__properties0required');
                browser.click('.DetailsPanel .checkbox__properties0index');
                browser.click('.DetailsPanel .checkbox__properties1required');
                browser.click('.DetailsPanel .checkbox__properties1index');

                // Save model and check, if model in canvas has correct data
                page.submitDetailsPanel(page.getModelSelector(1));
                page.checkEntities('', 'Car1,Driver', 'car,driver');
                checkProperties(browser, 'manual,windows', 'Boolean,Number');

                // Reload page and check model data in canvas and details panel
                browser.refresh(function () {
                  page.waitUntilWorkspaceLoaded();
                  page.checkEntities('', 'Car1,Driver', 'car,driver');
                  checkProperties(browser, 'manual,windows', 'Boolean,Number');
                  page.openEntityInDetailsPanel(page.getModelSelector(1));
                  page.checkModelDetails('Car1', 'car', 'cars', 'Model');
                  checkDetailsProperties('manual,windows', 'Boolean,Number', 'true,6', 'notes manual,notes windows', 'checked,checked', 'checked,checked');
                  checkDetailsRelations();
                  checkDetailsUDF(browser);

                  // Edit model in details panel, rename context path into bus
                  // remove windows property, add new property temp (string)
                  page.setValueSlow('.DetailsPanel .input__httppath input', 'bus');
                  browser.click('.button__remove__property0');
                  browser.click('.button__add__property');
                  browser.pause(1000);
                  page.setValueSlow('.DetailsPanel .input__properties1name input', 'temp');
                  page.checkModelDetails('Car1', 'bus', 'cars', 'Model');
                  checkDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked');

                  // Click on canvas and discard changes
                  page.discardDetailsPanelChanges(page.getModelSelector(1));

                  // Check, if model in details panel has correct data
                  page.checkModelDetails('Car1', 'car', 'cars', 'Model');
                  checkDetailsProperties('manual,windows', 'Boolean,Number', 'true,6', 'notes manual,notes windows', 'checked,checked', 'checked,checked');

                  // Rename context path into bus
                  // Remove windows property, add new property temp (string)
                  page.setValueSlow('.DetailsPanel .input__httppath input', 'bus');
                  browser.click('.button__remove__property0');
                  browser.click('.button__add__property');
                  browser.pause(1000);
                  page.setValueSlow('.DetailsPanel .input__properties1name input', 'temp');
                  page.checkModelDetails('Car1', 'bus', 'cars', 'Model');
                  checkDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked');

                  // Click on canvas and save changes
                  page.confirmDetailsPanelChanges(page.getModelSelector(1));

                  // Reload page and check, if model in canvas and details panel has correct data
                  browser.refresh(function () {
                    page.waitUntilWorkspaceLoaded();
                    page.checkEntities('', 'Car1,Driver', 'bus,driver');
                    checkProperties(browser, 'windows,temp', 'Number,String');
                    page.openEntityInDetailsPanel(page.getModelSelector(1));
                    page.checkModelDetails('Car1', 'bus', 'cars', 'Model');
                    checkDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked');
                    checkDetailsRelations();
                    checkDetailsUDF(browser);

                    // Edit model in details panel and add 3 user defined fields:
                    // field1/string/value1, field2/number/12, field3/object/{„abc”: 234}
                    // and 3 relations: relation1/hasManu/Driver/driver1, relation2/belongsTo/Car/car1,
                    // relation3/hasAndBelongsToMany/Driver/driver2
                    browser.click('.button__add__udf');
                    browser.click('.button__add__udf');
                    browser.click('.button__add__udf');
                    browser.pause(1000);
                    page.setValueSlow('.DetailsPanel .input__userFields0name input', 'field1');
                    page.setValueSlow('.DetailsPanel .input__userFields0value input', 'value1');
                    page.setValueSlow('.DetailsPanel .input__userFields1name input', 'field2');
                    page.selectValueSlow('.DetailsPanel', 'userFields1type', 'Number');
                    page.setValueSlow('.DetailsPanel .input__userFields1value input', '12');
                    page.setValueSlow('.DetailsPanel .input__userFields2name input', 'field3');
                    page.selectValueSlow('.DetailsPanel', 'userFields2type', 'Object');
                    page.setValueSlow('.DetailsPanel .input__userFields2value textarea:nth-child(2)', '{"abc": 234}');
                    browser.click('.button__add__relation');
                    browser.click('.button__add__relation');
                    browser.click('.button__add__relation');
                    browser.pause(1000);
                    page.setValueSlow('.DetailsPanel .input__relations0name input', 'relation1');
                    page.selectValueSlow('.DetailsPanel', 'relations0type', 'hasMany');
                    page.selectValueSlow('.DetailsPanel', 'relations0model', 'Driver');
                    page.setValueSlow('.DetailsPanel .input__relations0foreignKey input', 'driver1');
                    page.setValueSlow('.DetailsPanel .input__relations1name input', 'relation2');
                    page.selectValueSlow('.DetailsPanel', 'relations1type', 'belongsTo');
                    page.selectValueSlow('.DetailsPanel', 'relations1model', 'Car1');
                    page.setValueSlow('.DetailsPanel .input__relations1foreignKey input', 'bus1');
                    page.setValueSlow('.DetailsPanel .input__relations2name input', 'relation3');
                    page.selectValueSlow('.DetailsPanel', 'relations2type', 'hasAndBelongsToMany');
                    page.selectValueSlow('.DetailsPanel', 'relations2model', 'Car1');
                    page.setValueSlow('.DetailsPanel .input__relations2foreignKey input', 'bus2');
                    page.submitDetailsPanel(page.getModelSelector(1));

                    // Reload page and check, if model in details panel has correct data
                    browser.refresh(function () {
                      page.waitUntilWorkspaceLoaded();
                      page.checkEntities('', 'Car1,Driver', 'bus,driver');
                      checkProperties(browser, 'windows,temp', 'Number,String');
                      page.openEntityInDetailsPanel(page.getModelSelector(1));
                      page.checkModelDetails('Car1', 'bus', 'cars', 'Model');
                      checkDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked');
                      checkDetailsUDF(browser, 'field1,field2,field3', 'String,Number,Object', 'value1,12,');
                      checkDetailsRelations('relation1,relation2,relation3', 'hasMany,belongsTo,hasAndBelongsToMany', 'Driver,Car1,Car1', 'driver1,bus1,bus2');

                      // Remove 1st user-defined field and relation, discard changes
                      // and check if model in details panel has correct data
                      browser.click('.button__remove__udf0');
                      browser.click('.button__remove__relation0');
                      browser.waitForElementNotPresent('.DetailsPanel .input__userFields2name', 5000);
                      browser.waitForElementNotPresent('.DetailsPanel .input__relations2name', 5000);
                      browser.pause(1000);
                      checkDetailsUDF(browser, 'field2,field3', 'Number,Object', '12,');
                      checkDetailsRelations('relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Car1,Car1', 'bus1,bus2');
                      page.discardDetailsPanelChanges(page.getModelSelector(1));
                      page.checkModelDetails('Car1', 'bus', 'cars', 'Model');
                      checkDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked');
                      checkDetailsUDF(browser, 'field1,field2,field3', 'String,Number,Object', 'value1,12,');
                      checkDetailsRelations('relation1,relation2,relation3', 'hasMany,belongsTo,hasAndBelongsToMany', 'Driver,Car1,Car1', 'driver1,bus1,bus2');

                      // Remove 1st user-defined field and relation, save changes
                      // and check if model in details panel has correct data
                      browser.click('.button__remove__udf0');
                      browser.click('.button__remove__relation0');
                      browser.waitForElementNotPresent('.DetailsPanel .input__userFields2name', 5000);
                      browser.waitForElementNotPresent('.DetailsPanel .input__relations2name', 5000);
                      browser.pause(1000);
                      checkDetailsUDF(browser, 'field2,field3', 'Number,Object', '12,');
                      checkDetailsRelations('relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Car1,Car1', 'bus1,bus2');
                      page.confirmDetailsPanelChanges(page.getModelSelector(1));
                      checkDetailsUDF(browser, 'field2,field3', 'Number,Object', '12,');
                      checkDetailsRelations('relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Car1,Car1', 'bus1,bus2');

                      // reload page and check if model in details panel has correct data
                      browser.refresh(function () {
                        page.waitUntilWorkspaceLoaded();
                        page.checkEntities('', 'Car1,Driver', 'bus,driver');
                        checkProperties(browser, 'windows,temp', 'Number,String');
                        page.openEntityInDetailsPanel(page.getModelSelector(1));
                        page.checkModelDetails('Car1', 'bus', 'cars', 'Model');
                        checkDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked');
                        checkDetailsUDF(browser, 'field2,field3', 'Number,Object', '12,');
                        checkDetailsRelations('relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Car1,Car1', 'bus1,bus2');
                      });
                    });
                  });
                });
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
