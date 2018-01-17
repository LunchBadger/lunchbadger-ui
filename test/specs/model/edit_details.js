var page;

module.exports = {
  // '@disabled': true,
  'Model: edit zoom details': function (browser) {
    page = browser.page.lunchBadger();
    page.open();
    page.addElement('model');
    page.setValueSlow(page.getModelSelector(1) + ' .input__name input', 'Test');
    page.submitCanvasEntity(page.getModelSelector(1));
    page.expect.element(page.getModelSelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Test');
    page.openEntityInDetailsPanel(page.getModelSelector(1));
    page.setValueSlow('.DetailsPanel .input__httppath input', 'changed');
    page.submitDetailsPanel(page.getModelSelector(1));
    page.expect.element(page.getModelSelector(1) + ' .httppath .EntityProperty__field--text').text.to.equal('changed');
    page.close();
  }
}
