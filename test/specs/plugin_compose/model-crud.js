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
    browser.waitForElementPresent(getModelSelector(1) + ' .input__name input', 5000);
    page.clearValue(getModelSelector(1) + ' .input__name input');
    browser.pause(1000);
    page.clearValue(getModelSelector(1) + ' .input__name input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .input__name input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .input__name input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .input__name input', 'Car');
    browser.pause(1000);
    browser.moveToElement(getModelSelector(1) + ' .submit', 5, 5, function() {
      browser.click(getModelSelector(1) + ' .submit');
    });
    browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
    browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);
    browser.pause(3000);

    // create Driver model
    page.addElement('model');
    browser.waitForElementPresent(getModelSelector(2) + ' .submit', 5000);
    browser.waitForElementPresent(getModelSelector(2) + ' .input__name input', 5000);
    page.clearValue(getModelSelector(2) + ' .input__name input');
    browser.pause(1000);
    page.clearValue(getModelSelector(2) + ' .input__name input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + ' .input__name input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + ' .input__name input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(2) + ' .input__name input', 'Driver');
    browser.pause(1000);
    browser.moveToElement(getModelSelector(2) + ' .submit', 5, 5, function() {
      browser.click(getModelSelector(2) + ' .submit');
    });
    browser.waitForElementPresent(getModelSelector(2) + '.wip', 5000);
    browser.waitForElementNotPresent(getModelSelector(2) + '.wip', 5000);
    browser.pause(3000);

    // Check, if context path is car
    browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
    browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car');

    // Update Car name into Car1 and check, if context path is car1
    browser.click(getModelSelector(1));
    browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
    browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
    browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
    browser.waitForElementPresent(getModelSelector(1) + ' .input__name input', 5000);
    browser.pause(1000);
    page.clearValue(getModelSelector(1) + ' .input__name input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .input__name input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .input__name input', 'Car1');
    browser.moveToElement(getModelSelector(1) + ' .submit', 5, 5, function() {
      browser.click(getModelSelector(1) + ' .submit');
    });
    browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
    browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);
    browser.pause(2000);
    browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car1');

    // Update context path into car12 and check, if context path is car12
    browser.click(getModelSelector(1));
    browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
    browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
    browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
    browser.waitForElementPresent(getModelSelector(1) + ' .input__httppath input', 5000);
    browser.pause(1000);
    page.clearValue(getModelSelector(1) + ' .input__httppath input');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .input__httppath input', '');
    browser.pause(1000);
    page.setValueSlow(getModelSelector(1) + ' .input__httppath input', 'car12');
    browser.moveToElement(getModelSelector(1) + ' .submit', 5, 5, function() {
      browser.click(getModelSelector(1) + ' .submit');
    });
    browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
    browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);
    browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car12');

    // Reload page and check, if model is consistent after reload
    browser.refresh(function () {
      page.expect.element('.Aside.disabled').to.not.be.present;
      page.expect.element('.canvas__container--editing').to.not.be.present;
      browser.waitForElementPresent(getModelSelector(1), 5000);
      browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.name .EntityProperty__field--text').text.to.equal('Car1');
      browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car12');
      browser.waitForElementPresent(getModelSelector(2), 5000);
      browser.expect.element(getModelSelector(2) + ' .EntityProperty__field.name .EntityProperty__field--text').text.to.equal('Driver');

      // Edit Car1 model, rename Car1 into Bus, rename context path into bus
      browser.click(getModelSelector(1));
      browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
      browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
      browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
      browser.waitForElementPresent(getModelSelector(1) + ' .input__name input', 5000);
      browser.pause(1000);
      page.clearValue(getModelSelector(1) + ' .input__name input');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .input__name input', '');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .input__name input', 'Bus');
      browser.pause(1000);
      page.clearValue(getModelSelector(1) + ' .input__httppath input');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .input__httppath input', '');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .input__httppath input', 'bus');

      // Cancel editing and check, if model is consistent with data before editing
      browser.moveToElement(getModelSelector(1) + ' .cancel', 5, 5, function() {
        browser.click(getModelSelector(1) + ' .cancel');
      });
      browser.waitForElementNotPresent(getModelSelector(1) + '.editable', 5000);
      browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.name .EntityProperty__field--text').text.to.equal('Car1');
      browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car12');

      // Edit model and check, if input fields are consistent with data before editing
      browser.click(getModelSelector(1));
      browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
      browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
      browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
      browser.pause(1000);
      browser.expect.element(getModelSelector(1) + ' .input__name input').value.to.equal('Car1');
      browser.expect.element(getModelSelector(1) + ' .input__httppath input').value.to.equal('car12');

      // Add string properties: color, engine
      browser.click(getModelSelector(1) + ' .EntitySubElements__title__add');
      browser.click(getModelSelector(1) + ' .EntitySubElements__title__add');
      page.setValueSlow(getModelSelector(1) + ' .input__properties0name input', 'color');
      browser.pause(1000);
      page.setValueSlow(getModelSelector(1) + ' .input__properties1name input', 'engine');
      browser.pause(1000);
      browser.moveToElement(getModelSelector(1) + ' .submit', 5, 5, function() {
        browser.click(getModelSelector(1) + ' .submit');
      });
      browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
      browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);

      // Reload page and check model data
      browser.refresh(function () {
        page.expect.element('.Aside.disabled').to.not.be.present;
        page.expect.element('.canvas__container--editing').to.not.be.present;
        browser.waitForElementPresent(getModelSelector(1), 5000);
        browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
        browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car12');
        browser.waitForElementPresent(getModelSelector(2), 5000);
        browser.expect.element(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
        browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('color');
        browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('engine');

        // Change properties: engine into windows number, color into manual boolean, add object property produced having year (number) and country (string)
        browser.click(getModelSelector(1));
        browser.waitForElementPresent(getModelSelector(1) + '.highlighted .Toolbox__button--edit', 5000);
        browser.click(getModelSelector(1) + '.highlighted .Toolbox__button--edit');
        browser.waitForElementPresent(getModelSelector(1) + ' .submit', 5000);
        browser.waitForElementPresent(getModelSelector(1) + ' .input__name input', 5000);
        browser.pause(1000);
        page.clearValue(getModelSelector(1) + ' .input__properties0name input');
        browser.pause(1000);
        page.clearValue(getModelSelector(1) + ' .input__properties0name input');
        browser.pause(1000);
        page.setValueSlow(getModelSelector(1) + ' .input__properties0name input', 'manual');
        browser.pause(1000);
        browser.click(getModelSelector(1) + ' .select__properties0type');
        browser.waitForElementPresent('.properties0type__Boolean', 5000);
        browser.pause(500);
        browser.click('.properties0type__Boolean');
        browser.pause(1000);
        page.clearValue(getModelSelector(1) + ' .input__properties1name input');
        browser.pause(1000);
        page.clearValue(getModelSelector(1) + ' .input__properties1name input');
        browser.pause(1000);
        page.setValueSlow(getModelSelector(1) + ' .input__properties1name input', 'windows');
        browser.pause(1000);
        browser.click(getModelSelector(1) + ' .select__properties1type');
        browser.waitForElementPresent('.properties1type__Number', 5000);
        browser.pause(500);
        browser.click('.properties1type__Number');
        browser.pause(1000);
        browser.moveToElement(getModelSelector(1) + ' .submit', 5, 5, function() {
          browser.click(getModelSelector(1) + ' .submit');
        });
        browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
        browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);

        // Reload page and check model data
        browser.refresh(function () {
          page.expect.element('.Aside.disabled').to.not.be.present;
          page.expect.element('.canvas__container--editing').to.not.be.present;
          browser.waitForElementPresent(getModelSelector(1), 5000);
          browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car1');
          browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car12');
          browser.waitForElementPresent(getModelSelector(2), 5000);
          browser.expect.element(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
          browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('manual');
          browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Boolean');
          browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('windows');
          browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Number');

          // Open model in details panel and rename name into Car, context path into car, plural cars, base model as Model,
          // set default values/notes for properties:
          // windows renamed as windowsNew: 6/note windows,
          // manual renamed as manualNew: true/note manual,
          // year: 2015/note year, country: USA/note country,
          // set all properties as required and is index
          browser.click(getModelSelector(1));
          browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
          page.click('@details');
          browser.pause(2000);
          browser.waitForElementPresent('.DetailsPanel .input__name input', 5000);
          page.clearValue('.DetailsPanel .input__name input');
          browser.pause(1000);
          page.clearValue('.DetailsPanel .input__name input');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__name input', '');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__name input', '');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__name input', 'Car');
          browser.pause(1000);
          page.clearValue('.DetailsPanel .input__httppath input');
          browser.pause(1000);
          page.clearValue('.DetailsPanel .input__httppath input');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__httppath input', '');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__httppath input', '');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__httppath input', 'car');
          browser.pause(1000);
          page.clearValue('.DetailsPanel .input__plural input');
          browser.pause(1000);
          page.clearValue('.DetailsPanel .input__plural input');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__plural input', '');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__plural input', '');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__plural input', 'cars');
          browser.pause(1000);
          browser.click('.select__base');
          browser.waitForElementPresent('div[role=menu] .base__Model', 5000);
          browser.pause(500);
          browser.click('div[role=menu] .base__Model');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__properties0default_ input', 'true');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__properties0description input', 'notes manual');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__properties1default_ input', '6');
          browser.pause(1000);
          page.setValueSlow('.DetailsPanel .input__properties1description input', 'notes windows');
          browser.pause(1000);
          browser.click('.DetailsPanel .checkbox__properties0required');
          browser.click('.DetailsPanel .checkbox__properties0index');
          browser.click('.DetailsPanel .checkbox__properties1required');
          browser.click('.DetailsPanel .checkbox__properties1index');
          browser.pause(1000);

          // Save model and check, if model in canvas has correct data
          browser.waitForElementPresent('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button', 5000);
          browser.moveToElement('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button', 5, 5, function() {
            browser.click('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button');
          });
          browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
          browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);
          browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car');
          browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car');
          browser.waitForElementPresent(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--text', 5000);
          browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('manual');
          browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Boolean');
          browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('windows');
          browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Number');

          // Reload page and check model data in canvas and details panel
          browser.refresh(function () {
            page.expect.element('.Aside.disabled').to.not.be.present;
            page.expect.element('.canvas__container--editing').to.not.be.present;
            browser.waitForElementPresent(getModelSelector(1), 5000);
            browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Car');
            browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('car');
            browser.waitForElementPresent(getModelSelector(2), 5000);
            browser.expect.element(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
            browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('manual');
            browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Boolean');
            browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('windows');
            browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Number');
            browser.click(getModelSelector(1));
            browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
            page.click('@details');
            browser.pause(2000);
            browser.waitForElementPresent('.DetailsPanel .input__name input', 5000);
            browser.expect.element('.DetailsPanel .input__name input').value.to.equal('Car');
            browser.expect.element('.DetailsPanel .input__httppath input').value.to.equal('car');
            browser.expect.element('.DetailsPanel .input__plural input').value.to.equal('cars');
            browser.expect.element('.DetailsPanel .select__base').text.to.equal('Model');
            browser.expect.element('.DetailsPanel .input__properties0name input').value.to.equal('manual');
            browser.expect.element('.DetailsPanel .select__properties0type').text.to.equal('Boolean');
            browser.expect.element('.DetailsPanel .input__properties0default_ input').value.to.equal('true');
            browser.expect.element('.DetailsPanel .input__properties0description input').value.to.equal('notes manual');
            browser.expect.element('.DetailsPanel .checkbox__properties0required__checked').to.be.present;
            browser.expect.element('.DetailsPanel .checkbox__properties0index__checked').to.be.present;
            browser.expect.element('.DetailsPanel .input__properties1name input').value.to.equal('windows');
            browser.expect.element('.DetailsPanel .select__properties1type').text.to.equal('Number');
            browser.expect.element('.DetailsPanel .input__properties1default_ input').value.to.equal('6');
            browser.expect.element('.DetailsPanel .input__properties1description input').value.to.equal('notes windows');
            browser.expect.element('.DetailsPanel .checkbox__properties1required__checked').to.be.present;
            browser.expect.element('.DetailsPanel .checkbox__properties1index__checked').to.be.present;

            // Edit model in details panel, rename model into Bus, rename context path into bus
            // remove windows property, add new property temp (string)
            page.clearValue('.DetailsPanel .input__name input');
            browser.pause(1000);
            page.clearValue('.DetailsPanel .input__name input');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__name input', '');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__name input', '');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__name input', 'Bus');
            browser.pause(1000);
            page.clearValue('.DetailsPanel .input__httppath input');
            browser.pause(1000);
            page.clearValue('.DetailsPanel .input__httppath input');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__httppath input', '');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__httppath input', '');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__httppath input', 'bus');
            browser.click('.button__remove__property0');
            browser.click('.button__add__property');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__properties1name input', 'temp');
            browser.pause(1000);
            browser.expect.element('.DetailsPanel .input__name input').value.to.equal('Bus');
            browser.expect.element('.DetailsPanel .input__httppath input').value.to.equal('bus');
            browser.expect.element('.DetailsPanel .input__properties0name input').value.to.equal('windows');
            browser.expect.element('.DetailsPanel .select__properties0type').text.to.equal('Number');
            browser.expect.element('.DetailsPanel .input__properties0default_ input').value.to.equal('6');
            browser.expect.element('.DetailsPanel .input__properties0description input').value.to.equal('notes windows');
            browser.expect.element('.DetailsPanel .checkbox__properties0required__checked').to.be.present;
            browser.expect.element('.DetailsPanel .checkbox__properties0index__checked').to.be.present;
            browser.expect.element('.DetailsPanel .input__properties1name input').value.to.equal('temp');
            browser.expect.element('.DetailsPanel .select__properties1type').text.to.equal('String');
            browser.expect.element('.DetailsPanel .input__properties1default_ input').value.to.equal('');
            browser.expect.element('.DetailsPanel .input__properties1description input').value.to.equal('');
            browser.expect.element('.DetailsPanel .checkbox__properties1required__unchecked').to.be.present;
            browser.expect.element('.DetailsPanel .checkbox__properties1index__unchecked').to.be.present;

            // Click on canvas and discard changes
            browser.waitForElementPresent('.header .canvas-overlay', 5000);
            browser.click('.header .canvas-overlay');
            browser.waitForElementPresent('.SystemDefcon1 .discard', 5000);
            browser.click('.SystemDefcon1 .discard');
            browser.waitForElementNotPresent('.confirm-button__accept.confirm-button__accept--enabled', 5000);
            browser.pause(3000);
            page.click('@details');
            browser.pause(2000);
            page.click('@details');
            browser.pause(2000);

            // Check, if model in details panel has correct data
            browser.expect.element('.DetailsPanel .input__name input').value.to.equal('Car');
            browser.expect.element('.DetailsPanel .input__httppath input').value.to.equal('car');
            browser.expect.element('.DetailsPanel .input__plural input').value.to.equal('cars');
            browser.expect.element('.DetailsPanel .select__base').text.to.equal('Model');
            browser.expect.element('.DetailsPanel .input__properties0name input').value.to.equal('manual');
            browser.expect.element('.DetailsPanel .select__properties0type').text.to.equal('Boolean');
            browser.expect.element('.DetailsPanel .input__properties0default_ input').value.to.equal('true');
            browser.expect.element('.DetailsPanel .input__properties0description input').value.to.equal('notes manual');
            browser.expect.element('.DetailsPanel .checkbox__properties0required__checked').to.be.present;
            browser.expect.element('.DetailsPanel .checkbox__properties0index__checked').to.be.present;
            browser.expect.element('.DetailsPanel .input__properties1name input').value.to.equal('windows');
            browser.expect.element('.DetailsPanel .select__properties1type').text.to.equal('Number');
            browser.expect.element('.DetailsPanel .input__properties1default_ input').value.to.equal('6');
            browser.expect.element('.DetailsPanel .input__properties1description input').value.to.equal('notes windows');
            browser.expect.element('.DetailsPanel .checkbox__properties1required__checked').to.be.present;
            browser.expect.element('.DetailsPanel .checkbox__properties1index__checked').to.be.present;

            // Rename model into Bus, rename context path into bus
            // Remove windows property, add new property temp (string)
            page.clearValue('.DetailsPanel .input__name input');
            browser.pause(1000);
            page.clearValue('.DetailsPanel .input__name input');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__name input', '');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__name input', '');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__name input', 'Bus');
            browser.pause(1000);
            page.clearValue('.DetailsPanel .input__httppath input');
            browser.pause(1000);
            page.clearValue('.DetailsPanel .input__httppath input');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__httppath input', '');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__httppath input', '');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__httppath input', 'bus');
            browser.click('.button__remove__property0');
            browser.click('.button__add__property');
            browser.pause(1000);
            page.setValueSlow('.DetailsPanel .input__properties1name input', 'temp');
            browser.pause(1000);
            browser.expect.element('.DetailsPanel .input__name input').value.to.equal('Bus');
            browser.expect.element('.DetailsPanel .input__httppath input').value.to.equal('bus');
            browser.expect.element('.DetailsPanel .input__properties0name input').value.to.equal('windows');
            browser.expect.element('.DetailsPanel .select__properties0type').text.to.equal('Number');
            browser.expect.element('.DetailsPanel .input__properties0default_ input').value.to.equal('6');
            browser.expect.element('.DetailsPanel .input__properties0description input').value.to.equal('notes windows');
            browser.expect.element('.DetailsPanel .checkbox__properties0required__checked').to.be.present;
            browser.expect.element('.DetailsPanel .checkbox__properties0index__checked').to.be.present;
            browser.expect.element('.DetailsPanel .input__properties1name input').value.to.equal('temp');
            browser.expect.element('.DetailsPanel .select__properties1type').text.to.equal('String');
            browser.expect.element('.DetailsPanel .input__properties1default_ input').value.to.equal('');
            browser.expect.element('.DetailsPanel .input__properties1description input').value.to.equal('');
            browser.expect.element('.DetailsPanel .checkbox__properties1required__unchecked').to.be.present;
            browser.expect.element('.DetailsPanel .checkbox__properties1index__unchecked').to.be.present;

            // Click on canvas and save changes
            browser.waitForElementPresent('.header .canvas-overlay', 5000);
            browser.click('.header .canvas-overlay');
            browser.waitForElementPresent('.SystemDefcon1 .confirm', 5000);
            browser.click('.SystemDefcon1 .confirm');
            browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
            browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);
            browser.waitForElementNotPresent('.confirm-button__accept.confirm-button__accept--enabled', 5000);

            // Reload page and check, if model in canvas and details panel has correct data
            browser.refresh(function () {
              page.expect.element('.Aside.disabled').to.not.be.present;
              page.expect.element('.canvas__container--editing').to.not.be.present;
              browser.waitForElementPresent(getModelSelector(1), 5000);
              browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Bus');
              browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('bus');
              browser.waitForElementPresent(getModelSelector(2), 5000);
              browser.expect.element(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
              browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('temp');
              browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('String');
              browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('windows');
              browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Number');
              browser.click(getModelSelector(1));
              browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
              page.click('@details');
              browser.pause(2000);
              browser.waitForElementPresent('.DetailsPanel .input__name input', 5000);
              browser.expect.element('.DetailsPanel .input__name input').value.to.equal('Bus');
              browser.expect.element('.DetailsPanel .input__httppath input').value.to.equal('bus');
              browser.expect.element('.DetailsPanel .input__plural input').value.to.equal('cars');
              browser.expect.element('.DetailsPanel .select__base').text.to.equal('Model');
              browser.expect.element('.DetailsPanel .input__properties0name input').value.to.equal('temp');
              browser.expect.element('.DetailsPanel .select__properties0type').text.to.equal('String');
              browser.expect.element('.DetailsPanel .input__properties0default_ input').value.to.equal('');
              browser.expect.element('.DetailsPanel .input__properties0description input').value.to.equal('');
              browser.expect.element('.DetailsPanel .checkbox__properties0required__unchecked').to.be.present;
              browser.expect.element('.DetailsPanel .checkbox__properties0index__unchecked').to.be.present;
              browser.expect.element('.DetailsPanel .input__properties1name input').value.to.equal('windows');
              browser.expect.element('.DetailsPanel .select__properties1type').text.to.equal('Number');
              browser.expect.element('.DetailsPanel .input__properties1default_ input').value.to.equal('6');
              browser.expect.element('.DetailsPanel .input__properties1description input').value.to.equal('notes windows');
              browser.expect.element('.DetailsPanel .checkbox__properties1required__checked').to.be.present;
              browser.expect.element('.DetailsPanel .checkbox__properties1index__checked').to.be.present;

              // Edit model in details panel and add 3 user defined fields:
              // field1/string/value1, field2/number/123, field3/object/{„abc”: 234}
              // and 3 relations: relation1/hasManu/Driver/driver1, relation2/belongsTo/Car/car1,
              // relation3/hasAndBelongsToMany/Driver/driver2
              browser.click('.button__add__udf');
              browser.click('.button__add__udf');
              browser.click('.button__add__udf');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__userFields0name input', 'field1');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__userFields0value input', 'value1');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__userFields1name input', 'field2');
              browser.pause(1000);
              browser.click('.select__userFields1type');
              browser.waitForElementPresent('div[role=menu] .userFields1type__Number', 5000);
              browser.pause(500);
              browser.click('div[role=menu] .userFields1type__Number');
              browser.pause(1000);
              page.clearValue('.DetailsPanel .input__userFields1value input');
              browser.pause(1000);
              page.clearValue('.DetailsPanel .input__userFields1value input');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__userFields1value input', '123');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__userFields2name input', 'field3');
              browser.pause(1000);
              browser.click('.select__userFields2type');
              browser.waitForElementPresent('div[role=menu] .userFields2type__Number', 5000);
              browser.pause(500);
              browser.click('div[role=menu] .userFields2type__Object');
              browser.pause(1000);
              page.clearValue('.DetailsPanel .input__userFields2value textarea:nth-child(2)');
              browser.pause(1000);
              page.clearValue('.DetailsPanel .input__userFields2value textarea:nth-child(2)');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__userFields2value textarea:nth-child(2)', '{"abc": 234}');
              browser.pause(1000);
              browser.click('.button__add__relation');
              browser.click('.button__add__relation');
              browser.click('.button__add__relation');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__relations0name input', 'relation1');
              browser.pause(1000);
              browser.click('.select__relations0type');
              browser.waitForElementPresent('div[role=menu] .relations0type__hasMany', 5000);
              browser.pause(500);
              browser.click('div[role=menu] .relations0type__hasMany');
              browser.pause(1000);
              browser.click('.select__relations0model');
              browser.waitForElementPresent('div[role=menu] .relations0model__Driver', 5000);
              browser.pause(500);
              browser.click('div[role=menu] .relations0model__Driver');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__relations0foreignKey input', 'driver1');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__relations1name input', 'relation2');
              browser.pause(1000);
              browser.click('.select__relations1type');
              browser.waitForElementPresent('div[role=menu] .relations1type__belongsTo', 5000);
              browser.pause(500);
              browser.click('div[role=menu] .relations1type__belongsTo');
              browser.pause(1000);
              browser.click('.select__relations1model');
              browser.waitForElementPresent('div[role=menu] .relations1model__Bus', 5000);
              browser.pause(500);
              browser.click('div[role=menu] .relations1model__Bus');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__relations1foreignKey input', 'bus1');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__relations2name input', 'relation3');
              browser.pause(1000);
              browser.click('.select__relations2type');
              browser.waitForElementPresent('div[role=menu] .relations2type__hasAndBelongsToMany', 5000);
              browser.pause(500);
              browser.click('div[role=menu] .relations2type__hasAndBelongsToMany');
              browser.pause(1000);
              browser.click('.select__relations2model');
              browser.waitForElementPresent('div[role=menu] .relations2model__Bus', 5000);
              browser.pause(500);
              browser.click('div[role=menu] .relations2model__Bus');
              browser.pause(1000);
              page.setValueSlow('.DetailsPanel .input__relations2foreignKey input', 'bus2');
              browser.pause(1000);
              browser.waitForElementPresent('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button', 5000);
              browser.moveToElement('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button', 5, 5, function() {
                browser.click('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button');
              });
              browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
              browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);
              browser.waitForElementNotPresent('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button', 5000);

              // Reload page and check, if model in details panel has correct data
              browser.refresh(function () {
                page.expect.element('.Aside.disabled').to.not.be.present;
                page.expect.element('.canvas__container--editing').to.not.be.present;
                browser.waitForElementPresent(getModelSelector(1), 5000);
                browser.pause(2000);
                browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Bus');
                browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('bus');
                browser.waitForElementPresent(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text', 5000);
                browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('temp');
                browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('String');
                browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('windows');
                browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Number');
                browser.waitForElementPresent(getModelSelector(2), 5000);
                browser.expect.element(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
                browser.click(getModelSelector(1));
                browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
                page.click('@details');
                browser.pause(2000);
                browser.waitForElementPresent('.DetailsPanel .input__name input', 5000);
                browser.expect.element('.DetailsPanel .input__name input').value.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__httppath input').value.to.equal('bus');
                browser.expect.element('.DetailsPanel .input__plural input').value.to.equal('cars');
                browser.expect.element('.DetailsPanel .select__base').text.to.equal('Model');
                browser.expect.element('.DetailsPanel .input__properties0name input').value.to.equal('temp');
                browser.expect.element('.DetailsPanel .select__properties0type').text.to.equal('String');
                browser.expect.element('.DetailsPanel .input__properties0default_ input').value.to.equal('');
                browser.expect.element('.DetailsPanel .input__properties0description input').value.to.equal('');
                browser.expect.element('.DetailsPanel .checkbox__properties0required__unchecked').to.be.present;
                browser.expect.element('.DetailsPanel .checkbox__properties0index__unchecked').to.be.present;
                browser.expect.element('.DetailsPanel .input__properties1name input').value.to.equal('windows');
                browser.expect.element('.DetailsPanel .select__properties1type').text.to.equal('Number');
                browser.expect.element('.DetailsPanel .input__properties1default_ input').value.to.equal('6');
                browser.expect.element('.DetailsPanel .input__properties1description input').value.to.equal('notes windows');
                browser.expect.element('.DetailsPanel .checkbox__properties1required__checked').to.be.present;
                browser.expect.element('.DetailsPanel .checkbox__properties1index__checked').to.be.present;
                browser.expect.element('.DetailsPanel .input__userFields0name input').value.to.equal('field1');
                browser.expect.element('.DetailsPanel .select__userFields0type').text.to.equal('String');
                browser.expect.element('.DetailsPanel .input__userFields0value input').value.to.equal('value1');
                browser.expect.element('.DetailsPanel .input__userFields1name input').value.to.equal('field2');
                browser.expect.element('.DetailsPanel .select__userFields1type').text.to.equal('Number');
                browser.expect.element('.DetailsPanel .input__userFields1value input').value.to.equal('123');
                browser.expect.element('.DetailsPanel .input__userFields2name input').value.to.equal('field3');
                browser.expect.element('.DetailsPanel .select__userFields2type').text.to.equal('Object');
                browser.expect.element('.DetailsPanel .input__userFields2value textarea:nth-child(2)').value.to.contain('abc');
                browser.expect.element('.DetailsPanel .input__userFields2value textarea:nth-child(2)').value.to.contain('234');
                browser.expect.element('.DetailsPanel .input__userFields3name').to.not.be.present;
                browser.expect.element('.DetailsPanel .input__relations0name input').value.to.equal('relation1');
                browser.expect.element('.DetailsPanel .select__relations0type').text.to.equal('hasMany');
                browser.expect.element('.DetailsPanel .select__relations0model').text.to.equal('Driver');
                browser.expect.element('.DetailsPanel .input__relations0foreignKey input').value.to.equal('driver1');
                browser.expect.element('.DetailsPanel .input__relations1name input').value.to.equal('relation2');
                browser.expect.element('.DetailsPanel .select__relations1type').text.to.equal('belongsTo');
                browser.expect.element('.DetailsPanel .select__relations1model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations1foreignKey input').value.to.equal('bus1');
                browser.expect.element('.DetailsPanel .input__relations2name input').value.to.equal('relation3');
                browser.expect.element('.DetailsPanel .select__relations2type').text.to.equal('hasAndBelongsToMany');
                browser.expect.element('.DetailsPanel .select__relations2model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations2foreignKey input').value.to.equal('bus2');
                browser.expect.element('.DetailsPanel .input__relations3name').to.not.be.present;

                // Remove 1st user-defined field and relation, discard changes
                // and check if model in details panel has correct data
                browser.click('.button__remove__udf0');
                browser.click('.button__remove__relation0');
                browser.waitForElementNotPresent('.DetailsPanel .input__userFields2name', 5000);
                browser.waitForElementNotPresent('.DetailsPanel .input__relations2name', 5000);
                browser.pause(1000);
                browser.expect.element('.DetailsPanel .input__userFields0name input').value.to.equal('field2');
                browser.expect.element('.DetailsPanel .select__userFields0type').text.to.equal('Number');
                browser.expect.element('.DetailsPanel .input__userFields0value input').value.to.equal('123');
                browser.expect.element('.DetailsPanel .input__userFields1name input').value.to.equal('field3');
                browser.expect.element('.DetailsPanel .select__userFields1type').text.to.equal('Object');
                browser.expect.element('.DetailsPanel .input__userFields1value textarea:nth-child(2)').value.to.contain('abc');
                browser.expect.element('.DetailsPanel .input__userFields1value textarea:nth-child(2)').value.to.contain('234');
                browser.expect.element('.DetailsPanel .input__relations0name input').value.to.equal('relation2');
                browser.expect.element('.DetailsPanel .select__relations0type').text.to.equal('belongsTo');
                browser.expect.element('.DetailsPanel .select__relations0model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations0foreignKey input').value.to.equal('bus1');
                browser.expect.element('.DetailsPanel .input__relations1name input').value.to.equal('relation3');
                browser.expect.element('.DetailsPanel .select__relations1type').text.to.equal('hasAndBelongsToMany');
                browser.expect.element('.DetailsPanel .select__relations1model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations1foreignKey input').value.to.equal('bus2');
                browser.waitForElementPresent('.header .canvas-overlay', 5000);
                browser.click('.header .canvas-overlay');
                browser.waitForElementPresent('.SystemDefcon1 .discard', 5000);
                browser.click('.SystemDefcon1 .discard');
                browser.waitForElementNotPresent('.confirm-button__accept.confirm-button__accept--enabled', 5000);
                browser.pause(3000);
                page.click('@details');
                browser.pause(2000);
                page.click('@details');
                browser.pause(2000);
                browser.expect.element('.DetailsPanel .input__name input').value.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__httppath input').value.to.equal('bus');
                browser.expect.element('.DetailsPanel .input__plural input').value.to.equal('cars');
                browser.expect.element('.DetailsPanel .select__base').text.to.equal('Model');
                browser.expect.element('.DetailsPanel .input__properties0name input').value.to.equal('temp');
                browser.expect.element('.DetailsPanel .select__properties0type').text.to.equal('String');
                browser.expect.element('.DetailsPanel .input__properties0default_ input').value.to.equal('');
                browser.expect.element('.DetailsPanel .input__properties0description input').value.to.equal('');
                browser.expect.element('.DetailsPanel .checkbox__properties0required__unchecked').to.be.present;
                browser.expect.element('.DetailsPanel .checkbox__properties0index__unchecked').to.be.present;
                browser.expect.element('.DetailsPanel .input__properties1name input').value.to.equal('windows');
                browser.expect.element('.DetailsPanel .select__properties1type').text.to.equal('Number');
                browser.expect.element('.DetailsPanel .input__properties1default_ input').value.to.equal('6');
                browser.expect.element('.DetailsPanel .input__properties1description input').value.to.equal('notes windows');
                browser.expect.element('.DetailsPanel .checkbox__properties1required__checked').to.be.present;
                browser.expect.element('.DetailsPanel .checkbox__properties1index__checked').to.be.present;
                browser.expect.element('.DetailsPanel .input__userFields0name input').value.to.equal('field1');
                browser.expect.element('.DetailsPanel .select__userFields0type').text.to.equal('String');
                browser.expect.element('.DetailsPanel .input__userFields0value input').value.to.equal('value1');
                browser.expect.element('.DetailsPanel .input__userFields1name input').value.to.equal('field2');
                browser.expect.element('.DetailsPanel .select__userFields1type').text.to.equal('Number');
                browser.expect.element('.DetailsPanel .input__userFields1value input').value.to.equal('123');
                browser.expect.element('.DetailsPanel .input__userFields2name input').value.to.equal('field3');
                browser.expect.element('.DetailsPanel .select__userFields2type').text.to.equal('Object');
                browser.expect.element('.DetailsPanel .input__userFields2value textarea:nth-child(2)').value.to.contain('abc');
                browser.expect.element('.DetailsPanel .input__userFields2value textarea:nth-child(2)').value.to.contain('234');
                browser.expect.element('.DetailsPanel .input__userFields3name').to.not.be.present;
                browser.expect.element('.DetailsPanel .input__relations0name input').value.to.equal('relation1');
                browser.expect.element('.DetailsPanel .select__relations0type').text.to.equal('hasMany');
                browser.expect.element('.DetailsPanel .select__relations0model').text.to.equal('Driver');
                browser.expect.element('.DetailsPanel .input__relations0foreignKey input').value.to.equal('driver1');
                browser.expect.element('.DetailsPanel .input__relations1name input').value.to.equal('relation2');
                browser.expect.element('.DetailsPanel .select__relations1type').text.to.equal('belongsTo');
                browser.expect.element('.DetailsPanel .select__relations1model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations1foreignKey input').value.to.equal('bus1');
                browser.expect.element('.DetailsPanel .input__relations2name input').value.to.equal('relation3');
                browser.expect.element('.DetailsPanel .select__relations2type').text.to.equal('hasAndBelongsToMany');
                browser.expect.element('.DetailsPanel .select__relations2model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations2foreignKey input').value.to.equal('bus2');
                browser.expect.element('.DetailsPanel .input__relations3name').to.not.be.present;

                // Remove 1st user-defined field and relation, save changes
                // and check if model in details panel has correct data
                browser.click('.button__remove__udf0');
                browser.click('.button__remove__relation0');
                browser.waitForElementNotPresent('.DetailsPanel .input__userFields2name', 5000);
                browser.waitForElementNotPresent('.DetailsPanel .input__relations2name', 5000);
                browser.pause(1000);
                browser.expect.element('.DetailsPanel .input__userFields0name input').value.to.equal('field2');
                browser.expect.element('.DetailsPanel .select__userFields0type').text.to.equal('Number');
                browser.expect.element('.DetailsPanel .input__userFields0value input').value.to.equal('123');
                browser.expect.element('.DetailsPanel .input__userFields1name input').value.to.equal('field3');
                browser.expect.element('.DetailsPanel .select__userFields1type').text.to.equal('Object');
                browser.expect.element('.DetailsPanel .input__userFields1value textarea:nth-child(2)').value.to.contain('abc');
                browser.expect.element('.DetailsPanel .input__userFields1value textarea:nth-child(2)').value.to.contain('234');
                browser.expect.element('.DetailsPanel .input__relations0name input').value.to.equal('relation2');
                browser.expect.element('.DetailsPanel .select__relations0type').text.to.equal('belongsTo');
                browser.expect.element('.DetailsPanel .select__relations0model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations0foreignKey input').value.to.equal('bus1');
                browser.expect.element('.DetailsPanel .input__relations1name input').value.to.equal('relation3');
                browser.expect.element('.DetailsPanel .select__relations1type').text.to.equal('hasAndBelongsToMany');
                browser.expect.element('.DetailsPanel .select__relations1model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations1foreignKey input').value.to.equal('bus2');
                browser.waitForElementPresent('.header .canvas-overlay', 5000);
                browser.click('.header .canvas-overlay');
                browser.waitForElementPresent('.SystemDefcon1 .confirm', 5000);
                browser.click('.SystemDefcon1 .confirm');
                browser.waitForElementPresent(getModelSelector(1) + '.wip', 5000);
                browser.waitForElementNotPresent(getModelSelector(1) + '.wip', 5000);
                browser.waitForElementNotPresent('.confirm-button__accept.confirm-button__accept--enabled', 5000);
                browser.pause(3000);
                page.click('@details');
                browser.pause(2000);
                page.click('@details');
                browser.pause(2000);
                browser.expect.element('.DetailsPanel .input__userFields0name input').value.to.equal('field2');
                browser.expect.element('.DetailsPanel .select__userFields0type').text.to.equal('Number');
                browser.expect.element('.DetailsPanel .input__userFields0value input').value.to.equal('123');
                browser.expect.element('.DetailsPanel .input__userFields1name input').value.to.equal('field3');
                browser.expect.element('.DetailsPanel .select__userFields1type').text.to.equal('Object');
                browser.expect.element('.DetailsPanel .input__userFields1value textarea:nth-child(2)').value.to.contain('abc');
                browser.expect.element('.DetailsPanel .input__userFields1value textarea:nth-child(2)').value.to.contain('234');
                browser.expect.element('.DetailsPanel .input__relations0name input').value.to.equal('relation2');
                browser.expect.element('.DetailsPanel .select__relations0type').text.to.equal('belongsTo');
                browser.expect.element('.DetailsPanel .select__relations0model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations0foreignKey input').value.to.equal('bus1');
                browser.expect.element('.DetailsPanel .input__relations1name input').value.to.equal('relation3');
                browser.expect.element('.DetailsPanel .select__relations1type').text.to.equal('hasAndBelongsToMany');
                browser.expect.element('.DetailsPanel .select__relations1model').text.to.equal('Bus');
                browser.expect.element('.DetailsPanel .input__relations1foreignKey input').value.to.equal('bus2');

                // reload page and check if model in details panel has correct data
                browser.refresh(function () {
                  page.expect.element('.Aside.disabled').to.not.be.present;
                  page.expect.element('.canvas__container--editing').to.not.be.present;
                  browser.waitForElementPresent(getModelSelector(1), 5000);
                  browser.pause(2000);
                  browser.expect.element(getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Bus');
                  browser.expect.element(getModelSelector(1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal('bus');
                  browser.waitForElementPresent(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text', 5000);
                  browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('temp');
                  browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(1) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('String');
                  browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.name .EntityProperty__field--text').text.to.equal('windows');
                  browser.expect.element(getModelSelector(1) + ' .Model__properties .ModelPropertyCollapsed:nth-child(2) .ModelProperty__col.type .EntityProperty__field--text').text.to.equal('Number');
                  browser.waitForElementPresent(getModelSelector(2), 5000);
                  browser.expect.element(getModelSelector(2) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Driver');
                  browser.click(getModelSelector(1));
                  browser.waitForElementPresent(getModelSelector(1) + '.highlighted', 5000);
                  page.click('@details');
                  browser.pause(2000);
                  browser.waitForElementPresent('.DetailsPanel .input__name input', 5000);
                  browser.expect.element('.DetailsPanel .input__name input').value.to.equal('Bus');
                  browser.expect.element('.DetailsPanel .input__httppath input').value.to.equal('bus');
                  browser.expect.element('.DetailsPanel .input__plural input').value.to.equal('cars');
                  browser.expect.element('.DetailsPanel .select__base').text.to.equal('Model');
                  browser.expect.element('.DetailsPanel .input__properties0name input').value.to.equal('temp');
                  browser.expect.element('.DetailsPanel .select__properties0type').text.to.equal('String');
                  browser.expect.element('.DetailsPanel .input__properties0default_ input').value.to.equal('');
                  browser.expect.element('.DetailsPanel .input__properties0description input').value.to.equal('');
                  browser.expect.element('.DetailsPanel .checkbox__properties0required__unchecked').to.be.present;
                  browser.expect.element('.DetailsPanel .checkbox__properties0index__unchecked').to.be.present;
                  browser.expect.element('.DetailsPanel .input__properties1name input').value.to.equal('windows');
                  browser.expect.element('.DetailsPanel .select__properties1type').text.to.equal('Number');
                  browser.expect.element('.DetailsPanel .input__properties1default_ input').value.to.equal('6');
                  browser.expect.element('.DetailsPanel .input__properties1description input').value.to.equal('notes windows');
                  browser.expect.element('.DetailsPanel .checkbox__properties1required__checked').to.be.present;
                  browser.expect.element('.DetailsPanel .checkbox__properties1index__checked').to.be.present;
                  browser.expect.element('.DetailsPanel .input__userFields0name input').value.to.equal('field2');
                  browser.expect.element('.DetailsPanel .select__userFields0type').text.to.equal('Number');
                  browser.expect.element('.DetailsPanel .input__userFields0value input').value.to.equal('123');
                  browser.expect.element('.DetailsPanel .input__userFields1name input').value.to.equal('field3');
                  browser.expect.element('.DetailsPanel .select__userFields1type').text.to.equal('Object');
                  browser.expect.element('.DetailsPanel .input__userFields1value textarea:nth-child(2)').value.to.contain('abc');
                  browser.expect.element('.DetailsPanel .input__userFields1value textarea:nth-child(2)').value.to.contain('234');
                  browser.expect.element('.DetailsPanel .input__userFields2name').to.not.be.present;
                  browser.expect.element('.DetailsPanel .input__relations0name input').value.to.equal('relation2');
                  browser.expect.element('.DetailsPanel .select__relations0type').text.to.equal('belongsTo');
                  browser.expect.element('.DetailsPanel .select__relations0model').text.to.equal('Bus');
                  browser.expect.element('.DetailsPanel .input__relations0foreignKey input').value.to.equal('bus1');
                  browser.expect.element('.DetailsPanel .input__relations1name input').value.to.equal('relation3');
                  browser.expect.element('.DetailsPanel .select__relations1type').text.to.equal('hasAndBelongsToMany');
                  browser.expect.element('.DetailsPanel .select__relations1model').text.to.equal('Bus');
                  browser.expect.element('.DetailsPanel .input__relations1foreignKey input').value.to.equal('bus2');
                  browser.expect.element('.DetailsPanel .input__relations2name').to.not.be.present;
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
