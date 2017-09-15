const fs = require('fs');
let notifiedCoverage = false;

var pageCommands = {
  open: function () {
    var page = this.api.page.lunchBadger().navigate();
    this.api.resizeWindow(1920, 1080);
    this.waitForElementVisible('.app', 5000);
    return page;
  },

  close: function () {
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

  addElementFromTooltip: function (entity, option) {
    option = option || 'rest';
    this.click('.Tool.' + entity);
    this.api.pause(1500);
    this.waitForElementPresent('.Tool__submenuItem.' + option, 5000);
    this.click('.Tool__submenuItem.' + option);
  },

  addElement: function (entity) {
    this.click('.Tool.' + entity);
  },

  dragDropElement: function (dragTarget, dropTarget) {
    this.api.drag(dragTarget, dropTarget);
    return this;
  },

  setValueSlow: function (selector, value) {
    this.waitForElementPresent(selector, 50000);
    this.getValue(selector, function (result) {
      for (let c in result.value) {
        this.setValue(selector, this.Keys.BACK_SPACE);
      }
    });
    this.setValue(selector, value);
  },

  selectValueSlow: function (selector, select, value) {
    this.waitForElementPresent(selector, 500-0);
    this.click(selector + ` .select__${select}`);
    this.waitForElementPresent(`div[role=menu] .${select}__${value}`, 10000);
    this.api.pause(2000);
    this.moveToElement(`div[role=menu] .${select}__${value}`, 5, 5, function() {
      this.click(`div[role=menu] .${select}__${value}`);
    });
    this.api.pause(1000);
  },

  editEntity: function (selector) {
    this.click(selector);
    this.waitForElementPresent(selector + '.highlighted .Toolbox__button--edit', 50000);
    this.click(selector + '.highlighted .Toolbox__button--edit');
    this.waitForElementPresent(selector + '.editable', 50000);
    this.waitForElementVisible(selector + ' .input__name input', 50000);
    // this.api.pause(3000);
  },

  discardCanvasEntityChanges: function (selector) {
    this.moveToElement(selector + ' .cancel', 5, 5, function() {
      this.click(selector + ' .cancel');
    });
    this.waitForElementNotPresent(selector + '.editable', 5000);
  },

  submitCanvasEntity: function (selector) {
    this.submitForm(selector + ' form');
    // this.moveToElement(selector + ' .submit', 5, 5, function() {
    //   this.click(selector + ' .submit');
    // });
    this.api.pause(500);
    // this.waitForElementPresent(selector + '.wip', 5000);
    this.waitForElementNotPresent(selector + '.wip', 60000);
    this.waitForElementNotPresent('.Aside.disabled', 5000);
    this.waitForElementNotPresent('.SystemDefcon1', 60000);
  },

  submitDetailsPanel: function (selector) {
    this.waitForElementPresent('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button', 5000);
    this.moveToElement('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button', 5, 5, function() {
      this.click('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button');
    });
    this.api.pause(500);
    // this.waitForElementPresent(selector + '.wip', 5000);
    this.waitForElementNotPresent(selector + '.wip', 60000);
    this.waitForElementNotPresent('.DetailsPanel .confirm-button__accept--enabled .confirm-button__button', 5000);
  },

  openEntityInDetailsPanel: function (selector) {
    this.waitForElementPresent(selector, 5000);
    this.click(selector);
    this.waitForElementPresent(selector + '.highlighted', 5000);
    this.click('@details');
    this.api.pause(2000);
  },

  closeDetailsPanel: function () {
    this.click('@details');
    this.api.pause(2000);
  },

  removeEntity: function (selector) {
    this.click(selector);
    this.waitForElementPresent(selector + ' > .Toolbox .Toolbox__button--delete', 5000);
    this.click(selector + ' > .Toolbox .Toolbox__button--delete');
    this.waitForElementPresent('.SystemDefcon1 .confirm', 5000);
    this.click('.SystemDefcon1 .confirm');
    this.waitForElementNotPresent(selector, 5000);
    this.api.pause(3000);
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

  discardDetailsPanelChanges: function () {
    this.waitForElementPresent('.header .canvas-overlay', 5000);
    this.click('.header .canvas-overlay');
    this.waitForElementPresent('.SystemDefcon1 .discard', 5000);
    this.click('.SystemDefcon1 .discard');
    this.waitForElementNotPresent('.confirm-button__accept.confirm-button__accept--enabled', 5000);
    this.api.pause(3000);
  },

  confirmDetailsPanelChanges: function (selector) {
    this.waitForElementPresent('.header .canvas-overlay', 5000);
    this.click('.header .canvas-overlay');
    this.waitForElementPresent('.SystemDefcon1 .confirm', 5000);
    this.click('.SystemDefcon1 .confirm');
    this.api.pause(500);
    // this.waitForElementPresent(selector + '.wip', 5000);
    this.waitForElementNotPresent(selector + '.wip', 60000);
    this.waitForElementNotPresent('.confirm-button__accept.confirm-button__accept--enabled', 5000);
  },

  checkEntities: function (dataSources = '', models = '', contextPaths) {
    contextPaths = contextPaths || models.toLowerCase();
    this.expect.element('.Aside.disabled').to.not.be.present;
    this.expect.element('.canvas__container--editing').to.not.be.present;
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
    return '.canvas__container .quadrant:first-child .quadrant__body .Entity.DataSource:nth-child(' + nth + ')';
  },

  getDataSourceFieldSelector: function (nthEntity, nthProperty) {
    return this.getDataSourceSelector(nthEntity) + ' .EntityProperties .EntityProperty:nth-child(' + nthProperty + ') .EntityProperty__field--input input';
  },

  getModelSelector: function (nth) {
    return '.canvas__container .quadrant:nth-child(2) .quadrant__body .Entity.Model:nth-child(' + nth + ')';
  },

  testDatasource: function (type, config = []) {
    this.addElementFromTooltip('dataSource', type);
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
    this.removeEntity(this.getDataSourceSelector(1));
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
    details: {
      selector: '.header__menu__element .header__menu__link.DETAILS_PANEL'
    },
    detailsPanel: {
      selector: '.panel__container.DetailsPanel'
    }
  }
};
