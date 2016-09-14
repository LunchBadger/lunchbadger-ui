module.exports = {
  // '@disabled': true,
  'Gateway: add': function (browser) {
    var page = browser.page.lunchBadger();
    var elementSelector = '.quadrant:nth-child(3) .canvas-element.Gateway:last-child';

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

    page.expect.element(elementSelector + ' .canvas-element__title .canvas-element__input').to.have.value.that.equals('Gateway');
    page.expect.element(elementSelector + ' .canvas-element__properties__property .canvas-element__properties__property-title').text.to.equal('ROOT PATH');
    page.expect.element(elementSelector + ' .canvas-element__properties__property .canvas-element__input').to.have.value.that.equals('https://gateway.root');

    browser.pause(500);
    
    page.close();
  }
};
