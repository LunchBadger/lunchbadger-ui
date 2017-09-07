var page;

function getModelSelector (nth) {
  return '.quadrant:nth-child(2) .Entity.Model:nth-child(' + nth + ')';
}

function checkDetailsFields (browser, names, prefix, postfix, kind = 'string') {
  if (names === '') {
    browser.waitForElementNotPresent(`.DetailsPanel .input__${prefix}0${postfix}`, 5000);
  } else {
    names.split(',').forEach((name, idx) => {
      if (kind === 'select') {
        browser.expect.element(`.DetailsPanel .select__${prefix}${idx}${postfix}`).text.to.equal(name);
      } else if (kind === 'checkbox') {
        browser.expect.element(`.DetailsPanel .checkbox__${prefix}${idx}${postfix}__${name}`).to.be.present;
      } else {
        browser.expect.element(`.DetailsPanel .input__${prefix}${idx}${postfix} input`).value.to.equal(name);
      }
    });
    browser.waitForElementNotPresent(`.DetailsPanel .input__properties${names.split(',').length}name`, 5000);
  }
}

function checkProperties (browser, names = '', types = '') {
  if (names === '') {
    browser.waitForElementNotPresent(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1)', 5000);
  } else {
    names.split(',').forEach((name, idx) => {
      browser.expect.element(getModelSelector(1) + ` .Model__properties .ModelPropertyCollapsed:nth-child(${idx + 1}) .ModelProperty__col.name .EntityProperty__field--text`).text.to.equal(name);
    });
    browser.waitForElementNotPresent(getModelSelector(1) + ` .Model__properties .ModelPropertyCollapsed:nth-child(${names.split(',').length + 1})`, 5000);
  }
  if (types !== '') {
    types.split(',').forEach((name, idx) => {
      browser.expect.element(getModelSelector(1) + ` .Model__properties .ModelPropertyCollapsed:nth-child(${idx + 1}) .ModelProperty__col.type .EntityProperty__field--text`).text.to.equal(name);
    });
  }
}

function checkDetailsProperties (browser, names = '', types = '', defaults = '', descriptions = '', requireds = '', indexes = '') {
  checkDetailsFields(browser, names, 'properties', 'name');
  checkDetailsFields(browser, types, 'properties', 'type', 'select');
  checkDetailsFields(browser, defaults, 'properties', 'default_');
  checkDetailsFields(browser, descriptions, 'properties', 'description');
  checkDetailsFields(browser, requireds, 'properties', 'required', 'checkbox');
  checkDetailsFields(browser, indexes, 'properties', 'index', 'checkbox');
}

