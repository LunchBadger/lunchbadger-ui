var page;
var elementSelector = '.quadrant:nth-child(4) .canvas-element.PublicEndpoint:last-child';

module.exports = {
  // '@disabled': true,
  'Public Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();

    page.open();

    page.expect.element('.aside--editing').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    page.addElementFromTooltip('.endpoint.tool', 2);

    browser.pause(500);

    page.expect.element('.aside--editing').to.be.present;
    page.expect.element('.canvas__container--editing').to.be.present;
    page.expect.element(elementSelector + '.editable').to.be.present;

    page.expect.element(elementSelector + ' .canvas-element__title .canvas-element__input').to.have.value.that.equals('Public Endpoint');
    page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__properties__property-title').text.to.equal('URL');
    page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input').to.have.value.that.equals('https://root/endpoint');

    browser.pause(500);
  },

  after: function () {
    page.close();
  }
};
