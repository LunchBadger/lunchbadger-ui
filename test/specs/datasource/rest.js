var page;
var restSelector;

function getCheckPoint (point) {
  console.log('CHECK POINT', point);
  const checkpoint = {};
  if (point === 0) {
    Object.assign(checkpoint, {
      text: {
        [`${restSelector} .Rest__predefined .EntityPropertyLabel`]: 'PREDEFINED PROPERTIES',
        [`${restSelector} .Rest__method .EntityPropertyLabel`]: 'METHOD',
        [`${restSelector} .Rest__url .EntityPropertyLabel`]: 'URL'
      }
    });
  }
  if (point === 1) {
    Object.assign(checkpoint, {
      text: {
        [`${restSelector} .Rest__predefined .EntityProperty__field--textValue`]: 'Google Maps - Location',
        [`${restSelector} .Rest__method .EntityProperty__field--textValue`]: 'GET',
        [`${restSelector} .Rest__url .EntityProperty__field--textValue`]: 'https://maps.googleapis.com/maps/api/geocode/json'
      }
    });
  }
  if (point >= 2) {
    const value = {};
    const checkbox = {};
    const operations0templateresponsePath = point === 2
      ? '$.results[0].formatted_address'
      : '$.results[0].geometry.location';
    const predefined = point === 2 ? 'Google-Maps-Location' : 'Google-Maps-GeoCode';
    const optionsenabled = point <= 3 ? false : true;
    const operations0templatequery1key = point <= 2 ? 'latlng' : 'address';
    const operations0templatequery1value = point <= 2 ? '{lat},{long}' : '{street},{city},{zipcode}';
    const operations0functions0key = point <= 2 ? 'location' : 'geocode';
    const operations0functions0value = point <= 2 ? 'lat,long' : 'street,city,zipcode';
    let optionsstrictSSL;
    let optionsuseQuerystring;
    let optionsheadersenabled;
    if (point >= 4) {
      optionsstrictSSL = false; //point === 4;
      optionsuseQuerystring = point === 4;
      optionsheadersenabled = [4, 5].includes(point);
      const optionsheadersparams0key = point === 4 ? 'accepts' : 'content-type';
      const optionsheadersparams1key = point === 4 ? 'content-type' : 'content-language';
      const optionsheadersparams1value = point === 4 ? 'application/json' : 'en-US';
      if (point <= 5) {
        Object.assign(value, {
          optionsheadersparams0key,
          optionsheadersparams0value: 'application/json',
          optionsheadersparams1key,
          optionsheadersparams1value
        });
      }
      Object.assign(checkbox, {
        optionsstrictSSL,
        optionsuseQuerystring,
        optionsheadersenabled
      });
    }
    Object.assign(checkpoint, {
      value: {
        operations0templateurl: 'https://maps.googleapis.com/maps/api/geocode/json',
        operations0templateresponsePath,
        operations0templateheaders0key: 'accepts',
        operations0templateheaders0value: 'application/json',
        operations0templateheaders1key: 'content-type',
        operations0templateheaders1value: 'application/json',
        operations0templatequery0key: 'key',
        operations0templatequery0value: '',
        operations0templatequery1key,
        operations0templatequery1value,
        operations0functions0key,
        operations0functions0value
      },
      checkbox: {
        optionsenabled
        // operations0templateoptionsenabled: false
      },
      select: {
        predefined,
        operations0templatemethod: 'GET'
      },
      notPresent: [
        // '.input__optionsheadersparams0key',
        '.checkbox__operations0templateoptionsstrictSSL',
        '.checkbox__operations0templateoptionsuseQuerystring',
        '.input__operations0templateheaders2key',
        // '.input__operations0templatequery2key',
        '.input__operations0functions1key',
        '.input__operations1templateurl'
      ]
    });
    Object.assign(checkpoint.value, value);
    Object.assign(checkpoint.checkbox, checkbox);
    if (point <= 3) {
      checkpoint.notPresent = [
        ...checkpoint.notPresent,
        '.checkbox__optionsstrictSSL',
        '.checkbox__optionsuseQuerystring',
        '.checkbox__optionsheadersenabled',
        '.button__remove__operation0'
      ];
    }
  }
  return checkpoint;
}