function checkDetailsUDF (browser, names = '', types = '', values = '') {
  checkDetailsFields(browser, names, 'userFields', 'name');
  checkDetailsFields(browser, types, 'userFields', 'type', 'select');
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

function checkDetailsRelations (browser, names = '', types = '', models = '', foreignKeys = '') {
  checkDetailsFields(browser, names, 'relations', 'name');
  checkDetailsFields(browser, types, 'relations', 'type', 'select');
  checkDetailsFields(browser, models, 'relations', 'model', 'select');
  checkDetailsFields(browser, foreignKeys, 'relations', 'foreignKey');
}

module.exports = {
  'Compose plugin: Model CRUD': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.checkEntities();

    // create Car model and check, if context path is car
    page.addElement('model');
    page.setValueSlow(getModelSelector(1) + ' .input__name input', 'Car');
    page.submitCanvasEntity(getModelSelector(1));
    page.checkEntities('', 'Car');

    // create Driver model
    page.addElement('model');
    page.setValueSlow(getModelSelector(2) + ' .input__name input', 'Driver');
    page.submitCanvasEntity(getModelSelector(2));
    page.checkEntities('', 'Car,Driver');

    // Update Car name into Car1 and check, if context path is car1
    page.editEntity(getModelSelector(1));
    page.setValueSlow(getModelSelector(1) + ' .input__name input', 'Car1');
    page.submitCanvasEntity(getModelSelector(1));
    page.checkEntities('', 'Car1,Driver');

    // Update context path into car12 and check, if context path is car12
    page.editEntity(getModelSelector(1));
    page.setValueSlow(getModelSelector(1) + ' .input__httppath input', 'car12');
    page.submitCanvasEntity(getModelSelector(1));
    page.checkEntities('', 'Car1,Driver', 'car12,driver');

    // Reload page and check, if model is consistent after reload
    browser.refresh(function () {
      page.checkEntities('', 'Car1,Driver', 'car12,driver');

      // Edit Car1 model, rename Car1 into Bus, rename context path into bus
      page.editEntity(getModelSelector(1));
      page.setValueSlow(getModelSelector(1) + ' .input__name input', 'Bus');
      page.setValueSlow(getModelSelector(1) + ' .input__httppath input', 'bus');

      // Cancel editing and check, if model is consistent with data before editing
      page.discardCanvasEntityChanges(getModelSelector(1));
      page.checkEntities('', 'Car1,Driver', 'car12,driver');

      // Edit model and check, if input fields are consistent with data before editing
      page.editEntity(getModelSelector(1));
      browser.expect.element(getModelSelector(1) + ' .input__name input').value.to.equal('Car1');
      browser.expect.element(getModelSelector(1) + ' .input__httppath input').value.to.equal('car12');

      // Add string properties: color, engine
      browser.click(getModelSelector(1) + ' .EntitySubElements__title__add');
      browser.click(getModelSelector(1) + ' .EntitySubElements__title__add');
      page.setValueSlow(getModelSelector(1) + ' .input__properties0name input', 'color');
      page.setValueSlow(getModelSelector(1) + ' .input__properties1name input', 'engine');
      page.submitCanvasEntity(getModelSelector(1));

      // Reload page and check model data
      browser.refresh(function () {
        page.checkEntities('', 'Car1,Driver', 'car12,driver');
        checkProperties(browser, 'color,engine', 'String,String');

        // Change properties: engine into windows number, color into manual boolean, add object property produced having year (number) and country (string)
        page.editEntity(getModelSelector(1));
        page.setValueSlow(getModelSelector(1) + ' .input__properties0name input', 'manual');
        page.selectValueSlow(getModelSelector(1), 'properties0type', 'Boolean');
        page.setValueSlow(getModelSelector(1) + ' .input__properties1name input', 'windows');
        page.selectValueSlow(getModelSelector(1), 'properties1type', 'Number');
        page.submitCanvasEntity(getModelSelector(1));

        // Reload page and check model data
        browser.refresh(function () {
          page.checkEntities('', 'Car1,Driver', 'car12,driver');
          checkProperties(browser, 'manual,windows', 'Boolean,Number');

          // Open model in details panel and rename name into Car, context path into car, plural cars, base model as Model,
          // set default values/notes for properties:
          // windows renamed as windowsNew: 6/note windows,
          // manual renamed as manualNew: true/note manual,
          // year: 2015/note year, country: USA/note country,
          // set all properties as required and is index
          page.openEntityInDetailsPanel(getModelSelector(1));
          page.setValueSlow('.DetailsPanel .input__name input', 'Car');
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
          page.submitDetailsPanel(getModelSelector(1));
          page.closeDetailsPanel();
          page.checkEntities('', 'Car,Driver');
          checkProperties(browser, 'manual,windows', 'Boolean,Number');

          // Reload page and check model data in canvas and details panel
          browser.refresh(function () {
            page.checkEntities('', 'Car,Driver');
            checkProperties(browser, 'manual,windows', 'Boolean,Number');
            page.openEntityInDetailsPanel(getModelSelector(1));
            page.checkModelDetails('Car', 'car', 'cars', 'Model');
            checkDetailsProperties(browser, 'manual,windows', 'Boolean,Number', 'true,6', 'notes manual,notes windows', 'checked,checked', 'checked,checked');
            checkDetailsRelations(browser);
            checkDetailsUDF(browser);

            // Edit model in details panel, rename model into Bus, rename context path into bus
            // remove windows property, add new property temp (string)
            page.setValueSlow('.DetailsPanel .input__name input', 'Bus');
            page.setValueSlow('.DetailsPanel .input__httppath input', 'bus');
            browser.click('.button__remove__property0');
            browser.click('.button__add__property');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__properties1name input', 'temp');
            page.checkModelDetails('Bus', 'bus', 'cars', 'Model');
            checkDetailsProperties(browser, 'windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked');

            // Click on canvas and discard changes
            page.discardDetailsPanelChanges();

            // Check, if model in details panel has correct data
            page.checkModelDetails('Car', 'car', 'cars', 'Model');
            checkDetailsProperties(browser, 'manual,windows', 'Boolean,Number', 'true,6', 'notes manual,notes windows', 'checked,checked', 'checked,checked');

            // Rename model into Bus, rename context path into bus
            // Remove windows property, add new property temp (string)
            page.setValueSlow('.DetailsPanel .input__name input', 'Bus');
            page.setValueSlow('.DetailsPanel .input__httppath input', 'bus');
            browser.click('.button__remove__property0');
            browser.click('.button__add__property');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__properties1name input', 'temp');
            page.checkModelDetails('Bus', 'bus', 'cars', 'Model');
            checkDetailsProperties(browser, 'windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked');

            // Click on canvas and save changes
            page.confirmDetailsPanelChanges(getModelSelector(1));

            // Reload page and check, if model in canvas and details panel has correct data
            browser.refresh(function () {
              page.checkEntities('', 'Bus,Driver');
              checkProperties(browser, 'temp,windows', 'String,Number');
              page.openEntityInDetailsPanel(getModelSelector(1));
              page.checkModelDetails('Bus', 'bus', 'cars', 'Model');
              checkDetailsProperties(browser, 'temp,windows', 'String,Number', ',6', ',notes windows', 'unchecked,checked', 'unchecked,checked');
              checkDetailsRelations(browser);
              checkDetailsUDF(browser);

              // Edit model in details panel and add 3 user defined fields:
              // field1/string/value1, field2/number/123, field3/object/{„abc”: 234}
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
              page.setValueSlow('.DetailsPanel .input__userFields1value input', '123');
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
              page.selectValueSlow('.DetailsPanel', 'relations1model', 'Bus');
              page.setValueSlow('.DetailsPanel .input__relations1foreignKey input', 'bus1');
              page.setValueSlow('.DetailsPanel .input__relations2name input', 'relation3');
              page.selectValueSlow('.DetailsPanel', 'relations2type', 'hasAndBelongsToMany');
              page.selectValueSlow('.DetailsPanel', 'relations2model', 'Bus');
              page.setValueSlow('.DetailsPanel .input__relations2foreignKey input', 'bus2');
              page.submitDetailsPanel(getModelSelector(1));

              // Reload page and check, if model in details panel has correct data
              browser.refresh(function () {
                page.checkEntities('', 'Bus,Driver');
                checkProperties(browser, 'temp,windows', 'String,Number');
                page.openEntityInDetailsPanel(getModelSelector(1));
                page.checkModelDetails('Bus', 'bus', 'cars', 'Model');
                checkDetailsProperties(browser, 'temp,windows', 'String,Number', ',6', ',notes windows', 'unchecked,checked', 'unchecked,checked');
                checkDetailsUDF(browser, 'field1,field2,field3', 'String,Number,Object', 'value1,123,');
                checkDetailsRelations(browser, 'relation1,relation2,relation3', 'hasMany,belongsTo,hasAndBelongsToMany', 'Driver,Bus,Bus', 'driver1,bus1,bus2');

                // Remove 1st user-defined field and relation, discard changes
                // and check if model in details panel has correct data
                browser.click('.button__remove__udf0');
                browser.click('.button__remove__relation0');
                browser.waitForElementNotPresent('.DetailsPanel .input__userFields2name', 5000);
                browser.waitForElementNotPresent('.DetailsPanel .input__relations2name', 5000);
                browser.pause(1000);
                checkDetailsUDF(browser, 'field2,field3', 'Number,Object', '123,');
                checkDetailsRelations(browser, 'relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Bus,Bus', 'bus1,bus2');
                page.discardDetailsPanelChanges();
                page.checkModelDetails('Bus', 'bus', 'cars', 'Model');
                checkDetailsProperties(browser, 'temp,windows', 'String,Number', ',6', ',notes windows', 'unchecked,checked', 'unchecked,checked');
                checkDetailsUDF(browser, 'field1,field2,field3', 'String,Number,Object', 'value1,123,');
                checkDetailsRelations(browser, 'relation1,relation2,relation3', 'hasMany,belongsTo,hasAndBelongsToMany', 'Driver,Bus,Bus', 'driver1,bus1,bus2');

                // Remove 1st user-defined field and relation, save changes
                // and check if model in details panel has correct data
                browser.click('.button__remove__udf0');
                browser.click('.button__remove__relation0');
                browser.waitForElementNotPresent('.DetailsPanel .input__userFields2name', 5000);
                browser.waitForElementNotPresent('.DetailsPanel .input__relations2name', 5000);
                browser.pause(1000);
                checkDetailsUDF(browser, 'field2,field3', 'Number,Object', '123,');
                checkDetailsRelations(browser, 'relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Bus,Bus', 'bus1,bus2');
                page.confirmDetailsPanelChanges(getModelSelector(1));
                checkDetailsUDF(browser, 'field2,field3', 'Number,Object', '123,');
                checkDetailsRelations(browser, 'relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Bus,Bus', 'bus1,bus2');

                // reload page and check if model in details panel has correct data
                browser.refresh(function () {
                  page.checkEntities('', 'Bus,Driver');
                  checkProperties(browser, 'temp,windows', 'String,Number');
                  page.openEntityInDetailsPanel(getModelSelector(1));
                  page.checkModelDetails('Bus', 'bus', 'cars', 'Model');
                  checkDetailsProperties(browser, 'temp,windows', 'String,Number', ',6', ',notes windows', 'unchecked,checked', 'unchecked,checked');
                  checkDetailsUDF(browser, 'field2,field3', 'Number,Object', '123,');
                  checkDetailsRelations(browser, 'relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Bus,Bus', 'bus1,bus2');
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
