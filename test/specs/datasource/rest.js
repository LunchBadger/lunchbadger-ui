const customEndpoint1 = 'https://jsonplaceholder.typicode.com/users';
const customEndpoint2 = 'https://jsonplaceholder.typicode.com/posts';

module.exports = {
  // '@disabled': true,
  'Datasource: rest': function (browser) {
    const page = browser.page.lunchBadger();
    const restSelector = page.getDataSourceSelector(1);
    page
      .open()
      .addElementFromTooltip('dataSource', 'rest')
      // .expect.element(restSelector + ' .Rest__predefined .EntityPropertyLabel').text.to.equal('PREDEFINED PROPERTIES')
      // .expect.element(restSelector + ' .Rest__method .EntityPropertyLabel').text.to.equal('METHOD')
      // .expect.element(restSelector + ' .Rest__url .EntityPropertyLabel').text.to.equal('URL')
      .selectValueSlow('.Rest__predefined', 'predefined', 'Google-Maps-Location')
      .submitCanvasEntity(restSelector)
      // .waitForDependencyFinish()
      // .expect.element(restSelector + ' .Rest__predefined .EntityProperty__field--textValue').text.to.equal('Google Maps - Location')
      // .expect.element(restSelector + ' .Rest__method .EntityProperty__field--textValue').text.to.equal('GET')
      // .expect.element(restSelector + ' .Rest__url .EntityProperty__field--textValue').text.to.equal('https://maps.googleapis.com/maps/api/geocode/json')
      // .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint0)

      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint1)
      .selectValueSlow('.DetailsPanel', 'predefined', 'Google-Maps-GeoCode')
      .submitDetailsPanel(restSelector)

      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint2)
      .selectValueSlow('.DetailsPanel', 'predefined', 'Custom')
      // .submitDetailsPanel(restSelector) //, ['baseUrl'])
      .setValueSlow('.DetailsPanel .input__operations0templateurl input', customEndpoint1)
      .setValueSlow('.DetailsPanel .operations0templateresponsePath input', '$')
      .clickPresent('.DetailsPanel .button__add__operation')
      .setValueSlow('.DetailsPanel .input__operations1templateurl input', customEndpoint2)
      .setValueSlow('.DetailsPanel .operations1templateresponsePath input', '$')
      .clickPresent('.DetailsPanel .checkbox__optionsenabled')
      .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
      .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams0key input', 'accepts')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams0value input', 'application/json')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-type')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'application/json')
      // .selectValueSlow('.DetailsPanel', 'operations0templatemethod', 'GET')
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsenabled')
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring')
      .clickPresent('.DetailsPanel .button__add__operation0headersParameter')
      .setValueSlow('.DetailsPanel .input__operations0templateheaders0key input', 'accepts')
      .setValueSlow('.DetailsPanel .input__operations0templateheaders0value input', 'application/json')
      .clickPresent('.DetailsPanel .button__add__operation0headersParameter')
      .setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'content-type')
      .setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'application/json')
      .clickPresent('.DetailsPanel .button__add__operation0queryParameter')
      .setValueSlow('.DetailsPanel .input__operations0templatequery0key input', 'o1qpn1')
      .setValueSlow('.DetailsPanel .input__operations0templatequery0value input', '{o1qpv11},{o1qpv12}')
      .clickPresent('.DetailsPanel .button__add__operation0queryParameter')
      .setValueSlow('.DetailsPanel .input__operations0templatequery1key input', 'o1qpn2')
      .setValueSlow('.DetailsPanel .input__operations0templatequery1value input', '{o1qpv21},{o1qpv22}')
      .clickPresent('.DetailsPanel .button__add__operation0function')
      .setValueSlow('.DetailsPanel .input__operations0functions0key input', 'o1fn1')
      .setValueSlow('.DetailsPanel .input__operations0functions0value input', 'o1qpv11 ,  o1qpv12')
      .clickPresent('.DetailsPanel .button__add__operation0function')
      .setValueSlow('.DetailsPanel .input__operations0functions1key input', 'o1fn2')
      .setValueSlow('.DetailsPanel .input__operations0functions1value input', 'o1qpv21,  o1qpv22')
      // .selectValueSlow('.DetailsPanel', 'operations1templatemethod', 'GET')
      .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsenabled')
      .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsuseQuerystring')
      .clickPresent('.DetailsPanel .button__add__operation1headersParameter')
      .setValueSlow('.DetailsPanel .input__operations1templateheaders0key input', 'accepts')
      .setValueSlow('.DetailsPanel .input__operations1templateheaders0value input', 'application/json')
      .clickPresent('.DetailsPanel .button__add__operation1headersParameter')
      .setValueSlow('.DetailsPanel .input__operations1templateheaders1key input', 'content-type')
      .setValueSlow('.DetailsPanel .input__operations1templateheaders1value input', 'application/json')
      .clickPresent('.DetailsPanel .button__add__operation1queryParameter')
      .setValueSlow('.DetailsPanel .input__operations1templatequery0key input', 'o2qpn1')
      .setValueSlow('.DetailsPanel .input__operations1templatequery0value input', '{o2qpv11},{o2qpv12}')
      .clickPresent('.DetailsPanel .button__add__operation1queryParameter')
      .setValueSlow('.DetailsPanel .input__operations1templatequery1key input', 'o2qpn2')
      .setValueSlow('.DetailsPanel .input__operations1templatequery1value input', '{o2qpv21},{o2qpv22}')
      .clickPresent('.DetailsPanel .button__add__operation1function')
      .setValueSlow('.DetailsPanel .input__operations1functions0key input', 'o2fn1')
      .setValueSlow('.DetailsPanel .input__operations1functions0value input', 'o2qpv11 ,  o2qpv12')
      .clickPresent('.DetailsPanel .button__add__operation1function')
      .setValueSlow('.DetailsPanel .input__operations1functions1key input', 'o2fn2')
      .setValueSlow('.DetailsPanel .input__operations1functions1value input', 'o2qpv21,  o2qpv22')
      .submitDetailsPanel(restSelector)

      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint3)
      .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
      .clickPresent('.DetailsPanel .button__remove__optionsHeadersParameter0')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-language')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'en-US')
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring')
      .clickPresent('.DetailsPanel .button__remove__operation0headersParameter0')
      .clickPresent('.DetailsPanel .button__add__operation0headersParameter')
      .setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'content-language')
      .setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'en-US')
      .clickPresent('.DetailsPanel .button__remove__operation0queryParameter0')
      .clickPresent('.DetailsPanel .button__add__operation0queryParameter')
      .setValueSlow('.DetailsPanel .input__operations0templatequery1key input', 'o1qpn3')
      .setValueSlow('.DetailsPanel .input__operations0templatequery1value input', '{o1qpv31},{o1qpv32}')
      .clickPresent('.DetailsPanel .button__remove__operation0function0')
      .clickPresent('.DetailsPanel .button__add__operation0function')
      .setValueSlow('.DetailsPanel .input__operations0functions1key input', 'o1fn3')
      .setValueSlow('.DetailsPanel .input__operations0functions1value input', 'o1qpv31 ,  o1qpv32')
      .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsuseQuerystring')
      .clickPresent('.DetailsPanel .button__remove__operation1headersParameter0')
      .clickPresent('.DetailsPanel .button__add__operation1headersParameter')
      .setValueSlow('.DetailsPanel .input__operations1templateheaders1key input', 'content-language')
      .setValueSlow('.DetailsPanel .input__operations1templateheaders1value input', 'en-US')
      .clickPresent('.DetailsPanel .button__remove__operation1queryParameter0')
      .clickPresent('.DetailsPanel .button__add__operation1queryParameter')
      .setValueSlow('.DetailsPanel .input__operations1templatequery1key input', 'o2qpn3')
      .setValueSlow('.DetailsPanel .input__operations1templatequery1value input', '{o2qpv31},{o2qpv32}')
      .clickPresent('.DetailsPanel .button__remove__operation1function0')
      .clickPresent('.DetailsPanel .button__add__operation1function')
      .setValueSlow('.DetailsPanel .input__operations1functions1key input', 'o2fn3')
      .setValueSlow('.DetailsPanel .input__operations1functions1value input', 'o2qpv31 ,  o2qpv32')
      .submitDetailsPanel(restSelector)

      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint4)
      .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
      .clickPresent('.DetailsPanel .button__remove__operation1')
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsenabled')
      .clickPresent('.DetailsPanel .button__remove__operation0headersParameter0')
      .clickPresent('.DetailsPanel .button__remove__operation0queryParameter0')
      .clickPresent('.DetailsPanel .button__remove__operation0function0')
      .submitDetailsPanel(restSelector)

      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint5)
      .clickPresent('.DetailsPanel .checkbox__optionsenabled')
      .clickPresent('.DetailsPanel .button__remove__operation0headersParameter0')
      .clickPresent('.DetailsPanel .button__remove__operation0queryParameter0')
      .clickPresent('.DetailsPanel .button__remove__operation0function0')
      .submitDetailsPanel(restSelector)

      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint6)
      .closeDetailsPanel()
      .removeEntity(restSelector)
      .waitForDependencyFinish()
      .close();
  }
};

