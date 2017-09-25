module.exports = {
  // '@disabled': true,
  'Gateway: pipelines': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.addElement('gateway');
    page.submitCanvasEntity(page.getGatewaySelector(1));
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0name .EntityProperty__field--text').text.to.equal('Pipeline');
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies0name .EntityProperty__field--text').text.to.equal('oauth2');
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
    page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
    page.saveProject();

    // Reload page and check, if gateway data are consisten
    browser.refresh(function () {
      page.checkEntities();
      browser.waitForElementPresent(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text', 5000);
      page.expect.element(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Gateway');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines0name .EntityProperty__field--text').text.to.equal('Pipeline');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies0name .EntityProperty__field--text').text.to.equal('oauth2');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
      page.editEntity(page.getGatewaySelector(1));
      browser.pause(2000);
      browser.waitForElementVisible(page.getGatewaySelector(1) + ' .button__add__Pipelines', 5000);
      page.click(page.getGatewaySelector(1) + ' .button__add__Pipelines');
      page.click(page.getGatewaySelector(1) + ' .button__add__Pipelines');
      browser.waitForElementVisible(page.getGatewaySelector(1) + ' .input__pipelines1name input', 5000);
      page.setValueSlow(page.getGatewaySelector(1) + ' .input__pipelines1name input', 'Pipeline2');
      page.setValueSlow(page.getGatewaySelector(1) + ' .input__pipelines2name input', 'Pipeline3');
      page.submitCanvasEntity(page.getGatewaySelector(1));
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines0name .EntityProperty__field--text').text.to.equal('Pipeline');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies0name .EntityProperty__field--text').text.to.equal('oauth2');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines1name .EntityProperty__field--text').text.to.equal('Pipeline2');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines1policies0name .EntityProperty__field--text').text.to.equal('oauth2');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines1policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines1policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines2name .EntityProperty__field--text').text.to.equal('Pipeline3');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines2policies0name .EntityProperty__field--text').text.to.equal('oauth2');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines2policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
      page.expect.element(page.getGatewaySelector(1) + ' .pipelines2policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
      page.saveProject();

      // Reload page and check, if gateway data are consisten
      browser.refresh(function () {
        page.checkEntities();
        browser.waitForElementPresent(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text', 5000);
        page.expect.element(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Gateway');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0name .EntityProperty__field--text').text.to.equal('Pipeline');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies0name .EntityProperty__field--text').text.to.equal('oauth2');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines1name .EntityProperty__field--text').text.to.equal('Pipeline2');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines1policies0name .EntityProperty__field--text').text.to.equal('oauth2');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines1policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines1policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines2name .EntityProperty__field--text').text.to.equal('Pipeline3');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines2policies0name .EntityProperty__field--text').text.to.equal('oauth2');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines2policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines2policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
        page.click(page.getGatewaySelector(1) + ' .Gateway__pipeline0 .CollapsibleProperties__bar__left--arrow');
        browser.pause(2000);
        page.click(page.getGatewaySelector(1) + ' .Gateway__pipeline1 .CollapsibleProperties__bar__left--arrow');
        browser.pause(2000);
        page.click(page.getGatewaySelector(1) + ' .Gateway__pipeline2 .CollapsibleProperties__bar__left--arrow');
        browser.pause(2000);
        page.editEntity(page.getGatewaySelector(1));
        browser.pause(2000);
        page.click(page.getGatewaySelector(1) + ' .Gateway__pipeline2 .CollapsibleProperties__bar__left--arrow');
        browser.pause(2000);
        page.click(page.getGatewaySelector(1) + ' .Gateway__pipeline1 .CollapsibleProperties__bar__left--arrow');
        browser.pause(2000);
        page.click(page.getGatewaySelector(1) + ' .Gateway__pipeline0 .CollapsibleProperties__bar__left--arrow');
        browser.pause(2000);
        browser.waitForElementVisible(page.getGatewaySelector(1) + ' .button__remove__pipelines2', 5000);
        page.click(page.getGatewaySelector(1) + ' .button__remove__pipelines2');
        page.click(page.getGatewaySelector(1) + ' .button__remove__pipelines1policies2name');
        page.click(page.getGatewaySelector(1) + ' .button__remove__pipelines1policies1name');
        page.click(page.getGatewaySelector(1) + ' .button__add__pipelines0policy');
        page.selectValueSlow(page.getGatewaySelector(1), 'pipelines0policies3name', 'proxy');
        page.submitCanvasEntity(page.getGatewaySelector(1));
        page.expect.element(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Gateway');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0name .EntityProperty__field--text').text.to.equal('Pipeline');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies0name .EntityProperty__field--text').text.to.equal('oauth2');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies3name .EntityProperty__field--text').text.to.equal('proxy');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines1name .EntityProperty__field--text').text.to.equal('Pipeline2');
        page.expect.element(page.getGatewaySelector(1) + ' .pipelines1policies0name .EntityProperty__field--text').text.to.equal('oauth2');
        browser.waitForElementNotPresent(page.getGatewaySelector(1) + ' .pipelines1policies1name', 5000);
        browser.waitForElementNotPresent(page.getGatewaySelector(1) + ' .pipelines2name', 5000);
        page.saveProject();

        // Reload page and check, if gateway data are consisten
        browser.refresh(function () {
          page.checkEntities();
          browser.waitForElementPresent(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text', 5000);
          page.expect.element(page.getGatewaySelector(1) + ' .EntityHeader .EntityProperty__field--text').text.to.equal('Gateway');
          page.expect.element(page.getGatewaySelector(1) + ' .pipelines0name .EntityProperty__field--text').text.to.equal('Pipeline');
          page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies0name .EntityProperty__field--text').text.to.equal('oauth2');
          page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies1name .EntityProperty__field--text').text.to.equal('rate-limiter');
          page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies2name .EntityProperty__field--text').text.to.equal('simple-logger');
          page.expect.element(page.getGatewaySelector(1) + ' .pipelines0policies3name .EntityProperty__field--text').text.to.equal('proxy');
          page.expect.element(page.getGatewaySelector(1) + ' .pipelines1name .EntityProperty__field--text').text.to.equal('Pipeline2');
          page.expect.element(page.getGatewaySelector(1) + ' .pipelines1policies0name .EntityProperty__field--text').text.to.equal('oauth2');
          browser.waitForElementNotPresent(page.getGatewaySelector(1) + ' .pipelines1policies1name', 5000);
          browser.waitForElementNotPresent(page.getGatewaySelector(1) + ' .pipelines2name', 5000);
        });
      });
    });
    page.close();
  }
};
