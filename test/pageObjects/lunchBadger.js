const fs = require('fs');
const login = 'sk';

let notifiedCoverage = false;
const RND = Math.floor(Math.random() * 1000);

var pageCommands = {
  openWithoutLogin: function () {
    this.api.page.lunchBadger().navigate();
    this.api.resizeWindow(1920, 1080);
    return this
      .present('.FakeLogin');
  },

  open: function () {
    return this
      .openWithDemoWizard()
      .closeDemoWizard()
      // .emptyProject()
      .hideCookieConfirmation()
      .hideDrift();
  },

  openWithDemoWizard: function () {
    const username = this.getUniqueName(`CircleCI ${this.getUsername()} `);
    const usernameText = {
      '.breadcrumbs .breadcrumbs__element.username': username
    };
    return this
      .openWithoutLogin()
      .setValueSlow('.input__login input', this.getUsername())
      .setValueSlow('.input__password input', username)
      .submitForm('.FakeLogin__form form')
      .projectLoaded()
      .check({text: usernameText});
  },

  resetWalkthrough: function () {
    return this
      .clickPresent('@settings')
      .clickPresent('.RestartWalkthrough button')
      .clickVisible('.SystemDefcon1 .confirm')
      .autoSave();
  },

  hideCookieConfirmation: function () {
    this.api.execute(function () {
      window.document.getElementById('hs-eu-cookie-confirmation').style.display = 'none';
      return;
    }, [], function () {});
    return this;
  },

  unblockWalkthroughOverlay: function () {
    this.api.execute(function () {
      window.document.querySelector('.Walkthrough .joyride-overlay').style.pointerEvents = 'none !important';
      return;
    }, [], function () {});
    return this;
  },


  hideDrift: function () {
    this.api.execute(function () {
      window.document.getElementById('drift-widget-container').style.display = 'none';
      return;
    }, [], function () {});
    return this;
  },

  showDrift: function () {
    this.api.execute(function () {
      window.document.getElementById('drift-widget-container').style.display = 'block';
      return;
    }, [], function () {});
    return this;
  },

  close: function () {
    // this.emptyProject();
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

  clickWhileDemoWizardTitle: function (selector, title, retry = 0) {
    const self = this;
    this.api.element('css selector', '.joyride-tooltip__header', function () {
      self.api.getText('.joyride-tooltip__header', function (result) {
        if (result.value === title && retry < 20) {
          self.saveScreenshot('demowizard');
          self.clickPresent(selector);
          self.pause(1000);
          self.clickWhileDemoWizardTitle(selector, title, retry + 1);
        }
      });
    });
    return this;
  },

  clickDemoWizardNext: function (title) {
    return this
      .saveScreenshot('demowizard')
      .notPresent('.app__wrapper__blocked--message')
      .clickWhileDemoWizardTitle('.joyride-tooltip__button--primary', title)
      // .clickVisible('.joyride-tooltip__button--primary')
      .saveScreenshot('demowizard')
  },

  clickDemoWizardHole: function (title) {
    return this
      .saveScreenshot('demowizard')
      .notPresent('.app__wrapper__blocked--message')
      .clickWhileDemoWizardTitle('.joyride-hole', title)
      .saveScreenshot('demowizard');
  },

  clickDemoWizardHoleWithEntityFlipping: function (selector) {
    return this
      .saveScreenshot('demowizard')
      .notPresent('.app__wrapper__blocked--message')
      .saveScreenshot('demowizard')
      .clickPresent('.joyride-hole')
      .expectFlipping(selector)
      .saveScreenshot('demowizard');
  },

  expectDemoWizardTitle: function (title) {
    return this
      .saveScreenshot('demowizard')
      .check({text: {'.joyride-tooltip__header': title}});
  },

  reloadPage: function () {
    this.api.refresh();
    return this
      .projectLoaded()
      .hideCookieConfirmation()
      .hideDrift();
  },

  pause: function (ms) {
    this.api.pause(ms);
    return this;
  },

  projectLoaded: function () {
    return this
      .present('.app', 120000)
      .present('.app__loading-message', 60000)
      .notPresent('.app__loading-error')
      .notPresent('.app__loading-message', 60000)
      .notPresent('.spinner__overlay', 60000);
  },

  present: function (selector, timeout = 5000) {
    return this
      .waitForElementPresent(selector, timeout);
  },

  notPresent: function (selector, timeout = 5000) {
    return this
      .waitForElementNotPresent(selector, timeout);
  },

  visible: function (selector, timeout = 5000) {
    return this
      .waitForElementVisible(selector, timeout);
  },

  addElementFromTooltip: function (entity, option = 'rest') {
    return this
      .clickPresent('.Tool.' + entity)
      .addDatasourceFromTooltip(option);
  },

  addDatasourceFromTooltip: function (option = 'memory') {
    return this
      .pause(3000)
      .clickPresent('.Tool__submenuItem.' + option);
  },

  addElement: function (entity) {
    return this
      .notPresent('.Aside.disabled')
      .clickPresent('.Tool.' + entity);
  },

  dragDropElement: function (dragTarget, dropTarget) {
    return this
      .drag(dragTarget, dropTarget);
  },

  doubleClick: function (selector) {
    const self = this;
    return this
      .moveToElement(selector, 5, 5, function () {
        self.api.doubleClick();
        return self;
      });
  },

  clickPresent: function (selector, timeout = 15000) {
    return this
      .present(selector, timeout)
      .click(selector);
  },

  clickVisible: function (selector, timeout = 15000) {
    return this
      .visible(selector, timeout)
      .click(selector);
  },

  clickVisibleOnHover: function (hoverSelector, selector) {
    const self = this;
    return this
      .moveToElement(hoverSelector, 5, 5, function () {
        self.clickVisible(selector);
        return self;
      });
  },

  setValueSlow: function (selector, value, selectorAfterChange) {
    const self = this;
    return this
      .present(selector)
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
          [selectorAfterChange || selector]: value
        }
      });
  },

  setField: function (selector, field, value, type = 'text') {
    return this
      .setInput(selector, `input__${field}`, value, type);
  },

  setInput: function (selector, field, value, type = 'text', fieldAfterChange = '') {
    const sel = `${selector} .${field} input[type=${type}]`;
    const selAfterChange = fieldAfterChange ? `${selector} .${fieldAfterChange} input[type=${type}]` : sel;
    return this
      .check({
        present: [sel]
      })
      .setValueSlow(sel, value, selAfterChange);
  },

  setCanvasEntityName: function (selector, name) {
    return this
      .setInput(selector, 'EntityHeader', name);
  },

  setValueWithEnter: function (selector, value) {
    return this
      .setValueSlow(selector, value)
      .setValue(selector, this.api.Keys.ENTER);
  },

  selectValueSlow: function (selector, select, value) {
    return this
      .clickPresent(selector + ` .select__${select}`)
      .selectValueOptionSlow(selector, select, value);
  },

  selectValueOptionSlow: function (selector, select, value) {
    return this
      .pause(3000)
      .clickPresent(`div[role=menu] .${select}__${value}`)
      .present(selector + ` .select__${select} .${select}__${value}`)
      .pause(1500);
  },

  setAutocomplete: function (selector, keys) {
    return this
      .clickPresent(selector)
      .sendKeys(selector, keys);
  },

  selectIconMenu: function (selector, button, option) {
    return this
      .clickPresent(`${selector} .button__${button}`)
      .pause(2000)
      .clickPresent(`.IconMenuItem__${button}__${option}`);
  },

  editEntity: function (selector) {
    return this
      .clickVisible(selector + ' .EntityHeader__name')
      .clickVisible(selector + '.highlighted .Toolbox__button--edit')
      .present('.spinner__overlay')
      .notPresent('.spinner__overlay', 60000)
      .present(selector + '.editable')
      .present(selector + ' .input__name input');
  },

  discardCanvasEntityChanges: function (selector) {
    return this
      .clickVisible(selector + ' .cancel')
      .notPresent(selector + '.editable');
  },

  discardCanvasEntityChangesWithAutoSave: function (selector) {
    return this
      .clickVisible(selector + ' .cancel')
      .present('.spinner__overlay')
      .notPresent('.spinner__overlay', 60000)
      .notPresent(selector + '.editable');
  },

  submitFunctionDeploy: function (selector, functionName) {
    const check = {
      present: [`${selector} .EntityStatus.deploying`]
    };
    const text = {
      '.SystemInformationMessages .SystemInformationMessages__item:first-child .SystemInformationMessages__item__message': functionName + ' successfully deployed'
    };
    return this
      .present(selector + ' form', 10000)
      .submitForm(selector + ' form')
      .check(check)
      .notPresent(selector + '.wip', 120000)
      .notPresent('.Aside.disabled')
      .notPresent('.SystemDefcon1', 60000)
      .visible('.SystemInformationMessages', 180000)
      .check({text})
      .notPresent('.SystemInformationMessages .SystemInformationMessages__item:first-child', 15000);
  },

  submitGatewayDeploy: function (selector, gatewayName) {
    const check = {
      present: [`${selector} .EntityStatus.deploying`]
    };
    const text = {
      '.SystemInformationMessages .SystemInformationMessages__item:first-child .SystemInformationMessages__item__message': gatewayName + ' successfully deployed'
    };
    return this
      .present(selector + ' form', 10000)
      .submitForm(selector + ' form')
      .autoSave()
      .check(check)
      .notPresent(selector + '.wip', 120000)
      .notPresent('.Aside.disabled')
      .notPresent('.SystemDefcon1', 60000)
      .visible('.SystemInformationMessages', 180000)
      .check({text})
      .notPresent('.SystemInformationMessages .SystemInformationMessages__item:first-child', 15000);
  },

  submitCanvasEntity: function (selector, check = {}) {
    return this
      .present(selector + ' form', 10000)
      .submitForm(selector + ' form')
      .present('.spinner__overlay')
      .notPresent(selector + '.wip', 120000)
      .notPresent('.spinner__overlay', 60000)
      // .autoSave()
      .notPresent('.Aside.disabled')
      .notPresent('.SystemDefcon1', 60000)
      .check(check);
  },

  saveScreenshot: function (folder) {
    const now = new Date();
    const timemark = now.toISOString().replace(/:/g, '.');
    this.api.saveScreenshot(`test/reports/screenshots/${folder}/${RND}-${timemark}.png`);
    return this;
  },

  submitCanvasEntityWithoutAutoSave: function (selector) {
    const check = {present: [`${selector}.wip`]};
    return this
      .saveScreenshot('demowizard')
      .present(selector + ' form', 10000)
      .saveScreenshot('demowizard')
      .submitForm(selector + ' form')
      .saveScreenshot('demowizard')
      .check(check)
      .saveScreenshot('demowizard')
      .waitForEntityDeployed(selector)
      .saveScreenshot('demowizard');
  },

  expectFlipping: function (selector) {
    return this
      .checkWithoutPause({present: [`${selector}.flipping`]})
      .checkWithoutPause({present: [`${selector}:not(.flipping)`]})
  },

  waitForEntityDeployed: function (selector) {
    return this
      .notPresent(selector + '.wip', 120000)
      .notPresent('.Aside.disabled')
      .notPresent('.SystemDefcon1', 60000);
  },

  waitForEntityDeployedWithMessage: function (selector, name) {
    const text = {
      '.SystemInformationMessages .SystemInformationMessages__item:first-child .SystemInformationMessages__item__message': name + ' successfully deployed'
    };
    return this
      .waitForEntityDeployed(selector)
      .visible('.SystemInformationMessages', 180000)
      .check({text})
      .notPresent('.SystemInformationMessages .SystemInformationMessages__item:first-child', 15000);
  },

  submitCanvasEntityWithExpectedValidationErrors: function (selector, validationErrors = []) {
    const present = validationErrors.map(key => `${selector} .EntityValidationErrors__fields__field.validationError__${key}`)
    return this
      .submitForm(selector + ' form')
      .present(selector + ' .EntityValidationErrors', 60000)
      .check({present})
      .pause(3000);
  },

  expectUniqueNameError: function (selector, type) {
    const {TAB} = this.api.Keys;
    const text = {
      [`${selector} .EntityHeader .EntityProperty__error`]: `${type} with that name already exists`
    };
    return this
      .submitCanvasEntityWithExpectedValidationErrors(selector, ['name'])
      .pause(3000)
      .check({text})
      .setCanvasEntityName(selector, this.getUniqueName('entity'))
      .setAutocomplete(`${selector} .EntityHeader input`, [TAB])
      .pause(3000)
      .discardCanvasEntityChanges(selector);
  },

  submitDetailsPanel: function (selector) {
    return this
      .submitDetailsPanelWithoutAutoSave(selector);
      // .autoSave();
  },

  submitDetailsPanelWithoutAutoSave: function (selector) {
    return this
      .notPresent('.DetailsPanel .BaseDetails__buttons .submit.disabled')
      .present('.DetailsPanel.visible .wrap.opened')
      .submitForm('.DetailsPanel .BaseDetails form')
      .present(selector + '.wip')
      // .present('.DetailsPanel:not(.visible) .wrap:not(.opened)')
      .present('.spinner__overlay', 30000)
      .notPresent('.spinner__overlay', 60000)
      .notPresent('.DetailsPanel.visible', 15000)
      .notPresent(selector + '.wip', 60000);
  },

  submitDetailsPanelWithCloseBeforeWip: function (selector) {
    return this
      .notPresent('.DetailsPanel .BaseDetails__buttons .submit.disabled')
      .present('.DetailsPanel.visible .wrap.opened')
      .submitForm('.DetailsPanel .BaseDetails form')
      .present('.DetailsPanel:not(.visible) .wrap:not(.opened)')
      .notPresent('.DetailsPanel.visible', 15000)
      .notPresent(selector + '.wip', 60000)
      .waitUntilDataSaved();
  },

  submitDetailsPanelWithoutWip: function () {
    return this
      .present('.DetailsPanel.visible .wrap.opened')
      .notPresent('.DetailsPanel .BaseDetails__buttons .submit.disabled')
      .submitForm('.DetailsPanel .BaseDetails form')
      .present('.DetailsPanel:not(.visible) .wrap:not(.opened)')
      .notPresent('.DetailsPanel.visible', 15000);
  },

  submitDetailsPanelWithExpectedValidationErrors: function (validationErrors = []) {
    const present = validationErrors.map(key => `.DetailsPanel .EntityValidationErrors__fields__field.validationError__${key}`);
    return this
      .notPresent('.DetailsPanel .BaseDetails__buttons .submit.disabled')
      .submitForm('.DetailsPanel .BaseDetails form')
      .present('.DetailsPanel .EntityValidationErrors', 60000)
      .check({present});
  },

  openEntityInDetailsPanel: function (selector, tab = 'zoom') {
    const panel = tab === 'zoom' ? 'general' : tab;
    return this
      .clickPresent(selector + ' .EntityHeader__name')
      .clickPresent(selector + '.highlighted .Toolbox__button--' + tab)
      .visible('.DetailsPanel.visible .panel .BaseDetails.' + panel, 15000)
      .pause(7000);
  },

  openPipelinesInDetailsPanel: function (selector) {
    return this
      .openEntityInDetailsPanel(selector, 'pipelines');
  },

  closeDetailsPanel: function () {
    return this
      .present('.DetailsPanel.visible .wrap.opened')
      .clickPresent('.DetailsPanel .BaseDetails__buttons .cancel')
      .autoSave()
      // .present('.spinner__overlay')
      // .notPresent('.spinner__overlay', 60000)
      // .present('.DetailsPanel:not(.visible) .wrap:not(.opened)')
      .notPresent('.DetailsPanel.visible', 15000)
      .pause(3000);
  },

  autoSave: function () {
    return this
      .present('.spinner__overlay', 30000)
      .notPresent('.spinner__overlay', 60000)
      .waitUntilDataSaved();
  },

  removeEntityViaDetailsPanel: function (selector, timeout, check = {}) {
    return this
      .clickVisible('.DetailsPanel .Toolbox .Toolbox__button--delete')
      .clickVisible('.SystemDefcon1 .confirm')
      .autoSave()
      .check(check)
      .notPresent(selector, timeout);
  },

  removeEntity: function (selector, timeout, check = {}) {
    return this
      .clickVisible(selector)
      .clickVisible(selector + ' .Entity > .Toolbox .Toolbox__button--delete')
      .clickVisible('.SystemDefcon1 .confirm')
      .autoSave()
      .check(check)
      .notPresent(selector, timeout);
  },

  removeEntityWithoutAutoSave: function (selector, timeout, check = {}) {
    return this
      .clickVisible(selector)
      .clickVisible(selector + ' .Entity > .Toolbox .Toolbox__button--delete')
      .clickVisible('.SystemDefcon1 .confirm')
      .check(check)
      .notPresent(selector, timeout);
  },

  removeEntityWithDependencyUninstall: function (selector, timeout, check = {}) {
    return this
      .clickVisible(selector)
      .clickVisible(selector + ' .Entity > .Toolbox .Toolbox__button--delete')
      .clickVisible('.SystemDefcon1 .confirm')
      .present('.workspace-status .workspace-status__progress', 120000)
      .check(check)
      .notPresent('.spinner__overlay', 60000)
      .notPresent('.workspace-status .workspace-status__progress', 120000)
      .present('.workspace-status .workspace-status__success', 120000)
      .notPresent(selector, timeout);
  },

  connectPorts: function (fromSelector, fromDir, toSelector, toDir, pipelineIdx = -1, isReattach = false) {
    const bothOutDir = fromDir === 'out' && toDir === 'out';
    const startSelector = fromSelector + ` .port-${fromDir} > .port__anchor${bothOutDir ? '' : ' > .port__inside'}`;
    const endSelector = toSelector + (pipelineIdx === -1 ? '' : ` .Gateway__pipeline${pipelineIdx}`) + ` .port-${toDir} > .port__anchor > .port__inside`;
    const startConnected = fromSelector;
    const endConnected = toSelector + (pipelineIdx === -1 ? '' : ` .Gateway__pipeline${pipelineIdx}`);
    const check = {
      connected: {
        [endConnected]: [toDir]
      },
      notConnected: {}
    };
    check[(fromDir === toDir && isReattach) ? 'notConnected' : 'connected'][startConnected] = [fromDir];
    return this
      .present(startSelector)
      .present(endSelector)
      .moveElement(startSelector, endSelector, [bothOutDir ? 7 : null, bothOutDir ? 9 : null], [null, null])
      .autoSave()
      .check(check);
  },

  connectPortsWithoutAutoSave: function (fromSelector, fromDir, toSelector, toDir, pipelineIdx = -1, isReattach = false) {
    const bothOutDir = fromDir === 'out' && toDir === 'out';
    const startSelector = fromSelector + ` .port-${fromDir} > .port__anchor${bothOutDir ? '' : ' > .port__inside'}`;
    const endSelector = toSelector + (pipelineIdx === -1 ? '' : ` .Gateway__pipeline${pipelineIdx}`) + ` .port-${toDir} > .port__anchor > .port__inside`;
    const startConnected = fromSelector;
    const endConnected = toSelector + (pipelineIdx === -1 ? '' : ` .Gateway__pipeline${pipelineIdx}`);
    const check = {
      connected: {
        [endConnected]: [toDir]
      },
      notConnected: {}
    };
    check[(fromDir === toDir && isReattach) ? 'notConnected' : 'connected'][startConnected] = [fromDir];
    return this
      .present(startSelector)
      .present(endSelector)
      .moveElement(startSelector, endSelector, [bothOutDir ? 7 : null, bothOutDir ? 9 : null], [null, null])
      .check(check);
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

  resizeFilesEditor: function ([xOffset, yOffset], amount) {
    const handlerSelector = '.DetailsPanel .FilesEditor .react-resizable-handle';
    let i = amount;
    this.present(handlerSelector);
    while (i--) {
      this.api
        .moveToElement(handlerSelector, 15, 15)
        .mouseButtonDown(0)
        .moveTo(null, xOffset, yOffset)
        .mouseButtonUp(0);
    }
    return this;
  },

  discardDetailsPanelChanges: function (selector) {
    return this
      .closeDetailsPanel()
      .openEntityInDetailsPanel(selector);
  },

  confirmDetailsPanelChanges: function (selector) {
    return this
      .submitDetailsPanelWithCloseBeforeWip(selector)
      .openEntityInDetailsPanel(selector);
  },

  checkEntities: function (dataSources = '', models = '', contextPaths) {
    contextPaths = contextPaths || models.toLowerCase();
    if (dataSources === '') {
      this.waitForElementNotPresent(this.getDataSourceSelector(1), 5000);
    } else {
      dataSources.split(',').forEach((name, idx) => {
        this.present(this.getDataSourceSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text');
        this.api.expect.element(this.getDataSourceSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(name);
      });
      this.notPresent(this.getDataSourceSelector(dataSources.split(',').length + 1));
    }
    if (models === '') {
      this.notPresent(this.getModelSelector(1));
    } else {
      models.split(',').forEach((name, idx) => {
        this.present(this.getModelSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text');
        this.api.expect.element(this.getModelSelector(idx + 1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal(name);
      });
      this.notPresent(this.getModelSelector(models.split(',').length + 1));
    }
    if (contextPaths !== '') {
      contextPaths.split(',').forEach((name, idx) => {
        this.present(this.getModelSelector(idx + 1) + ' .EntityProperty__field.httppath .EntityProperty__field--text');
        this.api.expect.element(this.getModelSelector(idx + 1) + ' .EntityProperty__field.httppath .EntityProperty__field--text').text.to.equal(name);
      });
    }
    return this;
  },

  checkModelDetails: function (name, contextPath, plural = '', base = 'PersistedModel') {
    return this
      .checkEntityDetails({
        value: {
          name,
          httppath: contextPath,
          plural
        },
        select: {
          base
        }
      });
  },

  checkDetailsFields: function (names, prefix, postfix, kind = 'string') {
    const check = {
      text: {},
      value: {},
      present: [],
      notPresent: []
    }
    if (names === '') {
      check.notPresent.push(`.DetailsPanel .input__${prefix}0${postfix}`);
    } else {
      names.split(',').forEach((name, idx) => {
        if (kind === 'select') {
          check.text[`.DetailsPanel .select__${prefix}${idx}${postfix}`] = name;
        } else if (kind === 'checkbox') {
          check.present.push(`.DetailsPanel .checkbox__${prefix}${idx}${postfix}__${name}`);
        } else {
          check.value[`.DetailsPanel .input__${prefix}${idx}${postfix} input`] = name;
        }
      });
      check.notPresent.push(`.DetailsPanel .input__properties${names.split(',').length}name`);
    }
    return this
      .check(check);
  },

  getUsername: function () {
    return login;
  },

  getDataSourceSelector: function (nth) {
    return '.canvas__container .quadrant:first-child .quadrant__body .CanvasElement.DataSource:nth-child(' + nth + ')';
  },

  getModelSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(2) .quadrant__body .CanvasElement.Model:nth-child(' + nth + ')';
  },

  getFunctionSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(2) .quadrant__body .CanvasElement.Function_:nth-child(' + nth + ')';
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

  waitUntilDataSaved: function () {
    return this;
      // .closeSystemInformationMessage('All-data-has-been-synced-with-API');
  },

  clearProject: function () {
    return this
      .clickPresent('.header__menu__element .fa-trash-o')
      .clickVisible('.SystemDefcon1 .ConfirmModal .confirm')
      .present('.spinner__overlay');
  },

  emptyProject: function () {
    return this
      .clearProject()
      .closeSystemInformationMessage('All-data-removed-from-server')
      .notPresent('.spinner__overlay', 120000)
      .waitForGatewaysRemoved();
  },

  closeDemoWizard: function () {
    return this
      .clickPresent('.joyride-tooltip__button--skip')
      .notPresent('.joyride-overlay');
  },

  waitForGatewaysRemoved: function () {
    return this
      .notPresent(this.getGatewaySelector(1), 600000); // wait max 10 min for any gateway to be removed
  },

  waitForFunctionRemoved: function () {
    return this
      .notPresent(this.getFunctionSelector(1), 600000); // wait max 10 min for any function to be removed
  },

  closeSystemInformationMessage: function (message) {
    const selector = `.SystemInformationMessages .SystemInformationMessages__item.${message} .SystemInformationMessages__item__delete`;
    return this
      .clickVisible(selector, 180000)
      .notPresent(selector, 15000);
  },

  closeWhenSystemDefcon1: function () {
    return this.clickVisible('.SystemDefcon1 button', 120000);
  },

  waitForEntityError: function (selector) {
    return this
      .waitForElementPresent(`${selector} .EntityError`, 120000);
  },

  waitForDependencyFinish: function () {
    return this
      .present('.workspace-status .workspace-status__progress', 120000)
      .notPresent('.workspace-status .workspace-status__progress', 120000)
      .present('.workspace-status .workspace-status__success', 120000);
  },

  testDatasource: function (type = 'memory', config = [], required) {
    const selector = this.getDataSourceSelector(1);
    this
      .addElementFromTooltip('dataSource', type)
      .present('.dataSource.Tool.selected');
    if (required) {
      this
        .submitCanvasEntityWithExpectedValidationErrors(selector, required);
    }
    if (config.length > 0) {
      config.forEach((option) => {
        this.setValueSlow(`${selector} .${option[0]} input`, option[1]);
      });
    }
    this.submitCanvasEntityWithoutAutoSave(selector);
    if (config.length > 0) {
      config.forEach((option) => {
        this.api.expect.element(`${selector} .${option[0]} .EntityProperty__field--text`).text.to.equal(option[0] === 'LunchBadgerpassword' ? '••••••••••••' : option[1]);
        this.api.expect.element(`${selector} .${option[0]} input`).value.to.equal(option[1]);
      });
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
        self.notPresent('.ContextualInformationMessage.Workspace-OK');
        return self;
      });
  },

  checkWithoutPause: function({
    text = {},
    textContain = {},
    value = {},
    valueContain = {},
    present = [],
    notPresent = [],
    equal = [],
    notEqual = [],
    hasClass = {},
    className = {},
    connected = {},
    notConnected = {}
  }) {
    Object.keys(text).forEach((key) => {
      this.api.expect.element(key).text.to.equal(text[key]).before(45000);
    });
    Object.keys(textContain).forEach((key) => {
      this.api.expect.element(key).text.to.contain(textContain[key]);
    });
    Object.keys(value).forEach((key) => {
      this.api.expect.element(key).value.to.equal(value[key]).before(45000);
    });
    Object.keys(valueContain).forEach((key) => {
      this.api.expect.element(key).value.to.contain(value[key]);
    });
    present.forEach((selector) => {
      this.api.expect.element(selector).to.be.present.before(45000);
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
    });
    Object.keys(className).forEach((key) => {
      this.api.assert.attributeEquals(key, 'class', className[key]);
    });
    Object.keys(connected).forEach((key) => {
      connected[key].forEach((dir) => {
        this.api.expect.element(`${key} .port-${dir} > .port__anchor--connected`).to.be.present.before(15000);
      });
    });
    Object.keys(notConnected).forEach((key) => {
      notConnected[key].forEach((dir) => {
        this.api.expect.element(`${key} .port-${dir} > .port__anchor--connected`).to.not.be.present.before(15000);
      });
    });
    return this;
  },

  check: function (check) {
    return this
      .pause(500)
      .checkWithoutPause(check)
  },

  expectAutocompleteValue: function (selector, values) {
    return this
      .check({
        present: [`.DetailsPanel .${selector} .Multiselect${values.map(a => '.' + a).join('')}`]
      });
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
  },

  addPolicyCAPair: function (pipelineIdx, policyIdx, pairIdx) {
    return this
      .clickPresent(`.DetailsPanel .button__add__pipeline${pipelineIdx}policy${policyIdx}CAPair`)
      .present(`.DetailsPanel .CAPair${pairIdx + 1}Label`);
  },

  getConditionFieldSelector: function (pipelineIdx, policyIdx, pairIdx, key, postfix, prefix = '') {
    return `.DetailsPanel .${key === 'name' ? 'select__' : ''}pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${prefix}${key} ${postfix}`
  },

  checkCondition: function (dataRef, pipelineIdx, policyIdx, pairIdx, condition, prefix = '') {
    Object.keys(condition).forEach((key) => {
      if (key === 'conditions') {
        condition[key].forEach((conditions, idx) => {
          this.checkCondition(dataRef, pipelineIdx, policyIdx, pairIdx, conditions, `${prefix}conditions${idx}`);
        });
      } else if (Array.isArray(condition[key])) {
        dataRef.className[this.getConditionFieldSelector(pipelineIdx, policyIdx, pairIdx, key, '.Multiselect', prefix)] = `Multiselect ${condition[key].join(' ')}`;
      } else if (typeof condition[key] === 'boolean') {
        dataRef.present.push(`.DetailsPanel .checkbox__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${prefix}${key}__${condition[key] ? '' : 'un'}checked`)
      } else {
        dataRef.value[this.getConditionFieldSelector(pipelineIdx, policyIdx, pairIdx, key, 'input', prefix)] = condition[key];
      }
    });
  },

  checkAction: function (dataRef, pipelineIdx, policyIdx, pairIdx, action, prefix = '') {
    Object.keys(action).forEach((key) => {
      let type = typeof action[key];
      if (type === 'string') {
        type = 'text';
      }
      if (Array.isArray(action[key])) {
        dataRef.className[`.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${prefix}${key} .Multiselect`] = `Multiselect ${action[key].join(' ')}`;
      } else if (type === 'boolean') {
        dataRef.present.push(`.DetailsPanel .checkbox__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${prefix}${key}__${action[key] ? '' : 'un'}checked`)
      } else if (type === 'object') {
        this.checkAction(dataRef, pipelineIdx, policyIdx, pairIdx, action[key], `${prefix}${key}`)
      } else {
        dataRef.value[`.DetailsPanel .input__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${prefix}${key} input[type=${type}]`] = action[key];
      }
    });
  },

  checkPipelines: function (expect) {
    const data = {
      value: {},
      present: [],
      className: {}
    };
    expect.forEach(({name, policies}, pipelineIdx) => {
      data.value[`.DetailsPanel .pipelines${pipelineIdx}name input`] = name;
      policies.forEach(({policy, ca = []}, policyIdx) => {
        data.value[`.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}name input`] = policy;
        ca.forEach(({condition = {}, action = {}}, pairIdx) => {
          this.checkCondition(data, pipelineIdx, policyIdx, pairIdx, condition);
          this.checkAction(data, pipelineIdx, policyIdx, pairIdx, action);
        });
      });
    });
    return this
      .check(data);
  },

  checkAutocomplete: function (selector, expect) {
    return this
      .check({
        className: {
          [`.DetailsPanel .select__${selector} .Multiselect`]: `Multiselect ${expect}`
        }
      });
  },

  addPipeline: function (gatewaySelector, pipelineIdx, pipelineName) {
    return this
      .clickPresent(`${gatewaySelector} .button__add__Pipelines`)
      .setInput(gatewaySelector, `pipelines${pipelineIdx}name`, pipelineName);
  },

  removePipeline: function (gatewaySelector, pipelineIdx) {
    const hoverSelector = `${gatewaySelector} .pipelines${pipelineIdx}name`;
    const selector = `${gatewaySelector} .button__remove__pipelines${pipelineIdx}`;
    return this
      .clickVisibleOnHover(hoverSelector, selector)
      .notPresent(selector);
  },

  setAutocompleteValue: function (selector, value) {
    const {ENTER, ARROW_DOWN} = this.api.Keys;
    const keys = [...value.split(''), ARROW_DOWN, ARROW_DOWN, ENTER];
    return this
      .setAutocomplete(selector, keys);
  },

  addPolicy: function (gatewaySelector, pipelineIdx, policyIdx, policyName) {
    const selectSelector = `${gatewaySelector} .select__pipelines${pipelineIdx}policies${policyIdx}name input`;
    return this
      .clickPresent(`${gatewaySelector} .button__add__pipelines${pipelineIdx}policy`)
      .setAutocompleteValue(selectSelector, policyName)
      .pause(1500);
  },

  addPolicyByDetails: function (pipelineIdx, policyIdx, policyName) {
    const selectSelector = `pipelines${pipelineIdx}policies${policyIdx}name`;
    return this
      .clickPresent(`.DetailsPanel .button__add__pipelines${pipelineIdx}policy`)
      .present(`.DetailsPanel .select__${selectSelector}`)
      .setPolicyByDetails(pipelineIdx, policyIdx, policyName);
  },

  setPolicyByDetails: function (pipelineIdx, policyIdx, policyName) {
    const selectSelector = `pipelines${pipelineIdx}policies${policyIdx}name`;
    return this
      .setAutocompleteValue(`.DetailsPanel .${selectSelector} input`, policyName)
      .pause(1500);
  },

  removePolicy: function (gatewaySelector, pipelineIdx, policyIdx) {
    const hoverSelector = `${gatewaySelector} .pipelines${pipelineIdx}policies${policyIdx}namepolicy`;
    const selector = `${gatewaySelector} .button__remove__pipelines${pipelineIdx}policy${policyIdx}`;
    return this
      .clickVisibleOnHover(hoverSelector, selector)
      .pause(1500);
  },

  removePolicyByDetails: function (pipelineIdx, policyIdx) {
    const hoverSelector = `.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}name`;
    const selector = `.DetailsPanel .button__remove__pipelines${pipelineIdx}policies${policyIdx}`;
    return this
      .clickVisibleOnHover(hoverSelector, selector)
      .pause(1500);
  },

  addActionParameterCustom: function (pipelineIdx, policyIdx, pairIdx, type) {
    return this
      .addActionObjectParameter(pipelineIdx, policyIdx, pairIdx, '', type);
  },

  addActionParameter: function (pipelineIdx, policyIdx, pairIdx, paramName) {
    const present = [`.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}`];
    return this
      .selectIconMenu('.DetailsPanel', `add__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}actionParameter`, paramName)
      .check({present});
  },

  setActionParameter: function (pipelineIdx, policyIdx, pairIdx, paramName, paramValue, type = 'text', prefix = '') {
    const selector = `pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}`;
    return this
      .setInput('.DetailsPanel', `input__${prefix}${selector}`, paramValue, type, `input__${selector}`);
  },

  clickActionParameterBoolean: function (pipelineIdx, policyIdx, pairIdx, paramName, expected = 'checked') {
    const selector = `.DetailsPanel .checkbox__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}`;
    const present = [`${selector}__${expected}`];
    return this
      .clickPresent(selector)
      .check({present});
  },

  setActionParameterType: function (pipelineIdx, policyIdx, pairIdx, paramName, paramType) {
    const self = this;
    const path = `pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action`;
    const selector = `tmp${path}type${paramName}`;
    this.api.getAttribute(`.DetailsPanel .${selector}`, 'class', function (result) {
      const select = result.value.replace('EntityProperty__field', '').replace(selector, '').trim();
      return self
        .selectValueSlow('.DetailsPanel', select, paramType);
    });
    return this
      .pause(1500);
  },

  setActionParameterArray: function (pipelineIdx, policyIdx, pairIdx, paramName, values) {
    const {ENTER} = this.api.Keys;
    const keys = [];
    values.forEach((item) => {
      item.split('').forEach(char => keys.push(char));
      keys.push(ENTER);
    });
    return this
      .setAutocomplete(`.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName} input`, keys)
      .checkAutocomplete(`pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}`, values.join(' '))
      .pause(1500);
  },

  addActionObjectParameter: function (pipelineIdx, policyIdx, pairIdx, paramName, type) {
    const present = [`.DetailsPanel .tmppipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}nametype${type}`];
    return this
      .selectIconMenu('.DetailsPanel', `add__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}Parameter`, type)
      .check({present})
      .pause(1000);
  },

  addActionObjectParameterProperty: function (pipelineIdx, policyIdx, pairIdx, paramName, type, prefix = '') {
    const present = [`.DetailsPanel .tmppipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}actionnametype${type}`];
    return this
      .selectIconMenu('.DetailsPanel', `add__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}Parameter`, type)
      .check({present});
  },

  setActionObjectParameterProperty: function (pipelineIdx, policyIdx, pairIdx, paramName, value, type, prefix) {
    const {TAB} = this.api.Keys;
    const selector = `tmppipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}nametype${type}`;
    return this
      .setInput(`.DetailsPanel  ${prefix} `, selector, value)
      .setAutocomplete(`.DetailsPanel .${selector} input`, [TAB]);
  },

  setActionParameterCustomName: function (pipelineIdx, policyIdx, pairIdx, paramName, type, value) {
    const {TAB} = this.api.Keys;
    const selector = `tmppipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action${paramName}nametype${type}`;
    return this
      .setInput('.DetailsPanel', selector, value)
      .setAutocomplete(`.DetailsPanel .${selector} input`, [TAB]);
  },

  setConditionName: function (pipelineIdx, policyIdx, pairIdx, text, listItemIdx = 0, expect, field = '', postfix = '') {
    const {ENTER, ARROW_DOWN, ARROW_UP} = this.api.Keys;
    const keys = [
      ...text.split(''),
      ARROW_DOWN, ARROW_DOWN, ARROW_UP,
      ...Array(listItemIdx).fill(0).map(_ => ARROW_DOWN),
      ENTER
    ];
    const selector = `.DetailsPanel .select__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${postfix}name input`;
    const present = [];
    if (field !== '') {
      present.push(`.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${field} input`);
    }
    return this
      .setAutocomplete(selector, keys)
      .check({value: {[selector]: expect}, present});
  },

  setConditionParameter: function (pipelineIdx, policyIdx, pairIdx, field, value, postfix = '') {
    return this
      .setInput('.DetailsPanel', `pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${postfix}${field}`, value);
  },

  setEnum: function (pipelineIdx, policyIdx, pairIdx, field, values, expect) {
    const {ENTER, ARROW_DOWN} = this.api.Keys;
    const selector = `.DetailsPanel .select__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${field} .Select-input input`;
    values.forEach(([text, entersAmount]) => {
      const keys = [
        ...text.split(''),
        ...Array(entersAmount).fill(0).map(_ => ARROW_DOWN),
        ENTER
      ]
      this.setAutocomplete(selector, keys);
    });
    return this
      .checkAutocomplete(`pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${field}`, expect);
  },

  deleteEnumByClick: function (pipelineIdx, policyIdx, pairIdx, field, idxs, expect) {
    idxs.forEach((idx) => {
      this.clickPresent(`.DetailsPanel .select__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${field} .Select-multi-value-wrapper .Select-value:nth-child(${idx}) .Select-value-icon`);
    });
    return this
      .checkAutocomplete(`pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${field}`, expect);
  },

  deleteEnumByKeyPress: function (pipelineIdx, policyIdx, pairIdx, field, deletesAmount, expect) {
    const {BACK_SPACE} = this.api.Keys;
    const keys = Array(deletesAmount).fill(0).map(_ => BACK_SPACE);
    return this
      .setAutocomplete(`.DetailsPanel .select__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${field} .Select-input input`, keys)
      .checkAutocomplete(`pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${field}`, expect);
  },

  moveCAPairUp: function (pipelineIdx, policyIdx, pairIdx) {
    return this
      .clickPresent(`.DetailsPanel .button__moveUp__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}`);
  },

  moveCAPairDown: function (pipelineIdx, policyIdx, pairIdx) {
    return this
      .clickPresent(`.DetailsPanel .button__moveDown__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}`);
  },

  removeCondition: function (pipelineIdx, policyIdx, pairIdx) {
    const hoverSelector = `.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}CAPair .CAPairLabel`;
    const selector = `.DetailsPanel .button__remove__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}`;
    return this
      .clickVisibleOnHover(hoverSelector, selector);
  },

  addSubCondition: function (pipelineIdx, policyIdx, pairIdx, prefix = '') {
    return this
      .clickPresent(`.DetailsPanel .button__add__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${prefix}Condition`);
  },

  removeSubCondition: function (pipelineIdx, policyIdx, pairIdx, conditionIdx, prefix = '') {
    const hoverSelector = `.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${prefix}conditions${conditionIdx}name`;
    const selector = `.DetailsPanel .button__remove__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${prefix}condition${conditionIdx}`;
    return this
      .clickVisibleOnHover(hoverSelector, selector);
  },

  addConditionCustomParameter: function (pipelineIdx, policyIdx, pairIdx, option, paramIdx, prefix = '') {
    const selector = `pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}`;
    const present = [`.DetailsPanel .tmppipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${paramIdx}name input`];
    return this
      .selectIconMenu('.DetailsPanel', `add__${selector}condition${prefix}CustomParameter`, option)
      .check({present});
  },

  setConditionCustomParameterName: function (pipelineIdx, policyIdx, pairIdx, paramIdx, name, prefix = '') {
    const {TAB} = this.api.Keys;
    const selector = `tmppipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}${prefix}condition${paramIdx}name`;
    return this
      .setInput('.DetailsPanel', selector, name)
      .setAutocomplete(`.DetailsPanel .${selector} input`, [TAB]);
  },

  setConditionCustomParameterValue: function (pipelineIdx, policyIdx, pairIdx, name, value, type, prefix = '') {
    return this
      .setInput('.DetailsPanel', `pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}${prefix}condition${name}`, value, type);
  },

  clickConditionCustomParameterBoolean: function (pipelineIdx, policyIdx, pairIdx, name, prefix = '') {
    return this
      .clickPresent(`.DetailsPanel .checkbox__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${prefix}${name}`);
  },

  setConditionCustomParameterEnum: function (pipelineIdx, policyIdx, pairIdx, name, values, prefix = '') {
    const {ENTER} = this.api.Keys;
    const keys = [];
    values.forEach((item) => {
      item.split('').forEach(char => keys.push(char));
      keys.push(ENTER);
    });
    return this
      .setAutocomplete(`.DetailsPanel .pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}${prefix}condition${name} input`, keys)
      .checkAutocomplete(`pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${name}`, values.join(' '));
  },

  removeConditionCustomParameter: function (pipelineIdx, policyIdx, pairIdx, paramIdx, prefix = '') {
    const hoverSelector = `.DetailsPanel .tmppipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${prefix}${paramIdx}name`;
    const selector = `.DetailsPanel .button__remove__tmppipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}condition${prefix}CustomParameter${paramIdx}`;
    return this
      .clickVisibleOnHover(hoverSelector, selector);
  },

  addModelPropertyOnCanvas: function (selector, propertyIdx) {
    const present = [`${selector} .input__properties${propertyIdx}name`]
    return this
      .clickPresent(`${selector} .button__add__Properties`)
      .check({present});
  },

  setModelPropertyOnCanvas: function (selector, propertyIdx, value) {
    return this
      .setInput(selector, `input__properties${propertyIdx}name`, value);
  },

  setModelPropertyTypeOnCanvas: function (selector, propertyIdx, type) {
    return this
      .selectValueSlow(selector, `properties${propertyIdx}type`, type);
  },

  checkModelProperties: function (selector, names = '', types = '') {
    const check = {
      text: {},
      notPresent: []
    };
    if (names === '') {
      check.notPresent.push(`${selector} .Model__properties .ModelPropertyCollapsed:nth-child(1)`)
    } else {
      names.split(',').forEach((name, idx) => {
        check.text[`${selector} .Model__properties .ModelPropertyCollapsed:nth-child(${idx + 1}) .ModelProperty__col.name .EntityProperty__field--text`] = name;
      });
      check.notPresent.push(`${selector} .Model__properties .ModelPropertyCollapsed:nth-child(${names.split(',').length + 1})`);
    }
    if (types !== '') {
      types.split(',').forEach((name, idx) => {
        check.text[`${selector} .Model__properties .ModelPropertyCollapsed:nth-child(${idx + 1}) .ModelProperty__col.type .EntityProperty__field--text`] = name;
      });
    }
    return this
      .check(check);
  },

  checkModelDetailsProperties: function (names = '', types = '', defaults = '', descriptions = '', requireds = '', indexes = '') {
    return this
      .checkDetailsFields(names, 'properties', 'name')
      .checkDetailsFields(types, 'properties', 'type', 'select')
      .checkDetailsFields(defaults, 'properties', 'default_')
      .checkDetailsFields(descriptions, 'properties', 'description')
      .checkDetailsFields(requireds, 'properties', 'required', 'checkbox')
      .checkDetailsFields(indexes, 'properties', 'index', 'checkbox');
  },

  checkModelDetailsRelations: function (names = '', types = '', models = '', foreignKeys = '') {
    return this
      .checkDetailsFields(names, 'relations', 'name')
      .checkDetailsFields(types, 'relations', 'type', 'select')
      .checkDetailsFields(models, 'relations', 'model', 'select')
      .checkDetailsFields(foreignKeys, 'relations', 'foreignKey')
  },

  checkModelDetailsUDF: function (names = '', types = '', values = '') {
    const check = {
      value: {},
      valueContain: {}
    };
    if (values !== '') {
      values.split(',').forEach((name, idx) => {
        if (types.split(',')[idx] === 'Object') {
          // check.value[`.DetailsPanel .input__userFields${idx}value > div > div > textarea:nth-child(2)`] = '{"abc": 234}';
        } else {
          check.value[`.DetailsPanel .input__userFields${idx}value input`] = name;
        }
      })
    }
    return this
      .checkDetailsFields(names, 'userFields', 'name')
      .checkDetailsFields(types, 'userFields', 'type', 'select')
      .check(check);
  },

  expectWorkspaceStatus: function (status) {
    return this
      .present(`.workspace-status .workspace-status__${status}`, 300000);
  },

  expectWorkspaceFailure: function (error) {
    const textContain = {
      '.SystemDefcon1 .SystemDefcon1__box__content__details--box': error
    };
    return this
      .expectWorkspaceStatus('failure')
      .clickPresent('.workspace-status > span')
      .present('.SystemDefcon1 .SystemDefcon1__box__content__details--box', 5000)
      .check({textContain});
  },

  checkFunctionTriggers: function (selector, triggers) {
    const check = {
      text: {},
      notPresent: []
    }
    Object.keys(triggers).forEach((key, idx) => {
      check.text[`${selector} .Function__triggers > div:nth-child(${idx + 1}) > span:first-child`] = key;
      check.text[`${selector} .Function__triggers > div:nth-child(${idx + 1}) > span:last-child`] = triggers[key];
    });
    check.notPresent.push(`${selector} .Function__triggers > div:nth-child(${Object.keys(triggers).length + 1})`);
    return this
      .check(check);
  },

  addGatewayWithProxy: function (selector, gatewayName = this.getUniqueName('gateway')) {
    return this
      .addElement('gateway')
      .setCanvasEntityName(selector, gatewayName)
      .addPolicy(selector, 0, 0, 'proxy')
      .submitGatewayDeploy(selector, gatewayName);
  },

  removeGateway: function (selector, check = {}) {
    return this
      .removeEntity(selector, 300000, check)
      .waitForGatewaysRemoved();
  },

  removeFunction: function (selector, check = {}) {
    return this
      .removeEntity(selector, 300000, check)
      .waitForFunctionRemoved();
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
