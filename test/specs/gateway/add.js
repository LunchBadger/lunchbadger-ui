module.exports = {
  // '@disabled': true,
  'Gateway: add': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';

    page.open();

    page.expect.element('.aside--editing').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;

    page.addElement('.gateway.tool');

    browser.pause(500);

    page.expect.element(elementSelector + '.wip').to.be.present;

    browser.pause(3000);

    page.expect.element(elementSelector + '.wip').to.be.not.present;
    page.expect.element('.aside--editing').to.be.present;
    page.expect.element('.canvas__container--editing').to.be.present;
    page.expect.element(elementSelector + '.editable').to.be.present;

    page.expect.element(elementSelector + ' .EntityHeader .EntityProperty__field--input').to.have.value.that.equals('Gateway');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityPropertyLabel').text.to.equal('ROOT URL');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').to.have.text.that.equals('http://gateway.customer.lunchbadger.com');

    browser.pause(500);

    page.close();
  }
};
