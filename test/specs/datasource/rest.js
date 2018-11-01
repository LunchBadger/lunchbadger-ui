var page;
var entitySelector;

module.exports = {
  // '@disabled': true,
  'Rest: add predefined Google Maps Location': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .addElementFromTooltip('dataSource', 'rest')
      .check({
        text: {
          [`${entitySelector} .RestPredefinedTemplates .EntityPropertyLabel`]: 'PREDEFINED TEMPLATES',
          [`${entitySelector} .Rest__method .EntityPropertyLabel`]: 'METHOD',
          [`${entitySelector} .Rest__url .EntityPropertyLabel`]: 'URL'
        }
      })
      .submitCanvasEntityWithExpectedValidationErrors(entitySelector, ['baseUrl'])
      .selectValueSlow(entitySelector, 'predefined', 'Google-Maps-Location')
      .submitCanvasEntityWithoutAutoSave(entitySelector)
      // .waitForDependencyFinish()
      .check({
        text: {
          [`${entitySelector} .RestPredefinedTemplates .EntityProperty__field--textValue`]: 'Google Maps - Location',
          [`${entitySelector} .Rest__method .EntityProperty__field--textValue`]: 'GET',
          [`${entitySelector} .Rest__url .EntityProperty__field--textValue`]: 'https://maps.googleapis.com/maps/api/geocode/json'
        }
      })
  },
  'Rest: change to predefined Google Maps GeoCode': function () {
    page
      .openEntityInDetailsPanel(entitySelector)
      .checkEntityDetails(expectPlainGoogleMapsLocation)
      .selectValueSlow('.DetailsPanel', 'predefined', 'Google-Maps-GeoCode')
      .submitDetailsPanel(entitySelector)
      .check({
        text: {
          [`${entitySelector} .RestPredefinedTemplates .EntityProperty__field--textValue`]: 'Google Maps - GeoCode',
          [`${entitySelector} .Rest__method .EntityProperty__field--textValue`]: 'GET',
          [`${entitySelector} .Rest__url .EntityProperty__field--textValue`]: 'https://maps.googleapis.com/maps/api/geocode/json'
        }
      });
  },
  'Rest: options': function () {
    page
      .openEntityInDetailsPanel(entitySelector)
      .checkEntityDetails(expectPlainGoogleMapsGeoCode)
      .clickPresent('.DetailsPanel .checkbox__optionsenabled')
      .checkEntityDetails(expectGoogleMapsGeoCodeWithOptionsEnabled)
      .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
      .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams0key input', 'accepts')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams0value input', 'application/json')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-type')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'application/json')
      .checkEntityDetails(expectOptionsHeadersAdded)
      .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
      .clickVisibleOnHover('.DetailsPanel .input__optionsheadersparams0key', '.DetailsPanel .button__remove__optionsHeadersParameter0')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-language')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'en-US')
      .checkEntityDetails(expectOptionsHeadersChanged)
      .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
      .checkEntityDetails(expectOptionsHeadersDisabled)
      .clickPresent('.DetailsPanel .checkbox__optionsenabled')
      .checkEntityDetails(expectPlainGoogleMapsGeoCode);
  },
  'Rest: operations options': function () {
    page
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsenabled')
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring')
      .checkEntityDetails(expectOperations0TemplateOptionsEnabled)
      .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsenabled')
      .checkEntityDetails(expectPlainGoogleMapsGeoCode);
  },
  'Rest: operations headers remove': function () {
    page
      .clickVisibleOnHover('.DetailsPanel .input__operations0templateheaders0key', '.DetailsPanel .button__remove__operation0headersParameter0')
      .checkEntityDetails(expectOperations0HeadersParameterRemoved);
  },
  'Rest: operations headers add': function () {
    page
      .clickPresent('.DetailsPanel .button__add__operation0headersParameter')
      .setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'content-language')
      .setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'en-US')
      .checkEntityDetails(expectOperations0HeadersParameterAdded);
  },
  'Rest: operations headers remove all': function () {
    page
      .clickVisibleOnHover('.DetailsPanel .input__operations0templateheaders1key', '.DetailsPanel .button__remove__operation0headersParameter1')
      .clickVisibleOnHover('.DetailsPanel .input__operations0templateheaders0key', '.DetailsPanel .button__remove__operation0headersParameter0')
      .checkEntityDetails(expectOperations0HeadersAllParametersRemoved);
  },
  'Rest: operations query remove': function () {
    page
      .clickVisibleOnHover('.DetailsPanel .input__operations0templatequery0key', '.DetailsPanel .button__remove__operation0queryParameter0')
      .checkEntityDetails(expectOperations0QueryParameterRemoved);
  },
  'Rest: operations query add': function () {
    page
      .clickPresent('.DetailsPanel .button__add__operation0queryParameter')
      .setValueSlow('.DetailsPanel .input__operations0templatequery2key input', 'myparam')
      .setValueSlow('.DetailsPanel .input__operations0templatequery2value input', '{myparam=7}')
      .checkEntityDetails(expectOperations0QueryParameterAdded);
  },
  'Rest: operations functions add': function () {
    page
      .clickPresent('.DetailsPanel .button__add__operation0function')
      .setValueSlow('.DetailsPanel .input__operations0functions1key input', 'myfunc')
      .setValueSlow('.DetailsPanel .input__operations0functions1value input', 'myparam')
      .checkEntityDetails(expectOperations0FunctionsParameterAdded);
  },
  'Rest: operations functions remove': function () {
    page
      .clickVisibleOnHover('.DetailsPanel .input__operations0functions0key', '.DetailsPanel .button__remove__operation0function0')
      .checkEntityDetails(expectOperations0FunctionsParameterRemoved);
  },
  'Rest: operations functions remove all': function () {
    page
      .clickVisibleOnHover('.DetailsPanel .input__operations0functions0key', '.DetailsPanel .button__remove__operation0function0')
      .checkEntityDetails(expectOperations0FunctionsAllParametersRemoved);
  },
  'Rest: operations query remove all': function () {
    page
      .clickVisibleOnHover('.DetailsPanel .input__operations0templatequery1key', '.DetailsPanel .button__remove__operation0queryParameter1')
      .clickVisibleOnHover('.DetailsPanel .input__operations0templatequery0key', '.DetailsPanel .button__remove__operation0queryParameter0')
      .checkEntityDetails(expectOperations0QueryAllParameterRemoved)
      .closeDetailsPanel();
  },
  'Rest: remove': function () {
    page
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};

