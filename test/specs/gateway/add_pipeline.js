module.exports = {
  // '@disabled': true,
  'Gateway: add pipeline': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:nth-child(3) .canvas-element.Gateway:last-child';

    page.open();

    page.addElement('.gateway.tool');

    browser.pause(3500);

    page.expect.element(elementSelector + ' .canvas-element__sub-element').to.be.present;

    page.click(elementSelector + ' .canvas-element__sub-elements .canvas-element__add');

    browser.pause(50);

    page.expect.element(elementSelector + ' .canvas-element__sub-element:nth-child(2)').to.be.present;

    page.click(elementSelector + ' .canvas-element__sub-elements .canvas-element__add');

    browser.pause(50);

    page.expect.element(elementSelector + ' .canvas-element__sub-element:nth-child(3)').to.be.present;

    browser.pause(50);

    page.click(elementSelector + ' .canvas-element__sub-element:first-child .pipeline__toggle');

    browser.pause(1500);

    page.expect.element(elementSelector + ' .canvas-element__sub-element:first-child .pipeline.pipeline--opened').to.be.present;

    page.expect.element(elementSelector + ' .canvas-element__sub-element:first-child .pipeline__details .pipeline__details__title').text.to.equal('POLICIES');
    page.assert.elementsCount(elementSelector + ' .canvas-element__sub-element:first-child .pipeline__details .policy', 3)

    page.close();
  }
};
