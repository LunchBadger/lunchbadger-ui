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
    page.expect.element(elementSelector + ' .canvas-element__sub-element:first-child .pipeline__details .policy:nth-of-type(2) .policy__name').text.to.equal('AUTH 01');
    page.expect.element(elementSelector + ' .canvas-element__sub-element:first-child .pipeline__details .policy:nth-of-type(3) .policy__name').text.to.equal('RATE LIMITER');
    page.expect.element(elementSelector + ' .canvas-element__sub-element:first-child .pipeline__details .policy:nth-of-type(4) .policy__name').text.to.equal('REVERSE PROXY');

    page.close();
  }
};
