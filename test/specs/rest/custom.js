var page;
var restSelector;
const datasourceName = 'Custom';
const customEndpoint1 = 'http://jsonplaceholder.typicode.com/users';
const customEndpoint2 = 'http://jsonplaceholder.typicode.com/posts';

module.exports = {
  // '@disabled': true,
  'Rest: Custom create': function (browser) {
    page = browser.page.lunchBadger();
    restSelector = page.getDataSourceSelector(1);
    page
      .open()
      .addElementFromTooltip('dataSource', 'rest')
      // .expect.element(restSelector + ' .Rest__predefined .EntityPropertyLabel').text.to.equal('PREDEFINED PROPERTIES')
      // .expect.element(restSelector + ' .Rest__method .EntityPropertyLabel').text.to.equal('METHOD')
      // .expect.element(restSelector + ' .Rest__url .EntityPropertyLabel').text.to.equal('URL')
      // .setValueSlow(restSelector + ' .input__name input', datasourceName)
      .selectValueSlow(restSelector, 'predefined', datasourceName)
      .setValueSlow(restSelector + ' .input__operations0templateurl input', customEndpoint1)
      .submitCanvasEntity(restSelector)
      .waitForDependencyFinish();
      // .submitDetailsPanel(restSelector) //, ['baseUrl'])
  },
  'Rest: custom edit 1': function () {
    page
      .openEntityInDetailsPanel(restSelector)
      .setValueSlow('.DetailsPanel .operations0templateresponsePath input', '$')
      .clickPresentPause('.DetailsPanel .button__add__operation')
      .setValueSlow('.DetailsPanel .input__operations1templateurl input', customEndpoint2)
      .setValueSlow('.DetailsPanel .operations1templateresponsePath input', '$')
      // .clickPresentPause('.DetailsPanel .checkbox__optionsenabled')
      // .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
      // .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
      // .clickPresent('.DetailsPanel .checkbox__optionsheadersenabled')
      // .clickPresentPause('.DetailsPanel .button__add__optionsHeadersParameter')
      // .setValueSlow('.DetailsPanel .input__optionsheadersparams0key input', 'accepts')
      // .setValueSlow('.DetailsPanel .input__optionsheadersparams0value input', 'application/json')
      //   .clickPresentPause('.DetailsPanel .button__add__optionsHeadersParameter')
      //   .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-type')
      //   .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'application/json')
      // // .selectValueSlow('.DetailsPanel', 'operations0templatemethod', 'GET')
      // .clickPresentPause('.DetailsPanel .checkbox__operations0templateoptionsenabled')
      // .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL')
      // .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring')
      // .clickPresentPause('.DetailsPanel .button__add__operation0headersParameter')
      // .setValueSlow('.DetailsPanel .input__operations0templateheaders0key input', 'accepts')
      // .setValueSlow('.DetailsPanel .input__operations0templateheaders0value input', 'application/json')
      //   .clickPresentPause('.DetailsPanel .button__add__operation0headersParameter')
      //   .setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'content-type')
      //   .setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'application/json')
      // .clickPresentPause('.DetailsPanel .button__add__operation0queryParameter')
      // .setValueSlow('.DetailsPanel .input__operations0templatequery0key input', 'fqpnf')
      // .setValueSlow('.DetailsPanel .input__operations0templatequery0value input', '{fqpvff},{fqpvfs}')
      //   .clickPresentPause('.DetailsPanel .button__add__operation0queryParameter')
      //   .setValueSlow('.DetailsPanel .input__operations0templatequery1key input', 'fqpns')
      //   .setValueSlow('.DetailsPanel .input__operations0templatequery1value input', '{fqpvsf},{fqpvss}')
      // .clickPresentPause('.DetailsPanel .button__add__operation0function')
      // .setValueSlow('.DetailsPanel .input__operations0functions0key input', 'ffnf')
      // .setValueSlow('.DetailsPanel .input__operations0functions0value input', 'fqpvff ,  fqpvfs')
      //   .clickPresentPause('.DetailsPanel .button__add__operation0function')
      //   .setValueSlow('.DetailsPanel .input__operations0functions1key input', 'ffns')
      //   .setValueSlow('.DetailsPanel .input__operations0functions1value input', 'fqpvsf,  fqpvss')
      // // .selectValueSlow('.DetailsPanel', 'operations1templatemethod', 'GET')
      // .clickPresentPause('.DetailsPanel .checkbox__operations1templateoptionsenabled')
      // .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsstrictSSL')
      // .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsuseQuerystring')
      // .clickPresentPause('.DetailsPanel .button__add__operation1headersParameter')
      // .setValueSlow('.DetailsPanel .input__operations1templateheaders0key input', 'accepts')
      // .setValueSlow('.DetailsPanel .input__operations1templateheaders0value input', 'application/json')
      //   .clickPresentPause('.DetailsPanel .button__add__operation1headersParameter')
      //   .setValueSlow('.DetailsPanel .input__operations1templateheaders1key input', 'content-type')
      //   .setValueSlow('.DetailsPanel .input__operations1templateheaders1value input', 'application/json')
      // .clickPresentPause('.DetailsPanel .button__add__operation1queryParameter')
      // .setValueSlow('.DetailsPanel .input__operations1templatequery0key input', 'sqpnf')
      // .setValueSlow('.DetailsPanel .input__operations1templatequery0value input', '{sqpvff},{sqpvfs}')
      //   .clickPresentPause('.DetailsPanel .button__add__operation1queryParameter')
      //   .setValueSlow('.DetailsPanel .input__operations1templatequery1key input', 'sqpns')
      //   .setValueSlow('.DetailsPanel .input__operations1templatequery1value input', '{sqpvsf},{sqpvss}')
      // .clickPresentPause('.DetailsPanel .button__add__operation1function')
      // .setValueSlow('.DetailsPanel .input__operations1functions0key input', 'sfnf')
      // .setValueSlow('.DetailsPanel .input__operations1functions0value input', 'sqpvff ,  sqpvfs')
      //   .clickPresentPause('.DetailsPanel .button__add__operation1function')
      //   .setValueSlow('.DetailsPanel .input__operations1functions1key input', 'sfns')
      //   .setValueSlow('.DetailsPanel .input__operations1functions1value input', 'sqpvsf,  sqpvss')
      .submitDetailsPanel(restSelector);
  },
  'Rest: custom edit 2': function () {
    page
      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      .setValueSlow('.DetailsPanel .operations0templateresponsePath input', '$.a')
      // .checkEntityDetails(checkpoint3)
      // .clickPresent('.DetailsPanel .checkbox__optionsstrictSSL')
      // .clickPresent('.DetailsPanel .checkbox__optionsuseQuerystring')
      // .clickPresent('.DetailsPanel .button__remove__optionsHeadersParameter0')
      // .clickPresentPause('.DetailsPanel .button__add__optionsHeadersParameter')
      // .setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'content-language')
      // .setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'en-US')
      // .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL')
      // .clickPresent('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring')
      // .clickPresent('.DetailsPanel .button__remove__operation0headersParameter0')
      // .clickPresentPause('.DetailsPanel .button__add__operation0headersParameter')
      // .setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'content-language')
      // .setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'en-US')
      // .clickPresent('.DetailsPanel .button__remove__operation0queryParameter0')
      // .clickPresentPause('.DetailsPanel .button__add__operation0queryParameter')
      // .setValueSlow('.DetailsPanel .input__operations0templatequery1key input', 'fqpnt')
      // .setValueSlow('.DetailsPanel .input__operations0templatequery1value input', '{fqpvtf},{fqpvts}')
      // .clickPresent('.DetailsPanel .button__remove__operation0function0')
      // .clickPresentPause('.DetailsPanel .button__add__operation0function')
      // .setValueSlow('.DetailsPanel .input__operations0functions1key input', 'ffnt')
      // .setValueSlow('.DetailsPanel .input__operations0functions1value input', 'fqpvtf ,  fqpvts')
      // .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsstrictSSL')
      // .clickPresent('.DetailsPanel .checkbox__operations1templateoptionsuseQuerystring')
      // .clickPresent('.DetailsPanel .button__remove__operation1headersParameter0')
      // .clickPresentPause('.DetailsPanel .button__add__operation1headersParameter')
      // .setValueSlow('.DetailsPanel .input__operations1templateheaders1key input', 'content-language')
      // .setValueSlow('.DetailsPanel .input__operations1templateheaders1value input', 'en-US')
      // .clickPresent('.DetailsPanel .button__remove__operation1queryParameter0')
      // .clickPresentPause('.DetailsPanel .button__add__operation1queryParameter')
      // .setValueSlow('.DetailsPanel .input__operations1templatequery1key input', 'sqpnt')
      // .setValueSlow('.DetailsPanel .input__operations1templatequery1value input', '{sqpvtf},{sqpvts}')
      // .clickPresent('.DetailsPanel .button__remove__operation1function0')
      // .clickPresentPause('.DetailsPanel .button__add__operation1function')
      // .setValueSlow('.DetailsPanel .input__operations1functions1key input', 'sfnt')
      // .setValueSlow('.DetailsPanel .input__operations1functions1value input', 'sqpvtf ,  sqpvts')
      .submitDetailsPanel(restSelector);
  },
  'Rest: custom remove 1': function () {
    page
      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      .setValueSlow('.DetailsPanel .operations0templateresponsePath input', '$.a.b')
      // .checkEntityDetails(checkpoint4)
      // .clickPresentPause('.DetailsPanel .checkbox__optionsheadersenabled')
      // .clickPresentPause('.DetailsPanel .button__remove__operation1')
      // .clickPresentPause('.DetailsPanel .checkbox__operations0templateoptionsenabled')
      // .clickPresentPause('.DetailsPanel .button__remove__operation0headersParameter0')
      // .clickPresentPause('.DetailsPanel .button__remove__operation0queryParameter0')
      // .clickPresentPause('.DetailsPanel .button__remove__operation0function0')
      .submitDetailsPanel(restSelector);
  },
  'Rest: custom remove 2': function () {
    page

      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      .setValueSlow('.DetailsPanel .operations0templateresponsePath input', '$.a.b.c')
      // .checkEntityDetails(checkpoint5)
      // .clickPresentPause('.DetailsPanel .checkbox__optionsenabled')
      // .clickPresentPause('.DetailsPanel .button__remove__operation0headersParameter0')
      // .clickPresentPause('.DetailsPanel .button__remove__operation0queryParameter0')
      // .clickPresentPause('.DetailsPanel .button__remove__operation0function0')
      .submitDetailsPanel(restSelector);
  },
  'Rest: custom delete': function () {
    page

      // .reloadPage()
      .openEntityInDetailsPanel(restSelector)
      // .checkEntityDetails(checkpoint6)
      .closeDetailsPanel()
      .removeEntity(restSelector)
      .waitForDependencyFinish()
      .close();
  }
};

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
