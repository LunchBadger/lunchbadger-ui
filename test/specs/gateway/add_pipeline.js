module.exports = {
  // '@disabled': true,
  'Gateway: add pipeline': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';
    page.open();
    page.addElement('gateway');
    browser.waitForElementVisible(elementSelector + ' .EntitySubElements__main', 60000);
    page.click(elementSelector + ' .EntitySubElements__main .EntitySubElements__title__add');
    browser.waitForElementVisible(elementSelector + ' .EntitySubElements__elements .Pipeline:nth-child(2)', 60000);
    page.click(elementSelector + ' .EntitySubElements__main .EntitySubElements__title__add');
    browser.waitForElementVisible(elementSelector + ' .EntitySubElements__elements .Pipeline:nth-child(3)', 60000);
    page.click(elementSelector + ' .EntitySubElements__elements .Pipeline:first-child .CollapsibleProperties__bar__left');
    browser.waitForElementVisible(elementSelector + ' .EntitySubElements__elements .Pipeline:first-child .CollapsibleProperties__collapsible', 60000);
    page.expect.element(elementSelector + ' .EntitySubElements__elements .Pipeline:first-child .CollapsibleProperties__collapsible .EntityPropertyLabel').text.to.equal('POLICIES');
    page.assert.elementsCount(elementSelector + ' .EntitySubElements__elements .Pipeline:first-child .CollapsibleProperties__collapsible .EntityProperty', 3)
    page.close();
  }
};