// const checkpoint0 = {
//   text: {
//     operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
//     operations0templateresponsePath: '$.results[0].formatted_address',
//     operations0templateheaders0key: 'accepts',
//     operations0templateheaders0value: 'application/json',
//     operations0templateheaders1key: 'content-type',
//     operations0templateheaders1value: 'application/json',
//     operations0templatequery0key: 'key',
//     operations0templatequery0value: '',
//     operations0templatequery1key: 'latlng',
//     operations0templatequery1value: '{lat},{long}',
//     operations0functions0key: 'location',
//     operations0functions0value: 'lat,long'
//   },
//   checkbox: {
//     optionsenabled: false,
//     operations0templateoptionsenabled: false
//   },
//   select: {
//     predefined: 'Google-Maps-Location',
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
//     '.input__operations0templatequery2key',
//     '.input__operations0functions1key',
//     '.input__operations1templateurl'
//   ]
// };
// const checkpoint1 = {
//   text: {
//     operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
//     operations0templateresponsePath: '$.results[0].formatted_address',
//     operations0templateheaders0key: 'accepts',
//     operations0templateheaders0value: 'application/json',
//     operations0templateheaders1key: 'content-type',
//     operations0templateheaders1value: 'application/json',
//     operations0templatequery0key: 'key',
//     operations0templatequery0value: '',
//     operations0templatequery1key: 'latlng',
//     operations0templatequery1value: '{lat},{long}',
//     operations0functions0key: 'location',
//     operations0functions0value: 'lat,long'
//   },
//   checkbox: {
//     optionsenabled: false,
//     operations0templateoptionsenabled: false
//   },
//   select: {
//     predefined: 'Google-Maps-Location',
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
//     '.input__operations0templatequery2key',
//     '.input__operations0functions1key',
//     '.input__operations1templateurl'
//   ]
// };
// const checkpoint2 = {
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
// const checkpoint3 = {
//   text: {
//     optionsheadersparams0key: 'accepts',
//     optionsheadersparams0value: 'application/json',
//     optionsheadersparams1key: 'content-type',
//     optionsheadersparams1value: 'application/json',
//     operations0templateurl: customEndpoint1,
//     operations0templateresponsePath: '$',
//     operations0templateheaders0key: 'accepts',
//     operations0templateheaders0value: 'application/json',
//     operations0templateheaders1key: 'content-type',
//     operations0templateheaders1value: 'application/json',
//     operations0templatequery0key: 'o1qpn1',
//     operations0templatequery0value: '{o1qpv11},{o1qpv12}',
//     operations0templatequery1key: 'o1qpn2',
//     operations0templatequery1value: '{o1qpv21},{o1qpv22}',
//     operations0functions0key: 'o1fn1',
//     operations0functions0value: 'o1qpv11,o1qpv12',
//     operations0functions1key: 'o1fn2',
//     operations0functions1value: 'o1qpv21,o1qpv22',
//     operations1templateurl: customEndpoint2,
//     operations1templateresponsePath: '$',
//     operations1templateheaders0key: 'accepts',
//     operations1templateheaders0value: 'application/json',
//     operations1templateheaders1key: 'content-type',
//     operations1templateheaders1value: 'application/json',
//     operations1templatequery0key: 'o2qpn1',
//     operations1templatequery0value: '{o2qpv11},{o2qpv12}',
//     operations1templatequery1key: 'o2qpn2',
//     operations1templatequery1value: '{o2qpv21},{o2qpv22}',
//     operations1functions0key: 'o2fn1',
//     operations1functions0value: 'o2qpv11,o2qpv12',
//     operations1functions1key: 'o2fn2',
//     operations1functions1value: 'o2qpv21,o2qpv22'
//   },
//   checkbox: {
//     optionsenabled: true,
//     optionsstrictSSL: true,
//     optionsuseQuerystring: true,
//     optionsheadersenabled: true,
//     operations0templateoptionsenabled: true,
//     operations0templateoptionsstrictSSL: true,
//     operations0templateoptionsuseQuerystring: true,
//     operations1templateoptionsenabled: true,
//     operations1templateoptionsstrictSSL: true,
//     operations1templateoptionsuseQuerystring: true
//   },
//   select: {
//     predefined: 'Custom',
//     operations0templatemethod: 'GET',
//     operations1templatemethod: 'GET'
//   },
//   notPresent: [
//     '.button__remove__operation0',
//     '.input__optionsheadersparams2key',
//     '.input__operations0templateheaders2key',
//     '.input__operations0templatequery2key',
//     '.input__operations0functions2key',
//     '.input__operations1templateheaders2key',
//     '.input__operations1templatequery2key',
//     '.input__operations1functions2key',
//     '.input__operations2templateurl'
//   ]
// };
// const checkpoint4 = {
//   text: {
//     optionsheadersparams0key: 'content-type',
//     optionsheadersparams0value: 'application/json',
//     optionsheadersparams1key: 'content-language',
//     optionsheadersparams1value: 'en-US',
//     operations0templateurl: customEndpoint1,
//     operations0templateresponsePath: '$',
//     operations0templateheaders0key: 'content-type',
//     operations0templateheaders0value: 'application/json',
//     operations0templateheaders1key: 'content-language',
//     operations0templateheaders1value: 'en-US',
//     operations0templatequery0key: 'o1qpn2',
//     operations0templatequery0value: '{o1qpv21},{o1qpv22}',
//     operations0templatequery1key: 'o1qpn3',
//     operations0templatequery1value: '{o1qpv31},{o1qpv32}',
//     operations0functions0key: 'o1fn2',
//     operations0functions0value: 'o1qpv21,o1qpv22',
//     operations0functions1key: 'o1fn3',
//     operations0functions1value: 'o1qpv31,o1qpv32',
//     operations1templateurl: customEndpoint2,
//     operations1templateresponsePath: '$',
//     operations1templateheaders0key: 'content-type',
//     operations1templateheaders0value: 'application/json',
//     operations1templateheaders1key: 'content-language',
//     operations1templateheaders1value: 'en-US',
//     operations1templatequery0key: 'o2qpn2',
//     operations1templatequery0value: '{o2qpv21},{o2qpv22}',
//     operations1templatequery1key: 'o2qpn3',
//     operations1templatequery1value: '{o2qpv31},{o2qpv32}',
//     operations1functions0key: 'o2fn2',
//     operations1functions0value: 'o2qpv21,o2qpv22',
//     operations1functions1key: 'o2fn3',
//     operations1functions1value: 'o2qpv31,o2qpv32'
//   },
//   checkbox: {
//     optionsenabled: true,
//     optionsstrictSSL: false,
//     optionsuseQuerystring: false,
//     optionsheadersenabled: true,
//     operations0templateoptionsenabled: true,
//     operations0templateoptionsstrictSSL: false,
//     operations0templateoptionsuseQuerystring: false,
//     operations1templateoptionsenabled: true,
//     operations1templateoptionsstrictSSL: false,
//     operations1templateoptionsuseQuerystring: false
//   },
//   select: {
//     predefined: 'Custom',
//     operations0templatemethod: 'GET',
//     operations1templatemethod: 'GET'
//   },
//   notPresent: [
//     '.button__remove__operation0',
//     '.input__optionsheadersparams2key',
//     '.input__operations0templateheaders2key',
//     '.input__operations0templatequery2key',
//     '.input__operations0functions2key',
//     '.input__operations1templateheaders2key',
//     '.input__operations1templatequery2key',
//     '.input__operations1functions2key',
//     '.input__operations2templateurl'
//   ]
// };
// const checkpoint5 = {
//   text: {
//     operations0templateurl: customEndpoint1,
//     operations0templateresponsePath: '$',
//     operations0templateheaders0key: 'content-language',
//     operations0templateheaders0value: 'en-US',
//     operations0templatequery0key: 'o1qpn3',
//     operations0templatequery0value: '{o1qpv31},{o1qpv32}',
//     operations0functions0key: 'o1fn3',
//     operations0functions0value: 'o1qpv31,o1qpv32'
//   },
//   checkbox: {
//     optionsenabled: true,
//     optionsstrictSSL: false,
//     optionsuseQuerystring: false,
//     optionsheadersenabled: false,
//     operations0templateoptionsenabled: false
//   },
//   select: {
//     predefined: 'Custom',
//     operations0templatemethod: 'GET'
//   },
//   notPresent: [
//     '.button__remove__operation0',
//     '.checkbox__operations0templateoptionsstrictSSL',
//     '.checkbox__operations0templateoptionsuseQuerystring',
//     '.input__optionsheadersparams0key',
//     '.input__operations0templateheaders1key',
//     '.input__operations0templatequery1key',
//     '.input__operations0functions1key',
//     '.input__operations1templateurl'
//   ]
// };
// const checkpoint6 = {
//   text: {
//     operations0templateurl: customEndpoint1,
//     operations0templateresponsePath: '$'
//   },
//   checkbox: {
//     optionsenabled: false,
//     operations0templateoptionsenabled: false
//   },
//   select: {
//     predefined: 'Custom',
//     operations0templatemethod: 'GET'
//   },
//   notPresent: [
//     '.checkbox__optionsstrictSSL',
//     '.checkbox__optionsuseQuerystring',
//     '.checkbox__optionsheadersenabled',
//     '.button__remove__operation0',
//     '.checkbox__operations0templateoptionsstrictSSL',
//     '.checkbox__operations0templateoptionsuseQuerystring',
//     '.input__optionsheadersparams0key',
//     '.input__operations0templateheaders0key',
//     '.input__operations0templatequery0key',
//     '.input__operations0functions0key',
//     '.input__operations1templateurl'
//   ]
// };
