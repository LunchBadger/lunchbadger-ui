var page;
var elementSelector = '.quadrant:nth-child(2) .Entity.PrivateEndpoint:last-child';

module.exports = {
  'Private Endpoint: add': function (browser) {
    page = browser.page.lunchBadger();

    page.open();

    page.expect.element('.aside--editing').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    page.addElementFromTooltip('.endpoint.tool', 1);

    browser.pause(1000);

    page.expect.element('.aside--editing').to.be.present;
    page.expect.element('.canvas__container--editing').to.be.present;
    page.expect.element(elementSelector + '.editable').to.be.present;

    page.expect.element(elementSelector + ' .EntityHeader .EntityProperty__field--input').to.have.value.that.equals('PrivateEndpoint');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityPropertyLabel').text.to.equal('URL');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--input').to.have.value.that.equals('https://private/endpoint');
  },

  after: function () {
    page.close();
  }
};
