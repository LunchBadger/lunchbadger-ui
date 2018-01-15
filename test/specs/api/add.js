module.exports = {
  '@disabled': true,
  'API: add': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:nth-child(4) .Entity.API:last-child';

    page.open();

    page.expect.element('.Aside.disabled').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    page.addElement('api');

    browser.pause(1000);

    page.expect.element('.Aside.disabled').to.be.present;
    page.expect.element('.canvas__container--editing').to.be.present;
    page.expect.element(elementSelector + '.editable').to.be.present;

    page.expect.element(elementSelector + ' .EntityHeader__name .EntityProperty__field--input input').to.have.value.that.equals('API');
    page.expect.element(elementSelector + ' .EntitySubElements:first-child .EntityPropertyLabel').text.to.equal('PLANS');
    page.expect.element(elementSelector + ' .EntitySubElements:nth-child(2) .EntityPropertyLabel').text.to.equal('ENDPOINTS');
    page.expect.element(elementSelector + ' .EntitySubElements:nth-child(2) .public-endpoint').to.not.be.present;

    browser.pause(500);

    page.close();
  }
};
