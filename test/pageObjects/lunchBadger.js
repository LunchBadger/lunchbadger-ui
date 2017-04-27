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

  addElementFromTooltip: function (element, option) {
    option = option || 1;

    this.moveToElement(element, 5, 5, function () {
      this.waitForElementVisible(element + ' .tool__context li:nth-child(' + option + ') .tool__context__item', 1000);
      this.click(element + ' .tool__context li:nth-child(' + option + ') .tool__context__item');
    });
  },

  addElement: function (element) {
    this.click(element);
  },

  dragDropElement: function (dragTarget, dropTarget) {
    this.api.drag(dragTarget, dropTarget);

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
      selector: '.header__menu__element .icon-icon-forecaster'
    },
    forecasterPanel: {
      selector: '.panel:nth-child(3) .panel__container'
    },
    details: {
      selector: '.header__menu__element .header__menu__link.details'
    },
    detailsPanel: {
      selector: '.panel:first-child .panel__container'
    }
  }
};
