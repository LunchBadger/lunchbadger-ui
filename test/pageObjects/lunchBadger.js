const fs = require('fs');
let notifiedCoverage = false;

var pageCommands = {
  open: function () {
    var page = this.api.page.lunchBadger().navigate();
    this.api.resizeWindow(1920, 1080);
    this.waitForElementVisible('.FakeLogin', 5000);
    this.setValueSlow('.input__login input', 'test');
    this.setValueSlow('.input__password input', 'Test User');
    this.submitForm('.FakeLogin__form form');
    this.projectLoaded();
    this.emptyProject();
    return page;
  },

  close: function () {
    this.emptyProject();
    return this.api.execute(function() {
      return window.__coverage__;
    }, [], function(response) {
      if (!response.value) {
        if (!notifiedCoverage) {
          console.warn('NOTE: client code not instrumented for coverage! ' +
                       'Coverage output will not be available.');
          notifiedCoverage = true;
        }
        return;
      }

      fs.writeFileSync(`coverage/coverage-${response.sessionId}.json`,
                       JSON.stringify(response.value));
    }).end();
  },

  refresh: function (cb) {
    this.api.refresh(() => {
      this.projectLoaded();
      cb && cb();
    });
  },

  projectLoaded: function () {
    // TODO consider refactoring using callback or promise
    this.waitForElementVisible('.app', 120000);
    this.waitForElementNotPresent('.app__loading-error', 5000);
    this.waitForElementVisible('.app__loading-message', 60000);
    this.waitForElementNotPresent('.app__loading-message', 60000);
    this.waitForElementNotPresent('.spinner__overlay', 60000);
  },

  addElementFromTooltip: function (entity, option) {
    option = option || 'rest';
    this.clickSlow('.Tool.' + entity);
    this.api.pause(1500);
    this.clickSlow('.Tool__submenuItem.' + option);
  },

  addElement: function (entity) {
    this.click('.Tool.' + entity);
  },

  dragDropElement: function (dragTarget, dropTarget) {
    this.api.drag(dragTarget, dropTarget);
    return this;
  },

  clickSlow: function (selector, cb) {
    this.waitForElementVisible(selector, 5000);
    this.click(selector, () => {
      cb && cb();
    });
  },

  setValueSlow: function (selector, value) {
    this.waitForElementPresent(selector, 50000);
    this.getValue(selector, function (result) {
      for (var i in result.value.toString()) {
        this.setValue(selector, this.Keys.BACK_SPACE);
      }
    });
    this.setValue(selector, value);
    this.expect.element(selector).value.to.equal(value);
  },

  selectValueSlow: function (selector, select, value) {
    this.clickSlow(selector + ` .select__${select}`);
    this.api.pause(2000);
    this.clickSlow(`div[role=menu] .${select}__${value}`);
    this.waitForElementPresent(selector + ` .select__${select} .${select}__${value}`, 5000);
    this.api.pause(500);
  },

  editEntity: function (selector) {
    this.click(selector);
    this.waitForElementPresent(selector + '.highlighted .Toolbox__button--edit', 50000);
    this.moveToElement(selector + '.highlighted .Toolbox__button--edit', 5, -10, function() {
      this.click(selector + '.highlighted .Toolbox__button--edit');
      this.waitForElementPresent(selector + '.editable', 50000);
      this.waitForElementVisible(selector + ' .input__name input', 50000);
    });
  },

  discardCanvasEntityChanges: function (selector) {
    this.moveToElement(selector + ' .cancel', 5, 5, function() {
      this.click(selector + ' .cancel');
    });
    this.waitForElementNotPresent(selector + '.editable', 5000);
  },

  submitCanvasEntity: function (selector) {
    this.submitForm(selector + ' form');
    this.waitForElementNotPresent(selector + '.wip', 120000);
    this.waitForElementNotPresent('.Aside.disabled', 5000);
    this.waitForElementNotPresent('.SystemDefcon1', 60000);
  },

  submitDetailsPanel: function (selector, validationErrors = []) {
    this.clickSlow('.DetailsPanel .BaseDetails__buttons .submit:not(.disabled)', () => {
      if (validationErrors.length === 0) {
        this.waitForElementPresent(selector + '.wip', 60000);
        this.waitForElementPresent('.DetailsPanel.closing', 60000);
        this.waitForElementNotPresent('.DetailsPanel.closing', 60000);
        this.waitForElementNotPresent(selector + '.wip', 60000);
      } else {
        this.api.pause(2000);
        this.waitForElementPresent('.DetailsPanel .EntityValidationErrors', 60000);
        validationErrors.forEach((key) => {
          this.expect.element(`.DetailsPanel .EntityValidationErrors__fields__field.validationError__${key}`).to.be.present;
        });
      }
    });
  },

  openEntityInDetailsPanel: function (selector) {
    this.clickSlow(selector);
    this.clickSlow(selector + '.highlighted .Toolbox__button--zoom');
    this.waitForElementPresent('.DetailsPanel.visible .panel .BaseDetails.general', 50000);
  },

  closeDetailsPanel: function () {
    this.clickSlow('.DetailsPanel .BaseDetails__buttons .cancel');
    this.waitForElementPresent('.DetailsPanel.closing', 60000);
    this.waitForElementNotPresent('.DetailsPanel.closing', 60000);
  },

  removeEntity: function (selector) {
    this.click(selector);
    this.clickSlow(selector + ' .Entity > .Toolbox .Toolbox__button--delete');
    this.clickSlow('.SystemDefcon1 .confirm');
    this.waitForElementNotPresent(selector, 5000);
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
  },

  discardDetailsPanelChanges: function (selector) {
    this.closeDetailsPanel();
    this.openEntityInDetailsPanel(selector);
  },

  confirmDetailsPanelChanges: function (selector) {
    this.submitDetailsPanel(selector);
    this.openEntityInDetailsPanel(selector);
  },

  checkEntities: function (dataSources = '', models = '', contextPaths) {
    contextPaths = contextPaths || models.toLowerCase();
    if (dataSources === '') {
      this.waitForElementNotPresent(this.getDataSourceSelector(1), 5000);
    } else {
      dataSources.split(',').forEach((name, idx) => {
        this.waitForElementPresent(this.getDataSourceSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text', 5000);
        this.expect.element(this.getDataSourceSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(name);
      });
      this.waitForElementNotPresent(this.getDataSourceSelector(dataSources.split(',').length + 1), 5000);
    }
    if (models === '') {
      this.waitForElementNotPresent(this.getModelSelector(1), 5000);
    } else {
      models.split(',').forEach((name, idx) => {
        this.waitForElementPresent(this.getModelSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text', 5000);
        this.expect.element(this.getModelSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(name);
      });
      this.waitForElementNotPresent(this.getModelSelector(models.split(',').length + 1), 5000);
    }
    if (contextPaths !== '') {
      contextPaths.split(',').forEach((name, idx) => {
        this.waitForElementPresent(this.getModelSelector(idx + 1) + ' .EntityProperty__field.httppath .EntityProperty__field--text', 5000);
        this.expect.element(this.getModelSelector(idx + 1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal(name);
      });
    }
  },

  checkModelDetails: function (name, contextPath, plural = '', base = 'PersistedModel') {
    this.expect.element('.DetailsPanel .input__name input').value.to.equal(name);
    this.expect.element('.DetailsPanel .input__httppath input').value.to.equal(contextPath);
    this.expect.element('.DetailsPanel .input__plural input').value.to.equal(plural);
    this.expect.element('.DetailsPanel .select__base').text.to.equal(base);
  },

  checkDetailsFields: function (names, prefix, postfix, kind = 'string') {
    if (names === '') {
      this.waitForElementNotPresent(`.DetailsPanel .input__${prefix}0${postfix}`, 5000);
    } else {
      names.split(',').forEach((name, idx) => {
        if (kind === 'select') {
          this.expect.element(`.DetailsPanel .select__${prefix}${idx}${postfix}`).text.to.equal(name);
        } else if (kind === 'checkbox') {
          this.expect.element(`.DetailsPanel .checkbox__${prefix}${idx}${postfix}__${name}`).to.be.present;
        } else {
          this.expect.element(`.DetailsPanel .input__${prefix}${idx}${postfix} input`).value.to.equal(name);
        }
      });
      this.waitForElementNotPresent(`.DetailsPanel .input__properties${names.split(',').length}name`, 5000);
    }
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
    this.click('.header__menu .fa-floppy-o');
    this.closeSystemInformationMessage('All-data-has-been-synced-with-API');
  },

  clearProject: function () {
    this.click('.header__menu__element .fa-trash-o');
    this.waitForElementPresent('.SystemDefcon1 .ConfirmModal .confirm', 5000);
    this.click('.SystemDefcon1 .ConfirmModal .confirm');
    this.waitForElementPresent('.spinner__overlay', 5000);
  },

  emptyProject: function () {
    this.clearProject();
    this.closeSystemInformationMessage('All-data-removed-from-server');
    this.waitForElementNotPresent('.spinner__overlay', 120000);
    this.saveProject();
  },

  closeSystemInformationMessage: function (message) {
    const selector = `.SystemInformationMessages .SystemInformationMessages__item.${message} .SystemInformationMessages__item__delete`;
    this.waitForElementPresent(selector, 180000);
    this.click(selector);
    this.waitForElementNotPresent(selector, 15000);
  },

  closeWhenSystemDefcon1: function () {
    this.waitForElementPresent('.SystemDefcon1 button', 120000);
    this.clickSlow('.SystemDefcon1 button');
  },

  waitForDependencyFinish: function () {
    this.waitForElementPresent('.workspace-status .workspace-status__progress', 120000);
    this.waitForElementNotPresent('.workspace-status .workspace-status__progress', 120000);
    this.waitForElementPresent('.workspace-status .workspace-status__success', 120000);
  },

  testDatasource: function (type, config = [], advancedTests) {
    this.addElementFromTooltip('dataSource', type);
    this.waitForElementPresent('.dataSource.Tool.selected', 8000);
    if (config.length === 0) {
      this.waitForElementNotPresent(this.getDataSourceSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1)', 5000);
    } else {
      config.forEach((option, idx) => {
        this.expect.element(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityPropertyLabel`).text.to.equal(option[0]);
        this.setValueSlow(this.getDataSourceFieldSelector(1, idx + 1), option[1]);
      });
      this.waitForElementNotPresent(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${config.length + 1})`, 5000);
    }
    this.submitCanvasEntity(this.getDataSourceSelector(1));
    if (config.length === 0) {
      this.waitForElementNotPresent(this.getDataSourceSelector(1) + ' .EntityProperties .EntityProperty:nth-child(1)', 5000);
    } else {
      config.forEach((option, idx) => {
        this.expect.element(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityPropertyLabel`).text.to.equal(option[0]);
        this.expect.element(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityProperty__field--text`).text.to.equal(option[0] === 'PASSWORD' ? '••••••••••••' : option[1]);
        this.expect.element(this.getDataSourceFieldSelector(1, idx + 1)).value.to.equal(option[1]);
      });
      this.waitForElementNotPresent(this.getDataSourceSelector(1) + ` .EntityProperties .EntityProperty:nth-child(${config.length + 1})`, 5000);
    }
    if (advancedTests) {
      advancedTests();
    } else {
      this.removeEntity(this.getDataSourceSelector(1));
      if (config.length > 0) {
        this.waitForDependencyFinish();
      }
    }
  },

  checkEntityDetails: function ({
    text = {},
    checkbox = {},
    select = {},
    notPresent = [],
  }) {
    Object.keys(text).forEach((key) => {
      this.expect.element(`.DetailsPanel .input__${key} input`).value.to.equal(text[key]);
    });
    Object.keys(checkbox).forEach((key) => {
      this.expect.element(`.DetailsPanel .checkbox__${key}__${checkbox[key] ? 'checked' : 'unchecked'}`).to.be.present;
    });
    Object.keys(select).forEach((key) => {
      this.expect.element(`.DetailsPanel .select__${key} .${key}__${select[key]}`).to.be.present;
    });
    notPresent.forEach((elem) => {
      this.expect.element(`.DetailsPanel ${elem}`).to.not.be.present;
    });
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
