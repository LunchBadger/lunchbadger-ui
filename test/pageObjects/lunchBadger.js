const fs = require('fs');
let notifiedCoverage = false;

var pageCommands = {
  open: function () {
    this.api.page.lunchBadger().navigate();
    this.api.resizeWindow(1920, 1080);
    return this
      .waitForElementVisible('.FakeLogin', 5000)
      .setValueSlow('.input__login input', 'test')
      .setValueSlow('.input__password input', 'Test User')
      .submitForm('.FakeLogin__form form')
      .projectLoaded()
      .emptyProject();
  },

  close: function () {
    this.emptyProject();
    this.api.execute(function () {
      return window.__coverage__;
    }, [], function (response) {
      if (!response.value) {
        if (!notifiedCoverage) {
          console.warn('NOTE: client code not instrumented for coverage! Coverage output will not be available.');
          notifiedCoverage = true;
        }
        return;
      }
      fs.writeFileSync(`coverage/coverage-${response.sessionId}.json`, JSON.stringify(response.value));
    });
    this.api.end();
    return this;
  },

  refreshBrowser: function () {
    this.api.refresh();
    return this
      .projectLoaded();
  },

  projectLoaded: function () {
    return this
      .waitForElementVisible('.app', 120000)
      .waitForElementNotPresent('.app__loading-error', 5000)
      .waitForElementVisible('.app__loading-message', 60000)
      .waitForElementNotPresent('.app__loading-message', 60000)
      .waitForElementNotPresent('.spinner__overlay', 60000);
  },

  addElementFromTooltip: function (entity, option = 'rest') {
    return this
      .clickVisible('.Tool.' + entity)
      // .pause(1500)
      .clickVisible('.Tool__submenuItem.' + option);
  },

  // pause

  addElement: function (entity) {
    return this
      .clickVisible('.Tool.' + entity);
  },

  dragDropElement: function (dragTarget, dropTarget) {
    return this
      .drag(dragTarget, dropTarget);
  },

  clickPresent: function (selector, timeout = 5000, cb) {
    const self = this;
    return this
      .waitForElementPresent(selector, timeout)
      .click(selector, function () {
        console.log('clickPresent cb', cb);
        cb && cb();
        return self;
      });
  },

  clickVisible: function (selector, timeout = 5000, cb) {
    const self = this;
    return this
      .waitForElementVisible(selector, timeout)
      .click(selector, function () {
        console.log('clickVisible cb', cb);
        cb && cb();
        return self;
      });
  },

  setValueSlow: function (selector, value) {
    return this
      .waitForElementPresent(selector, 50000)
    // this.api.getValue(selector, function (result) {
    //   for (var i in result.value.toString()) {
    //     this.api.setValue(selector, this.Keys.BACK_SPACE);
    //   }
    // });
      .clearValue(selector)
      .setValue(selector, value);
    // this.api.expect.element(selector).value.to.equal(value);
    // return this;
  },

  selectValueSlow: function (selector, select, value) {
    return this
      .clickVisible(selector + ` .select__${select}`)
    // this.api.pause(2000);
      .clickVisible(`div[role=menu] .${select}__${value}`)
      .waitForElementPresent(selector + ` .select__${select} .${select}__${value}`, 5000);
    // this.api.pause(500);
    // return this;
  },

  editEntity: function (selector) {
    return this
      .clickVisible(selector)
    // this.waitForElementPresent(selector + '.highlighted .Toolbox__button--edit', 50000);
    // this.api.moveToElement(selector + '.highlighted .Toolbox__button--edit', 5, -10, function() {
      .clickVisible(selector + '.highlighted .Toolbox__button--edit')
      .waitForElementPresent(selector + '.editable', 50000)
      .waitForElementVisible(selector + ' .input__name input', 50000);
    // });
  },

  discardCanvasEntityChanges: function (selector) {
    return this
    // this.moveToElement(selector + ' .cancel', 5, 5, function() {
      .clickVisible(selector + ' .cancel')
    // });
      .waitForElementNotPresent(selector + '.editable', 5000);
  },

  submitCanvasEntity: function (selector) {
    return this
      .submitForm(selector + ' form')
      .waitForElementNotPresent(selector + '.wip', 120000)
      .waitForElementNotPresent('.Aside.disabled', 5000)
      .waitForElementNotPresent('.SystemDefcon1', 60000);
  },

  submitDetailsPanel: function (selector) { //}, validationErrors = []) {
    // const self = this;
    return this
      .waitForElementNotPresent('.DetailsPanel .BaseDetails__buttons .submit.disabled', 5000)
      .submitForm('.DetailsPanel .BaseDetails form') // .BaseDetails__buttons .submit', 5000) //, function () {
      //   if (validationErrors.length === 0) {
      //     return this
        // return self
          .waitForElementPresent(selector + '.wip', 5000)
          .waitForElementPresent('.DetailsPanel.closing', 5000)
          .waitForElementNotPresent('.DetailsPanel.closing', 15000)
          .waitForElementNotPresent(selector + '.wip', 60000); //, function () {
          //   console.log('submitDetailsPanel cb', cb);
          //   cb && cb();
          //   return self;
          // });
      //   } else {
      //     // this.api.pause(2000);
      //     return this
      //       .waitForElementPresent('.DetailsPanel .EntityValidationErrors', 60000);
      //     // validationErrors.forEach((key) => {
      //     //   this.api.expect.element(`.DetailsPanel .EntityValidationErrors__fields__field.validationError__${key}`).to.be.present;
      //     // });
      //   }
      // });
  },

  openEntityInDetailsPanel: function (selector) {
    return this
      .clickVisible(selector + ' .EntityHeader__name')
      .clickVisible(selector + '.highlighted .Toolbox__button--zoom')
      .waitForElementVisible('.DetailsPanel.visible .panel .BaseDetails.general', 50000);
  },

  closeDetailsPanel: function () {
    return this
      .clickVisible('.DetailsPanel .BaseDetails__buttons .cancel')
      .waitForElementPresent('.DetailsPanel.closing', 60000)
      .waitForElementNotPresent('.DetailsPanel.closing', 60000);
  },

  removeEntity: function (selector) {
    return this
      .clickVisible(selector)
      .clickVisible(selector + ' .Entity > .Toolbox .Toolbox__button--delete')
      .clickVisible('.SystemDefcon1 .confirm')
      .waitForElementNotPresent(selector, 5000);
  },

  connectPorts: function (fromSelector, fromDir, toSelector, toDir) {
    var bothOutDir = fromDir === 'out' && toDir === 'out';
    this.api
      .pause(500)
      .useCss()
      .moveToElement(fromSelector + ` .port-${fromDir} > .port__anchor${bothOutDir ? '' : ' > .port__inside'}`, bothOutDir ? 7 : null, bothOutDir ? 9 : null)
      .mouseButtonDown(0)
      .moveToElement(toSelector + ` .port-${toDir} > .port__anchor > .port__inside`, null, null)
      .pause(500)
      .mouseButtonUp(0)
      .pause(500);
    return this;
  },

  discardDetailsPanelChanges: function (selector) {
    return this
      .closeDetailsPanel()
      .openEntityInDetailsPanel(selector);
  },

  confirmDetailsPanelChanges: function (selector) {
    return this
      .submitDetailsPanel(selector)
      .openEntityInDetailsPanel(selector);
  },

  checkEntities: function (dataSources = '', models = '', contextPaths) {
    contextPaths = contextPaths || models.toLowerCase();
    if (dataSources === '') {
      this.waitForElementNotPresent(this.getDataSourceSelector(1), 5000);
    } else {
      dataSources.split(',').forEach((name, idx) => {
        this.waitForElementPresent(this.getDataSourceSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text', 5000);
        this.api.expect.element(this.getDataSourceSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(name);
      });
      this.waitForElementNotPresent(this.getDataSourceSelector(dataSources.split(',').length + 1), 5000);
    }
    if (models === '') {
      this.waitForElementNotPresent(this.getModelSelector(1), 5000);
    } else {
      models.split(',').forEach((name, idx) => {
        this.waitForElementPresent(this.getModelSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text', 5000);
        this.api.expect.element(this.getModelSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(name);
      });
      this.waitForElementNotPresent(this.getModelSelector(models.split(',').length + 1), 5000);
    }
    if (contextPaths !== '') {
      contextPaths.split(',').forEach((name, idx) => {
        this.waitForElementPresent(this.getModelSelector(idx + 1) + ' .EntityProperty__field.httppath .EntityProperty__field--text', 5000);
        this.api.expect.element(this.getModelSelector(idx + 1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal(name);
      });
    }
    return this;
  },

  checkModelDetails: function (name, contextPath, plural = '', base = 'PersistedModel') {
    this.api.expect.element('.DetailsPanel .input__name input').value.to.equal(name);
    this.api.expect.element('.DetailsPanel .input__httppath input').value.to.equal(contextPath);
    this.api.expect.element('.DetailsPanel .input__plural input').value.to.equal(plural);
    this.api.expect.element('.DetailsPanel .select__base').text.to.equal(base);
    return this;
  },

  checkDetailsFields: function (names, prefix, postfix, kind = 'string') {
    if (names === '') {
      this.waitForElementNotPresent(`.DetailsPanel .input__${prefix}0${postfix}`, 5000);
    } else {
      names.split(',').forEach((name, idx) => {
        if (kind === 'select') {
          this.api.expect.element(`.DetailsPanel .select__${prefix}${idx}${postfix}`).text.to.equal(name);
        } else if (kind === 'checkbox') {
          this.api.expect.element(`.DetailsPanel .checkbox__${prefix}${idx}${postfix}__${name}`).to.be.present;
        } else {
          this.api.expect.element(`.DetailsPanel .input__${prefix}${idx}${postfix} input`).value.to.equal(name);
        }
      });
      this.waitForElementNotPresent(`.DetailsPanel .input__properties${names.split(',').length}name`, 5000);
    }
    return this;
  },

  getDataSourceSelector: function (nth) {
    return '.canvas__container .quadrant:first-child .quadrant__body .CanvasElement.DataSource:nth-child(' + nth + ')';
  },

  getDataSourceFieldSelector: function (nthEntity, nthProperty) {
    return this.getDataSourceSelector(nthEntity) + ' .EntityProperties .EntityProperty:nth-child(' + nthProperty + ') .EntityProperty__field--input input';
  },

  getModelSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(2) .quadrant__body .CanvasElement.Model:nth-child(' + nth + ')';
  },

  getGatewaySelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(3) .quadrant__body .CanvasElement.Gateway:nth-child(' + nth + ')';
  },

  getApiSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(4) .quadrant__body .CanvasElement.API:nth-child(' + nth + ')';
  },

  getServiceEndpointSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(2) .quadrant__body .CanvasElement.ServiceEndpoint:nth-child(' + nth + ')';
  },

  getApiEndpointSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(4) .quadrant__body .CanvasElement.ApiEndpoint:nth-child(' + nth + ')';
  },

  saveProject: function () {
    return this
      .clickVisible('.header__menu .fa-floppy-o')
      .closeSystemInformationMessage('All-data-has-been-synced-with-API');
  },

  clearProject: function () {
    return this
      .clickPresent('.header__menu__element .fa-trash-o')
      .clickVisible('.SystemDefcon1 .ConfirmModal .confirm')
      .waitForElementPresent('.spinner__overlay', 5000);
  },

  emptyProject: function () {
    return this
      .clearProject()
      .closeSystemInformationMessage('All-data-removed-from-server')
      .waitForElementNotPresent('.spinner__overlay', 120000)
      .saveProject();
  },

  closeSystemInformationMessage: function (message) {
    const selector = `.SystemInformationMessages .SystemInformationMessages__item.${message} .SystemInformationMessages__item__delete`;
    return this
      .clickVisible(selector, 180000)
      .waitForElementNotPresent(selector, 15000);
  },

  closeWhenSystemDefcon1: function () {
    return this.clickVisible('.SystemDefcon1 button', 120000);
  },

  waitForDependencyFinish: function () {
    return this
      .waitForElementPresent('.workspace-status .workspace-status__progress', 120000)
      .waitForElementNotPresent('.workspace-status .workspace-status__progress', 120000)
      .waitForElementPresent('.workspace-status .workspace-status__success', 120000);
  },

  testDatasource: function (type, config = []) {
    this.addElementFromTooltip('dataSource', type);
    this.waitForElementPresent('.dataSource.Tool.selected', 8000);
    if (config.length === 0) {
      this.waitForElementNotPresent(this.getDataSourceSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1)', 5000);
    } else {
      config.forEach((option, idx) => {
        this.api.expect.element(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityPropertyLabel`).text.to.equal(option[0]);
        this.setValueSlow(this.getDataSourceFieldSelector(1, idx + 1), option[1]);
      });
      this.waitForElementNotPresent(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${config.length + 1})`, 5000);
    }
    this.submitCanvasEntity(this.getDataSourceSelector(1));
    if (config.length === 0) {
      this.waitForElementNotPresent(this.getDataSourceSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1)', 5000);
    } else {
      config.forEach((option, idx) => {
        this.api.expect.element(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityPropertyLabel`).text.to.equal(option[0]);
        this.api.expect.element(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityProperty__field--text`).text.to.equal(option[0] === 'PASSWORD' ? '••••••••••••' : option[1]);
        this.api.expect.element(this.getDataSourceFieldSelector(1, idx + 1)).value.to.equal(option[1]);
      });
      this.waitForElementNotPresent(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${config.length + 1})`, 5000);
    }
    return this;
    // if (advancedTests) {
    //   advancedTests();
    // } else {
    //   this.removeEntity(this.getDataSourceSelector(1));
    //   if (config.length > 0) {
    //     this.waitForDependencyFinish();
    //   }
    // }
  },

  // expect: function ({}) {
  //
  // },

  checkEntityDetails: function ({
    text = {},
    checkbox = {},
    select = {},
    notPresent = []
  }) {
    Object.keys(text).forEach((key) => {
      this.api.expect.element(`.DetailsPanel .input__${key} input`).value.to.equal(text[key]);
    });
    Object.keys(checkbox).forEach((key) => {
      this.api.expect.element(`.DetailsPanel .checkbox__${key}__${checkbox[key] ? 'checked' : 'unchecked'}`).to.be.present;
    });
    Object.keys(select).forEach((key) => {
      this.api.expect.element(`.DetailsPanel .select__${key} .${key}__${select[key]}`).to.be.present;
    });
    notPresent.forEach((elem) => {
      this.api.expect.element(`.DetailsPanel ${elem}`).to.not.be.present;
    });
    return this;
  }
};

module.exports = {
  commands: [pageCommands],
  url: function () {
    return this.api.launchUrl;
  },
  elements: {
    forecaster: {
      selector: '.header__menu__element .header__menu__link.FORECASTS_PANEL'
    },
    forecasterPanel: {
      selector: '.panel__container.ForecastsPanel'
    },
    settings: {
      selector: '.header__menu__element .header__menu__link.SETTINGS_PANEL'
    },
    settingsPanel: {
      selector: '.panel__container.SettingsPanel'
    }
  }
};
