module.exports = {
  // '@disabled': true,
  'Gateway: add': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';
    page.open();
    page.expect.element('.Aside.disabled').to.not.be.present;
    page.expect.element('.canvas__container--editing').to.not.be.present;
    page.addElement('gateway');
    browser.waitForElementPresent('.Aside.disabled', 30000);
    browser.waitForElementPresent('.canvas__container--editing', 30000);
    browser.waitForElementPresent(elementSelector + '.editable', 30000);
    page.expect.element(elementSelector + ' .EntityHeader .EntityProperty__field--input input').to.have.value.that.equals('Gateway');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityPropertyLabel').text.to.equal('ROOT URL');
    page.expect.element(elementSelector + ' .EntityProperties .EntityProperty:first-child .EntityProperty__field--text').to.have.text.that.equals('http://gateway.customer.lunchbadger.com');
    browser.click(elementSelector + '.editable button[type=submit]');
    browser.waitForElementPresent(elementSelector + '.wip', 30000);
    browser.waitForElementNotPresent(elementSelector + '.wip', 30000);
    page.close();
  }
};