const expectPlainGoogleMapsLocation = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].formatted_address',
    operations0templateheaders0key: 'accepts',
    operations0templateheaders0value: 'application/json',
    operations0templateheaders1key: 'content-type',
    operations0templateheaders1value: 'application/json',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'latlng',
    operations0templatequery1value: '{lat},{long}',
    operations0functions0key: 'location',
    operations0functions0value: 'lat,long'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-Location',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams2key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders2key',
    'input__operations0templatequery2key',
    'input__operations0functions1key'
  ]
};
const expectPlainGoogleMapsGeoCode = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templateheaders0key: 'accepts',
    operations0templateheaders0value: 'application/json',
    operations0templateheaders1key: 'content-type',
    operations0templateheaders1value: 'application/json',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams2key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders2key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectGoogleMapsGeoCodeWithOptionsEnabled = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templateheaders0key: 'accepts',
    operations0templateheaders0value: 'application/json',
    operations0templateheaders1key: 'content-type',
    operations0templateheaders1value: 'application/json',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: true,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'input__optionsheadersparams2key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders2key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOptionsHeadersAdded = {
  value: {
    optionsheadersparams0key: 'accepts',
    optionsheadersparams0value: 'application/json',
    optionsheadersparams1key: 'content-type',
    optionsheadersparams1value: 'application/json',
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templateheaders0key: 'accepts',
    operations0templateheaders0value: 'application/json',
    operations0templateheaders1key: 'content-type',
    operations0templateheaders1value: 'application/json',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: true,
    optionsstrictSSL: true,
    optionsuseQuerystring: true,
    optionsheadersenabled: true,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'input__optionsheadersparams2key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders2key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOptionsHeadersChanged = {
  value: {
    optionsheadersparams0key: 'content-type',
    optionsheadersparams0value: 'application/json',
    optionsheadersparams1key: 'content-language',
    optionsheadersparams1value: 'en-US',
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templateheaders0key: 'accepts',
    operations0templateheaders0value: 'application/json',
    operations0templateheaders1key: 'content-type',
    operations0templateheaders1value: 'application/json',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: true,
    optionsstrictSSL: false,
    optionsuseQuerystring: false,
    optionsheadersenabled: true,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'input__optionsheadersparams2key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders2key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOptionsHeadersDisabled = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templateheaders0key: 'accepts',
    operations0templateheaders0value: 'application/json',
    operations0templateheaders1key: 'content-type',
    operations0templateheaders1value: 'application/json',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: true,
    optionsstrictSSL: false,
    optionsuseQuerystring: false,
    optionsheadersenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders2key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOperations0TemplateOptionsEnabled = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templateheaders0key: 'accepts',
    operations0templateheaders0value: 'application/json',
    operations0templateheaders1key: 'content-type',
    operations0templateheaders1value: 'application/json',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: true,
    operations0templateoptionsstrictSSL: true,
    operations0templateoptionsuseQuerystring: true
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'input__operations0templateheaders2key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOperations0HeadersParameterRemoved = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templateheaders0key: 'content-type',
    operations0templateheaders0value: 'application/json',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders1key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOperations0HeadersParameterAdded = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templateheaders0key: 'content-type',
    operations0templateheaders0value: 'application/json',
    operations0templateheaders1key: 'content-language',
    operations0templateheaders1value: 'en-US',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders2key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOperations0HeadersAllParametersRemoved = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templatequery0key: 'key',
    operations0templatequery0value: '',
    operations0templatequery1key: 'address',
    operations0templatequery1value: '{street},{city},{zipcode}',
    operations0templatequery2key: 'sensor',
    operations0templatequery2value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders0key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOperations0QueryParameterRemoved = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templatequery0key: 'address',
    operations0templatequery0value: '{street},{city},{zipcode}',
    operations0templatequery1key: 'sensor',
    operations0templatequery1value: '{sensor=false}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders0key',
    'input__operations0templatequery2key',
    'input__operations0functions1key'
  ]
};
const expectOperations0QueryParameterAdded = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templatequery0key: 'address',
    operations0templatequery0value: '{street},{city},{zipcode}',
    operations0templatequery1key: 'sensor',
    operations0templatequery1value: '{sensor=false}',
    operations0templatequery2key: 'myparam',
    operations0templatequery2value: '{myparam=7}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders0key',
    'input__operations0templatequery3key',
    'input__operations0functions1key'
  ]
};
const expectOperations0FunctionsParameterAdded = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templatequery0key: 'address',
    operations0templatequery0value: '{street},{city},{zipcode}',
    operations0templatequery1key: 'sensor',
    operations0templatequery1value: '{sensor=false}',
    operations0templatequery2key: 'myparam',
    operations0templatequery2value: '{myparam=7}',
    operations0functions0key: 'geocode',
    operations0functions0value: 'street,city,zipcode',
    operations0functions1key: 'myfunc',
    operations0functions1value: 'myparam'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders0key',
    'input__operations0templatequery3key',
    'input__operations0functions2key'
  ]
};
const expectOperations0FunctionsParameterRemoved = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templatequery0key: 'address',
    operations0templatequery0value: '{street},{city},{zipcode}',
    operations0templatequery1key: 'sensor',
    operations0templatequery1value: '{sensor=false}',
    operations0templatequery2key: 'myparam',
    operations0templatequery2value: '{myparam=7}'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders0key',
    'input__operations0templatequery3key',
    'input__operations0functions0key'
  ]
};
const expectOperations0FunctionsAllParametersRemoved = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location',
    operations0templatequery0key: 'address',
    operations0templatequery0value: '{street},{city},{zipcode}',
    operations0templatequery1key: 'sensor',
    operations0templatequery1value: '{sensor=false}'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders0key',
    'input__operations0templatequery2key',
    'input__operations0functions0key'
  ]
};
const expectOperations0QueryAllParameterRemoved = {
  value: {
    operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
    operations0templateresponsePath: '$.results[0].geometry.location'
  },
  checkbox: {
    optionsenabled: false,
    operations0templateoptionsenabled: false
  },
  select: {
    predefined: 'Google-Maps-GeoCode',
    operations0templatemethod: 'GET'
  },
  notPresent: [
    'checkbox__optionsstrictSSL',
    'checkbox__optionsuseQuerystring',
    'checkbox__optionsheadersenabled',
    'input__optionsheadersparams0key',
    'checkbox__operations0templateoptionsstrictSSL',
    'checkbox__operations0templateoptionsuseQuerystring',
    'input__operations0templateheaders0key',
    'input__operations0templatequery0key',
    'input__operations0functions0key'
  ]
};
