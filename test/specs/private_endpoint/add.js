var page;
var elementSelector = '.quadrant:nth-child(2) .canvas-element.PrivateEndpoint:last-child';

module.exports = {
  'Private Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();

    page.open();

    page.expect.element('.aside--editing').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    page.addElementFromTooltip('.endpoint.tool', 1);

    browser.pause(500);

    page.expect.element('.aside--editing').to.be.present;
    page.expect.element('.canvas__container--editing').to.be.present;
    page.expect.element(elementSelector + '.editable').to.be.present;

    page.expect.element(elementSelector + ' .canvas-element__title .canvas-element__input').to.have.value.that.equals('PrivateEndpoint');
    page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__properties__property-title').text.to.equal('URL');
    page.expect.element(elementSelector + ' .canvas-element__properties__property:first-child .canvas-element__input').to.have.value.that.equals('https://private/endpoint');
  },

  after: function () {
    page.close();
  }
};
