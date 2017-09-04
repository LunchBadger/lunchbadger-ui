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
    this.api.pause(500);
    this.click('.Tool__submenuItem.' + option);
  },

  addElement: function (entity) {
    this.click('.Tool.' + entity);
  },

  dragDropElement: function (dragTarget, dropTarget) {
    this.api.drag(dragTarget, dropTarget);

    return this;
  },

  setValueSlow: function (selector, value, using) {
    var self = this.api;
    self.elements(using || 'css selector', selector, function (elems) {
      elems.value.forEach(function (element) {
        for (var c of value.split('')) {
          self.elementIdValue(element.ELEMENT, c);
        }
      });
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
    details: {
      selector: '.header__menu__element .header__menu__link.DETAILS_PANEL'
    },
    detailsPanel: {
      selector: '.panel__container.DetailsPanel'
    }
  }
};
