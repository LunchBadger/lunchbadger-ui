var page;
var elementSelector = '.quadrant:nth-child(4) .Entity.PublicEndpoint:last-child';

module.exports = {
  // '@disabled': true,
  'Public Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();

    page.open();

    page.expect.element('.aside--editing').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    page.addElementFromTooltip('.endpoint.tool', 2);

    browser.pause(1000);

    page.expect.element('.aside--editing').to.be.present;
    page.expect.element('.canvas__container--editing').to.be.present;
    page.expect.element(elementSelector + '.editable').to.be.present;

    page.expect.element(elementSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('PublicEndpoint');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityPropertyLabel').text.to.equal('PATH');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input').to.have.value.that.equals('/endpoint');

    browser.pause(1000);
  },

  after: function () {
    page.close();
  }
};
