module.exports = {
  // '@disabled': true,
  'Gateway: add pipeline': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:nth-child(3) .Entity.Gateway:last-child';

    page.open();

    page.addElement('.gateway.tool');

    browser.pause(3500);

    page.expect.element(elementSelector + ' .EntitySubElements__main').to.be.present;

    page.click(elementSelector + ' .EntitySubElements__main .EntitySubElements__title__add');

    browser.pause(500);

    page.expect.element(elementSelector + ' .EntitySubElements__elements .CollapsibleProperties:nth-child(2)').to.be.present;

    page.click(elementSelector + ' .EntitySubElements__main .EntitySubElements__title__add');

    browser.pause(500);

    page.expect.element(elementSelector + ' .EntitySubElements__elements .CollapsibleProperties:nth-child(3)').to.be.present;

    browser.pause(500);

    page.click(elementSelector + ' .EntitySubElements__elements .CollapsibleProperties:first-child .CollapsibleProperties__bar__left');

    browser.pause(1500);

    page.expect.element(elementSelector + ' .EntitySubElements__elements .CollapsibleProperties:first-child .CollapsibleProperties__collapsible').to.be.present;

    page.expect.element(elementSelector + ' .EntitySubElements__elements .CollapsibleProperties:first-child .CollapsibleProperties__collapsible .EntityPropertyLabel').text.to.equal('POLICIES');
    page.assert.elementsCount(elementSelector + ' .EntitySubElements__elements .CollapsibleProperties:first-child .CollapsibleProperties__collapsible .EntityProperty', 3)

    page.close();
  }
};
