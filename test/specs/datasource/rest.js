module.exports = {
  // '@disabled': true,
  'Datasource: rest': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.addElementFromTooltip('dataSource', 'rest');
    page.expect.element(page.getDataSourceSelector(1) + ' .Rest__predefined .EntityPropertyLabel').text.to.equal('PREDEFINED PROPERTIES');
    page.expect.element(page.getDataSourceSelector(1) + ' .Rest__method .EntityPropertyLabel').text.to.equal('METHOD');
    page.expect.element(page.getDataSourceSelector(1) + ' .Rest__url .EntityPropertyLabel').text.to.equal('URL');
    page.selectValueSlow('.Rest__predefined', 'predefined', 'Google-Maps-Location');
    page.submitCanvasEntity(page.getDataSourceSelector(1));
    page.expect.element(page.getDataSourceSelector(1) + ' .Rest__predefined .EntityProperty__field--textValue').text.to.equal('Google Maps - Location');
    page.expect.element(page.getDataSourceSelector(1) + ' .Rest__method .EntityProperty__field--textValue').text.to.equal('GET');
    page.expect.element(page.getDataSourceSelector(1) + ' .Rest__url .EntityProperty__field--textValue').text.to.equal('https://maps.googleapis.com/maps/api/geocode/json');
    page.removeEntity(page.getDataSourceSelector(1));
    page.close();
  }
};
