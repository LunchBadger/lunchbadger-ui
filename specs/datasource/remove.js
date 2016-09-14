module.exports = {
  // '@disabled': true,
  'Datasource: remove': function (browser) {
    var page = browser.page.lunchBadger();

    page.open();

    page.addElementFromTooltip('.dataSource.tool');

    browser.expect.element('.canvas-element.editable.expanded.DataSource').to.be.present;

    page.click('.canvas-element.editable.expanded.DataSource .canvas-element__remove__action');

    browser.pause(500);

    page.click('.modal__actions__button.modal__actions__button--confirm');

    browser.pause(500);

    browser.expect.element('.canvas-element.editable.expanded.DataSource').to.not.be.present;

    page.close();
  }
};
