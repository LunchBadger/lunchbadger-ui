module.exports = {
  '@disabled': true, // FIXME: enable when EG will start to work fine
  'Gateway: add': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.checkEntities();
    page.addElement('gateway');
    page.setValueSlow(page.getGatewaySelector(1) + ' .input__name input', 'TestGateway');
    page.submitCanvasEntity(page.getGatewaySelector(1));
    page.expect.element(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('TestGateway');
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0name').text.to.equal('Pipeline');
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies0name').text.to.equal('oauth2');
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies1name').text.to.equal('rate-limiter');
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies2name').text.to.equal('simple-logger');
    page.close();
  }
};
