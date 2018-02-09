var page;
var restSelector;
const datasourceName = 'Google-Maps-GeoCode';

module.exports = {
  // '@disabled': true,
  'Rest: Google Maps GeoCode': function (browser) {
    page = browser.page.lunchBadger();
    restSelector = page.getDataSourceSelector(1);
    page
      .open()
      .addElementFromTooltip('dataSource', 'rest')
      // .expect.element(restSelector + ' .Rest__predefined .EntityPropertyLabel').text.to.equal('PREDEFINED PROPERTIES')
      // .expect.element(restSelector + ' .Rest__method .EntityPropertyLabel').text.to.equal('METHOD')
      // .expect.element(restSelector + ' .Rest__url .EntityPropertyLabel').text.to.equal('URL')
      // .setValueSlow(restSelector + ' .input__name input', datasourceName)
      .selectValueSlow('.Rest__predefined', 'predefined', datasourceName)
      .submitCanvasEntity(restSelector)
      .waitForDependencyFinish()
      // .expect.element(restSelector + ' .Rest__predefined .EntityProperty__field--textValue').text.to.equal('Google Maps - Location')
      // .expect.element(restSelector + ' .Rest__method .EntityProperty__field--textValue').text.to.equal('GET')
      // .expect.element(restSelector + ' .Rest__url .EntityProperty__field--textValue').text.to.equal('https://maps.googleapis.com/maps/api/geocode/json')
      .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint)
      .closeDetailsPanel()
      .removeEntity(restSelector)
      .waitForDependencyFinish()
      .close();
  }
};

// const checkpoint = {
//   text: {
//     operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
//     operations0templateresponsePath: '$.results[0].geometry.location',
//     operations0templateheaders0key: 'accepts',
//     operations0templateheaders0value: 'application/json',
//     operations0templateheaders1key: 'content-type',
//     operations0templateheaders1value: 'application/json',
//     operations0templatequery0key: 'key',
//     operations0templatequery0value: '',
//     operations0templatequery1key: 'address',
//     operations0templatequery1value: '{street},{city},{zipcode}',
//     operations0templatequery2key: 'sensor',
//     operations0templatequery2value: '{sensor=false}',
//     operations0functions0key: 'geocode',
//     operations0functions0value: 'street,city,zipcode'
//   },
//   checkbox: {
//     optionsenabled: false,
//     operations0templateoptionsenabled: false
//   },
//   select: {
//     predefined: 'Google-Maps-GeoCode',
//     operations0templatemethod: 'GET'
//   },
//   notPresent: [
//     '.button__remove__operation0',
//     '.checkbox__optionsstrictSSL',
//     '.checkbox__optionsuseQuerystring',
//     '.checkbox__optionsheadersenabled',
//     '.input__optionsheadersparams0key',
//     '.checkbox__operations0templateoptionsstrictSSL',
//     '.checkbox__operations0templateoptionsuseQuerystring',
//     '.input__operations0templateheaders2key',
//     '.input__operations0templatequery3key',
//     '.input__operations0functions1key',
//     '.input__operations1templateurl'
//   ]
// };