module.exports = {
  // '@disabled': true,
  'Datasource rest: add predefined Google Maps Location': function (browser) {
    page = browser.page.lunchBadger();
    restSelector = page.getDataSourceSelector(1);
    page
      .open()
      .addElementFromTooltip('dataSource', 'rest')
      .check(getCheckPoint(0))
      .selectValueSlow(restSelector, 'predefined', 'Google-Maps-Location')
      .submitCanvasEntity(restSelector)
      // .waitForDependencyFinish()
      .check(getCheckPoint(1))
  },
  'Datasource rest: change to predefined Google Maps GeoCode': function () {
    page
      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      .checkEntityDetails(getCheckPoint(2))
      .selectValueSlow('.DetailsPanel', 'predefined', 'Google-Maps-GeoCode')
      .submitDetailsPanel(restSelector);
  },
  'Datasource rest: advanced edit 1': function () {
    page
      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      .checkEntityDetails(getCheckPoint(3))
      .clickPresent('.DetailsPanel .checkbox__optionsenabled')
      // .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
      .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams0key input', 'accepts')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams0value input', 'application/json')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-type')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'application/json')
      .submitDetailsPanel(restSelector);
  },
  'Datasource rest: advanced edit 2': function () {
    page
      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      .checkEntityDetails(getCheckPoint(4))
      // .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
      .clickPresent('.DetailsPanel .button__remove__optionsHeadersParameter0')
      .clickPresent('.DetailsPanel .button__add__optionsHeadersParameter')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-language')
      .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'en-US')
      .submitDetailsPanel(restSelector);
  },
  'Datasource rest: advanced edit 3': function () {
    page
      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      .checkEntityDetails(getCheckPoint(5))
      .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
      .submitDetailsPanel(restSelector);
  },
  // 'Datasource rest: advanced edit 4': function () {
  //   page
  //     // .reloadPage()
  //     .openEntityInDetailsPanel(restSelector)
  //     .checkEntityDetails(getCheckPoint(5))
  //     .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
  //     .submitDetailsPanel(restSelector);
  // },
  'Datasource rest: remove': function () {
    page
      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      .checkEntityDetails(getCheckPoint(6))
      .closeDetailsPanel()
      // .removeEntity(restSelector)
      // .waitForDependencyFinish()
      .close();
  }
};
//       .selectValueSlow('.DetailsPanel', 'predefined', 'Custom')
//       // .submitDetailsPanel(restSelector) //, ['baseUrl'])
//       .setValueSlow('.DetailsPanel .input__operations0templateurl input', customEndpoint1)
//       .setValueSlow('.DetailsPanel .operations0templateresponsePath input', '$')
//       .clickPresentPause('.DetailsPanel .button__add__operation')
//       .setValueSlow('.DetailsPanel .input__operations1templateurl input', customEndpoint2)
//       .setValueSlow('.DetailsPanel .operations1templateresponsePath input', '$')
//       .clickPresentPause('.DetailsPanel .checkbox__optionsenabled')
//       .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
//       .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
//       .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
//       .clickPresentPause('.DetailsPanel .button__add__optionsHeadersParameter')
//       .setValueSlow('.DetailsPanel .input__optionsheadersparams0key input', 'accepts')
//       .setValueSlow('.DetailsPanel .input__optionsheadersparams0value input', 'application/json')
//         .clickPresentPause('.DetailsPanel .button__add__optionsHeadersParameter')
//         .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-type')
//         .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'application/json')
//       // .selectValueSlow('.DetailsPanel', 'operations0templatemethod', 'GET')
//       .clickPresentPause('.DetailsPanel .checkbox__operations0templateoptionsenabled')
//       .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL')
//       .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring')
//       .clickPresentPause('.DetailsPanel .button__add__operation0headersParameter')
//       .setValueSlow('.DetailsPanel .input__operations0templateheaders0key input', 'accepts')
//       .setValueSlow('.DetailsPanel .input__operations0templateheaders0value input', 'application/json')
//         .clickPresentPause('.DetailsPanel .button__add__operation0headersParameter')
//         .setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'content-type')
//         .setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'application/json')
//       .clickPresentPause('.DetailsPanel .button__add__operation0queryParameter')
//       .setValueSlow('.DetailsPanel .input__operations0templatequery0key input', 'fqpnf')
//       .setValueSlow('.DetailsPanel .input__operations0templatequery0value input', '{fqpvff},{fqpvfs}')
//         .clickPresentPause('.DetailsPanel .button__add__operation0queryParameter')
//         .setValueSlow('.DetailsPanel .input__operations0templatequery1key input', 'fqpns')
//         .setValueSlow('.DetailsPanel .input__operations0templatequery1value input', '{fqpvsf},{fqpvss}')
//       .clickPresentPause('.DetailsPanel .button__add__operation0function')
//       .setValueSlow('.DetailsPanel .input__operations0functions0key input', 'ffnf')
//       .setValueSlow('.DetailsPanel .input__operations0functions0value input', 'fqpvff ,  fqpvfs')
//         .clickPresentPause('.DetailsPanel .button__add__operation0function')
//         .setValueSlow('.DetailsPanel .input__operations0functions1key input', 'ffns')
//         .setValueSlow('.DetailsPanel .input__operations0functions1value input', 'fqpvsf,  fqpvss')
//       // .selectValueSlow('.DetailsPanel', 'operations1templatemethod', 'GET')
//       .clickPresentPause('.DetailsPanel .checkbox__operations1templateoptionsenabled')
//       .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsstrictSSL')
//       .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsuseQuerystring')
//       .clickPresentPause('.DetailsPanel .button__add__operation1headersParameter')
//       .setValueSlow('.DetailsPanel .input__operations1templateheaders0key input', 'accepts')
//       .setValueSlow('.DetailsPanel .input__operations1templateheaders0value input', 'application/json')
//         .clickPresentPause('.DetailsPanel .button__add__operation1headersParameter')
//         .setValueSlow('.DetailsPanel .input__operations1templateheaders1key input', 'content-type')
//         .setValueSlow('.DetailsPanel .input__operations1templateheaders1value input', 'application/json')
//       .clickPresentPause('.DetailsPanel .button__add__operation1queryParameter')
//       .setValueSlow('.DetailsPanel .input__operations1templatequery0key input', 'sqpnf')
//       .setValueSlow('.DetailsPanel .input__operations1templatequery0value input', '{sqpvff},{sqpvfs}')
//         .clickPresentPause('.DetailsPanel .button__add__operation1queryParameter')
//         .setValueSlow('.DetailsPanel .input__operations1templatequery1key input', 'sqpns')
//         .setValueSlow('.DetailsPanel .input__operations1templatequery1value input', '{sqpvsf},{sqpvss}')
//       .clickPresentPause('.DetailsPanel .button__add__operation1function')
//       .setValueSlow('.DetailsPanel .input__operations1functions0key input', 'sfnf')
//       .setValueSlow('.DetailsPanel .input__operations1functions0value input', 'sqpvff ,  sqpvfs')
//         .clickPresentPause('.DetailsPanel .button__add__operation1function')
//         .setValueSlow('.DetailsPanel .input__operations1functions1key input', 'sfns')
//         .setValueSlow('.DetailsPanel .input__operations1functions1value input', 'sqpvsf,  sqpvss')
//       .submitDetailsPanel(restSelector);
//   },
//   'Datasource rest: custom edit': function () {
//     page
//       // .reloadPage()
//       .openEntityInDetailsPanel(restSelector)
//       // .checkEntityDetails(checkpoint3)
//       .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
//       .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
//       .clickPresent('.DetailsPanel .button__remove__optionsHeadersParameter0')
//       .clickPresentPause('.DetailsPanel .button__add__optionsHeadersParameter')
//       .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-language')
//       .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'en-US')
//       .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL')
//       .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring')
//       .clickPresent('.DetailsPanel .button__remove__operation0headersParameter0')
//       .clickPresentPause('.DetailsPanel .button__add__operation0headersParameter')
//       .setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'content-language')
//       .setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'en-US')
//       .clickPresent('.DetailsPanel .button__remove__operation0queryParameter0')
//       .clickPresentPause('.DetailsPanel .button__add__operation0queryParameter')
//       .setValueSlow('.DetailsPanel .input__operations0templatequery1key input', 'fqpnt')
//       .setValueSlow('.DetailsPanel .input__operations0templatequery1value input', '{fqpvtf},{fqpvts}')
//       .clickPresent('.DetailsPanel .button__remove__operation0function0')
//       .clickPresentPause('.DetailsPanel .button__add__operation0function')
//       .setValueSlow('.DetailsPanel .input__operations0functions1key input', 'ffnt')
//       .setValueSlow('.DetailsPanel .input__operations0functions1value input', 'fqpvtf ,  fqpvts')
//       .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsstrictSSL')
//       .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsuseQuerystring')
//       .clickPresent('.DetailsPanel .button__remove__operation1headersParameter0')
//       .clickPresentPause('.DetailsPanel .button__add__operation1headersParameter')
//       .setValueSlow('.DetailsPanel .input__operations1templateheaders1key input', 'content-language')
//       .setValueSlow('.DetailsPanel .input__operations1templateheaders1value input', 'en-US')
//       .clickPresent('.DetailsPanel .button__remove__operation1queryParameter0')
//       .clickPresentPause('.DetailsPanel .button__add__operation1queryParameter')
//       .setValueSlow('.DetailsPanel .input__operations1templatequery1key input', 'sqpnt')
//       .setValueSlow('.DetailsPanel .input__operations1templatequery1value input', '{sqpvtf},{sqpvts}')
//       .clickPresent('.DetailsPanel .button__remove__operation1function0')
//       .clickPresentPause('.DetailsPanel .button__add__operation1function')
//       .setValueSlow('.DetailsPanel .input__operations1functions1key input', 'sfnt')
//       .setValueSlow('.DetailsPanel .input__operations1functions1value input', 'sqpvtf ,  sqpvts')
//       .submitDetailsPanel(restSelector);
//   },
//   'Datasource rest: custom remove 1': function () {
//     page
//       // .reloadPage()
//       .openEntityInDetailsPanel(restSelector)
//       // .checkEntityDetails(checkpoint4)
//       .clickPresentPause('.DetailsPanel .checkbox__optionsheadersenabled')
//       .clickPresentPause('.DetailsPanel .button__remove__operation1')
//       .clickPresentPause('.DetailsPanel .checkbox__operations0templateoptionsenabled')
//       .clickPresentPause('.DetailsPanel .button__remove__operation0headersParameter0')
//       .clickPresentPause('.DetailsPanel .button__remove__operation0queryParameter0')
//       .clickPresentPause('.DetailsPanel .button__remove__operation0function0')
//       .submitDetailsPanel(restSelector);
//   },
//   'Datasource rest: custom remove 2': function () {
//     page
//
//       // .reloadPage()
//       .openEntityInDetailsPanel(restSelector)
//       // .checkEntityDetails(checkpoint5)
//       .clickPresentPause('.DetailsPanel .checkbox__optionsenabled')
//       .clickPresentPause('.DetailsPanel .button__remove__operation0headersParameter0')
//       .clickPresentPause('.DetailsPanel .button__remove__operation0queryParameter0')
//       .clickPresentPause('.DetailsPanel .button__remove__operation0function0')
//       .submitDetailsPanel(restSelector);
//   },
//   'Datasource rest: custom delete': function () {
//     page
//
//       // .reloadPage()
//       .openEntityInDetailsPanel(restSelector)
//       // .checkEntityDetails(checkpoint6)
//       .closeDetailsPanel()
//       .removeEntity(restSelector)
//       .waitForDependencyFinish()
//       .close();
//   }
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
//     operations0templatequery0key: 'fqpnf',
//     operations0templatequery0value: '{fqpvff},{fqpvfs}',
//     operations0templatequery1key: 'fqpns',
//     operations0templatequery1value: '{fqpvsf},{fqpvss}',
//     operations0functions0key: 'ffnf',
//     operations0functions0value: 'fqpvff,fqpvfs',
//     operations0functions1key: 'ffns',
//     operations0functions1value: 'fqpvsf,fqpvss',
//     operations1templateurl: customEndpoint2,
//     operations1templateresponsePath: '$',
//     operations1templateheaders0key: 'accepts',
//     operations1templateheaders0value: 'application/json',
//     operations1templateheaders1key: 'content-type',
//     operations1templateheaders1value: 'application/json',
//     operations1templatequery0key: 'sqpnf',
//     operations1templatequery0value: '{sqpvff},{sqpvfs}',
//     operations1templatequery1key: 'sqpns',
//     operations1templatequery1value: '{sqpvsf},{sqpvss}',
//     operations1functions0key: 'sfnf',
//     operations1functions0value: 'sqpvff,sqpvfs',
//     operations1functions1key: 'sfns',
//     operations1functions1value: 'sqpvsf,sqpvss'
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
//     operations0templatequery0key: 'fqpns',
//     operations0templatequery0value: '{fqpvsf},{fqpvss}',
//     operations0templatequery1key: 'fqpnt',
//     operations0templatequery1value: '{fqpvtf},{fqpvts}',
//     operations0functions0key: 'ffns',
//     operations0functions0value: 'fqpvsf,fqpvss',
//     operations0functions1key: 'ffnt',
//     operations0functions1value: 'fqpvtf,fqpvts',
//     operations1templateurl: customEndpoint2,
//     operations1templateresponsePath: '$',
//     operations1templateheaders0key: 'content-type',
//     operations1templateheaders0value: 'application/json',
//     operations1templateheaders1key: 'content-language',
//     operations1templateheaders1value: 'en-US',
//     operations1templatequery0key: 'sqpns',
//     operations1templatequery0value: '{sqpvsf},{sqpvss}',
//     operations1templatequery1key: 'sqpnt',
//     operations1templatequery1value: '{sqpvtf},{sqpvts}',
//     operations1functions0key: 'sfns',
//     operations1functions0value: 'sqpvsf,sqpvss',
//     operations1functions1key: 'sfnt',
//     operations1functions1value: 'sqpvtf,sqpvts'
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
//     operations0templatequery0key: 'fqpnt',
//     operations0templatequery0value: '{fqpvtf},{fqpvts}',
//     operations0functions0key: 'ffnt',
//     operations0functions0value: 'fqpvtf,fqpvts'
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
