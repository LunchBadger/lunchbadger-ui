const fs = require('fs');
let notifiedCoverage = false;

var pageCommands = {
  open: function () {
    this.api.page.lunchBadger().navigate();
    this.api.resizeWindow(1920, 1080);
    return this
      .waitForElementVisible('.FakeLogin', 5000)
      .setValueSlow('.input__login input', 'test')
      .setValueSlow('.input__password input', 'CircleCI')
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

  reloadPage: function () {
    this.api.refresh();
    return this
      .waitForElementVisible('.app', 120000)
      .waitForElementNotPresent('.app__loading-error', 5000)
      .waitForElementVisible('.app__loading-message', 60000)
      .waitForElementNotPresent('.app__loading-message', 60000)
      .waitForElementNotPresent('.spinner__overlay', 60000);
  },

  pause: function (ms) {
    this.api.pause(ms);
    return this;
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
      .clickPresent('.Tool.' + entity)
      .pause(3000)
      .clickPresent('.Tool__submenuItem.' + option);
  },

  addElement: function (entity) {
    return this
      .clickVisible('.Tool.' + entity);
  },

  dragDropElement: function (dragTarget, dropTarget) {
    return this
      .drag(dragTarget, dropTarget);
  },

  clickPresent: function (selector, timeout = 15000) {
    return this
      .waitForElementPresent(selector, timeout)
      .click(selector);
  },

  clickVisible: function (selector, timeout = 15000) {
    return this
      .waitForElementVisible(selector, timeout)
      .click(selector);
  },

  setValueSlow: function (selector, value) {
    const self = this;
    return this
      .waitForElementPresent(selector, 50000)
      .getValue(selector, function (result) {
        for (var i in result.value.toString()) {
          self.setValue(selector, this.Keys.BACK_SPACE);
        }
        return self;
      })
      .clearValue(selector)
      .setValue(selector, value)
      .check({
        value: {
          [selector]: value
        }
      });
  },

  selectValueSlow: function (selector, select, value) {
    return this
      .clickPresent(selector + ` .select__${select}`)
      .clickPresent(`div[role=menu] .${select}__${value}`)
      .waitForElementPresent(selector + ` .select__${select} .${select}__${value}`, 5000);
  },

  editEntity: function (selector) {
    return this
      .clickVisible(selector)
      .clickVisible(selector + '.highlighted .Toolbox__button--edit')
      .waitForElementPresent(selector + '.editable', 50000)
      .waitForElementVisible(selector + ' .input__name input', 50000);
  },

  discardCanvasEntityChanges: function (selector) {
    return this
      .clickVisible(selector + ' .cancel')
      .waitForElementNotPresent(selector + '.editable', 5000);
  },

  submitGatewayDeploy: function (selector, gatewayName) {
    const text = {
      '.SystemInformationMessages .SystemInformationMessages__item:first-child .SystemInformationMessages__item__message': gatewayName + ' successfully deployed'
    };
    return this
      .submitCanvasEntity(selector)
      .waitForElementVisible('.SystemInformationMessages', 180000)
      .check({text})
      .waitForElementNotPresent('.SystemInformationMessages .SystemInformationMessages__item:first-child', 15000);
  },

  submitCanvasEntity: function (selector) {
    return this
      .submitForm(selector + ' form')
      .waitForElementNotPresent(selector + '.wip', 120000)
      .waitForElementNotPresent('.Aside.disabled', 5000)
      .waitForElementNotPresent('.SystemDefcon1', 60000);
  },

  submitCanvasEntityWithExpectedValidationErrors: function (selector, validationErrors = []) {
    const present = validationErrors.map(key => `${selector} .EntityValidationErrors__fields__field.validationError__${key}`)
    return this
      .submitForm(selector + ' form')
      .waitForElementPresent(selector + ' .EntityValidationErrors', 15000)
      .check({present})
      .pause(3000);
  },

  submitDetailsPanel: function (selector) {
    return this
      .waitForElementNotPresent('.DetailsPanel .BaseDetails__buttons .submit.disabled', 5000)
      .submitForm('.DetailsPanel .BaseDetails form')
      .waitForElementPresent(selector + '.wip', 5000)
      .waitForElementPresent('.DetailsPanel.closing', 5000)
      .waitForElementNotPresent('.DetailsPanel.closing', 15000)
      .waitForElementNotPresent(selector + '.wip', 60000);
  },

  submitDetailsPanelWithExpectedValidationErrors: function (validationErrors = []) {
    const present = validationErrors.map(key => `.DetailsPanel .EntityValidationErrors__fields__field.validationError__${key}`);
    return this
      .waitForElementNotPresent('.DetailsPanel .BaseDetails__buttons .submit.disabled', 5000)
      .submitForm('.DetailsPanel .BaseDetails form')
      .waitForElementPresent('.DetailsPanel .EntityValidationErrors', 60000)
      .check({present});
  },

  openEntityInDetailsPanel: function (selector) {
    return this
      .clickPresent(selector + ' .EntityHeader__name')
      .clickPresent(selector + '.highlighted .Toolbox__button--zoom')
      .waitForElementVisible('.DetailsPanel.visible .panel .BaseDetails.general', 50000);
  },

  closeDetailsPanel: function () {
    return this
      .clickPresent('.DetailsPanel .BaseDetails__buttons .cancel')
      .waitForElementPresent('.DetailsPanel.closing', 5000)
      .waitForElementNotPresent('.DetailsPanel.closing', 15000);
  },

  removeEntity: function (selector) {
    return this
      .clickVisible(selector)
      .clickVisible(selector + ' .Entity > .Toolbox .Toolbox__button--delete')
      .clickVisible('.SystemDefcon1 .confirm')
      .waitForElementNotPresent(selector, 5000);
  },

  connectPorts: function (fromSelector, fromDir, toSelector, toDir, pipelineIdx = -1) {
    const bothOutDir = fromDir === 'out' && toDir === 'out';
    const startSelector = fromSelector + ` .port-${fromDir} > .port__anchor${bothOutDir ? '' : ' > .port__inside'}`;
    const endSelector = toSelector + (pipelineIdx === -1 ? '' : ` .Gateway__pipeline${pipelineIdx}`) + ` .port-${toDir} > .port__anchor > .port__inside`;
    return this
      .waitForElementPresent(startSelector, 10000)
      .waitForElementPresent(endSelector, 10000)
      .moveElement(startSelector, endSelector, [bothOutDir ? 7 : null, bothOutDir ? 9 : null], [null, null]);
  },

  moveElement: function (fromSelector, toSelector, offsetFrom = [0, 0], offsetTo = [0, 150]) {
    this.api
      .pause(500)
      .useCss()
      .moveToElement(fromSelector, offsetFrom[0], offsetFrom[1])
      .mouseButtonDown(0)
      .moveToElement(toSelector, offsetTo[0], offsetTo[1])
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

  getMicroserviceSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(2) .quadrant__body .CanvasElement.Microservice:nth-child(' + nth + ')';
  },

  getServiceEndpointSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(2) .quadrant__body .CanvasElement.ServiceEndpoint:nth-child(' + nth + ')';
  },

  getApiEndpointSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(4) .quadrant__body .CanvasElement.ApiEndpoint:nth-child(' + nth + ')';
  },

  getUniqueName: function (prefix) {
    return prefix + '' + Math.random().toString(36).substr(2, 5);
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

  testDatasource: function (type = 'memory', config = [], required) {
    const selector = this.getDataSourceSelector(1);
    this
      .addElementFromTooltip('dataSource', type)
      .waitForElementPresent('.dataSource.Tool.selected', 8000);
    if (required) {
      this
        .submitCanvasEntityWithExpectedValidationErrors(selector, required);
    }
    if (config.length === 0) {
      this.waitForElementNotPresent(selector + ' .EntityProperties .EntityProperty:nth-child(1)', 5000);
    } else {
      config.forEach((option, idx) => {
        this.api.expect.element(selector + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityPropertyLabel`).text.to.equal(option[0]);
        this.setValueSlow(this.getDataSourceFieldSelector(1, idx + 1), option[1]);
      });
      this.waitForElementNotPresent(selector + ` .EntityProperties .EntityProperty:nth-child(${config.length + 1})`, 5000);
    }
    this.submitCanvasEntity(selector);
    if (config.length === 0) {
      this.waitForElementNotPresent(selector + ' .EntityProperties .EntityProperty:nth-child(1)', 5000);
    } else {
      config.forEach((option, idx) => {
        this.api.expect.element(selector + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityPropertyLabel`).text.to.equal(option[0]);
        this.api.expect.element(selector + ` .EntityProperties .EntityProperty:nth-child(${idx + 1}) .EntityProperty__field--text`).text.to.equal(option[0] === 'PASSWORD' ? '••••••••••••' : option[1]);
        this.api.expect.element(this.getDataSourceFieldSelector(1, idx + 1)).value.to.equal(option[1]);
      });
      this.waitForElementNotPresent(selector + ` .EntityProperties .EntityProperty:nth-child(${config.length + 1})`, 5000);
    }
    return this;
  },

  checkStatusTooltip: function (status) {
    const self = this;
    return this
      .moveToElement('.workspace-status', 5, 5, function () {
        self.api.expect.element('.ContextualInformationMessage.Workspace-OK .rc-tooltip-inner').text.to.contain(status).before(6000);
        return self;
      });
  },

  checkStatusTooltipNotPresent: function () {
    const self = this;
    return this
      .moveToElement('.header', 5, 5, function () {
        self.waitForElementNotPresent('.ContextualInformationMessage.Workspace-OK', 3000);
        return self;
      });
  },

  check: function ({
    text = {},
    value = {},
    present = [],
    notPresent = [],
    equal = [],
    notEqual = [],
    hasClass = {}
  }) {
    Object.keys(text).forEach((key) => {
      this.api.expect.element(key).text.to.equal(text[key]);
    });
    Object.keys(value).forEach((key) => {
      this.api.expect.element(key).value.to.equal(value[key]);
    });
    present.forEach((selector) => {
      this.api.expect.element(selector).to.be.present;
    });
    notPresent.forEach((selector) => {
      this.api.expect.element(selector).to.not.be.present;
    });
    equal.forEach((item) => {
      this.api.assert.equal(item[0], item[1]);
    });
    notEqual.forEach((item) => {
      this.api.assert.notEqual(item[0], item[1]);
    });
    Object.keys(hasClass).forEach((key) => {
      this.api.expect.element(key).to.have.attribute('class').which.contains(hasClass[key]);
    })
    return this;
  },

  checkEntityDetails: function ({
    value = {},
    checkbox = {},
    select = {},
    notPresent = []
  }) {
    const data = {
      value: Object.keys(value).reduce((map, key) => {
        map[`.DetailsPanel .input__${key} input`] = value[key];
        return map;
      }, {}),
      present: [
        ...Object.keys(checkbox).map(key => `.DetailsPanel .checkbox__${key}__${checkbox[key] ? 'checked' : 'unchecked'}`),
        ...Object.keys(select).map(key => `.DetailsPanel .select__${key} .${key}__${select[key]}`)
      ],
      notPresent: notPresent.map(item => `.DetailsPanel ${item}`)
    };
    return this
      .check(data);
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
