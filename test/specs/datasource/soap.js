var page;
var entitySelector;
const TEST_WSDL = 'http://www.webservicex.com/globalweather.asmx';

module.exports = {
  '@disabled': true, // FIXME after soap installing will be server-side fixed
  'Soap: plain soap': function (browser) {
    page = browser.page.lunchBadger();
    entitySelector = page.getDataSourceSelector(1);
    page
      .open()
      .testDatasource('soap', [
        ['URL', TEST_WSDL]
      ], [
        'url'
      ])
      .openEntityInDetailsPanel(entitySelector)
      .checkEntityDetails(expectPlainSoap);
  },
  'Soap: advanced edit': function () {
    page
      .setValueSlow('.DetailsPanel .input__wsdl input', TEST_WSDL + '?wsdl')
      .clickPresent('.DetailsPanel .checkbox__remotingEnabled')
      .clickPresent('.DetailsPanel .checkbox__wsdl_optionsrejectUnauthorized')
      .clickPresent('.DetailsPanel .checkbox__wsdl_optionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__wsdl_optionsrequestCert')
      .setValueSlow('.DetailsPanel .input__securityusername input', 'testuser')
      .setValueSlow('.DetailsPanel .input__securitypassword input', 'passwd')
      .clickPresent('.DetailsPanel .button__add__operation')
      .setValueSlow('.DetailsPanel .input__soapOperations0key input', 'k1')
      .setValueSlow('.DetailsPanel .input__soapOperations0service input', 's1')
      .setValueSlow('.DetailsPanel .input__soapOperations0port input', '7')
      .setValueSlow('.DetailsPanel .input__soapOperations0operation input', 'o1')
      .clickPresent('.DetailsPanel .button__add__operation')
      .setValueSlow('.DetailsPanel .input__soapOperations1key input', 'k2')
      .setValueSlow('.DetailsPanel .input__soapOperations1service input', 's2')
      .setValueSlow('.DetailsPanel .input__soapOperations1port input', '8')
      .setValueSlow('.DetailsPanel .input__soapOperations1operation input', 'o2')
      .clickPresent('.DetailsPanel .button__add__soapHeader')
      .setValueSlow('.DetailsPanel .input__soapHeaders0elementKey input', 'ek1')
      .setValueSlow('.DetailsPanel .input__soapHeaders0elementValue input', 'ev1')
      .setValueSlow('.DetailsPanel .input__soapHeaders0prefix input', 'p1')
      .setValueSlow('.DetailsPanel .input__soapHeaders0namespace input', 'n1')
      .clickPresent('.DetailsPanel .button__add__soapHeader')
      .setValueSlow('.DetailsPanel .input__soapHeaders1elementKey input', 'ek2')
      .setValueSlow('.DetailsPanel .input__soapHeaders1elementValue input', 'ev2')
      .setValueSlow('.DetailsPanel .input__soapHeaders1prefix input', 'p2')
      .setValueSlow('.DetailsPanel .input__soapHeaders1namespace input', 'n2')
      .selectValueSlow('.DetailsPanel', 'securitypasswordType', 'PasswordDigest')
      .submitDetailsPanel(entitySelector)
      .reloadPage()
      .openEntityInDetailsPanel(entitySelector)
      .checkEntityDetails(expectAdvancedEdit);
  },
  'Soap: basic auth': function () {
    page
      .selectValueSlow('.DetailsPanel', 'securityscheme', 'BasicAuth')
      .checkEntityDetails(expectBasicAuth);
  },
  'Soap: removed options': function () {
    page
      .setValueSlow('.DetailsPanel .input__securityusername input', 'bauser')
      .setValueSlow('.DetailsPanel .input__securitypassword input', 'bapasswd')
      .clickVisibleOnHover('.DetailsPanel .input__soapOperations0key', '.DetailsPanel .button__remove__operation0')
      .clickVisibleOnHover('.DetailsPanel .input__soapHeaders0elementKey', '.DetailsPanel .button__remove__soapHeader0')
      .submitDetailsPanel(entitySelector)
      .reloadPage()
      .openEntityInDetailsPanel(entitySelector)
      .checkEntityDetails(expectRemovedOptions);
  },
  'Soap: client SSL': function () {
    page
      .clickPresent('.DetailsPanel .checkbox__remotingEnabled')
      .clickPresent('.DetailsPanel .checkbox__wsdl_optionsrejectUnauthorized')
      .clickPresent('.DetailsPanel .checkbox__wsdl_optionsstrictSSL')
      .clickPresent('.DetailsPanel .checkbox__wsdl_optionsrequestCert')
      .selectValueSlow('.DetailsPanel', 'securityscheme', 'ClientSSL')
      .setValueSlow('.DetailsPanel .input__securitykeyPath input', 'k')
      .setValueSlow('.DetailsPanel .input__securitycertPath input', 'c')
      .checkEntityDetails(expectClientSSL);
  },
  'Soap: WS': function () {
    page
      .selectValueSlow('.DetailsPanel', 'securityscheme', 'WS')
      .checkEntityDetails(expectPlainWS)
      .setValueSlow('.DetailsPanel .input__securityusername input', 'testuser')
      .setValueSlow('.DetailsPanel .input__securitypassword input', 'passwd')
      .clickPresent('.DetailsPanel .button__add__operation')
      .setValueSlow('.DetailsPanel .input__soapOperations1key input', 'k3')
      .setValueSlow('.DetailsPanel .input__soapOperations1service input', 's3')
      .setValueSlow('.DetailsPanel .input__soapOperations1port input', '9')
      .setValueSlow('.DetailsPanel .input__soapOperations1operation input', 'o3')
      .clickPresent('.DetailsPanel .button__add__soapHeader')
      .setValueSlow('.DetailsPanel .input__soapHeaders1elementKey input', 'ek3')
      .setValueSlow('.DetailsPanel .input__soapHeaders1elementValue input', 'ev3')
      .setValueSlow('.DetailsPanel .input__soapHeaders1prefix input', 'p3')
      .setValueSlow('.DetailsPanel .input__soapHeaders1namespace input', 'n3')
      .submitDetailsPanel(entitySelector)
      .reloadPage()
      .openEntityInDetailsPanel(entitySelector)
      .checkEntityDetails(expectWS);
  },
  'Soap: remove soap': function () {
    page
      .closeDetailsPanel()
      .removeEntityWithDependencyUninstall(entitySelector)
      .close();
  }
};

const expectPlainSoap = {
  value: {
    url: TEST_WSDL,
    wsdl: '',
    securityusername: '',
    securitypassword: ''
  },
  checkbox: {
    remotingEnabled: false,
    wsdl_optionsrejectUnauthorized: false,
    wsdl_optionsstrictSSL: false,
    wsdl_optionsrequestCert: false
  },
  select: {
    securityscheme: 'WS',
    securitypasswordType: 'PasswordText'
  },
  notPresent: [
    '.input__soapOperations0key',
    '.input__soapHeaders0elementKey'
  ]
};
const expectAdvancedEdit = {
  value: {
    url: TEST_WSDL,
    wsdl: TEST_WSDL + '?wsdl',
    securityusername: 'testuser',
    securitypassword: 'passwd',
    soapOperations0key: 'k1',
    soapOperations0service: 's1',
    soapOperations0port: '7',
    soapOperations0operation: 'o1',
    soapOperations1key: 'k2',
    soapOperations1service: 's2',
    soapOperations1port: '8',
    soapOperations1operation: 'o2',
    soapHeaders0elementKey: 'ek1',
    soapHeaders0elementValue: 'ev1',
    soapHeaders0prefix: 'p1',
    soapHeaders0namespace: 'n1',
    soapHeaders1elementKey: 'ek2',
    soapHeaders1elementValue: 'ev2',
    soapHeaders1prefix: 'p2',
    soapHeaders1namespace: 'n2'
  },
  checkbox: {
    remotingEnabled: true,
    wsdl_optionsrejectUnauthorized: true,
    wsdl_optionsstrictSSL: true,
    wsdl_optionsrequestCert: true
  },
  select: {
    securityscheme: 'WS',
    securitypasswordType: 'PasswordDigest'
  },
  notPresent: [
    '.input__soapOperations2key',
    '.input__soapHeaders2elementKey'
  ]
};
const expectBasicAuth = {
  value: {
    securityusername: 'testuser',
    securitypassword: 'passwd'
  },
  notPresent: [
    '.select__securitypasswordType'
  ]
};
const expectRemovedOptions = {
  value: {
    url: TEST_WSDL,
    wsdl: TEST_WSDL + '?wsdl',
    securityusername: 'bauser',
    securitypassword: 'bapasswd',
    soapOperations0key: 'k2',
    soapOperations0service: 's2',
    soapOperations0port: '8',
    soapOperations0operation: 'o2',
    soapHeaders0elementKey: 'ek2',
    soapHeaders0elementValue: 'ev2',
    soapHeaders0prefix: 'p2',
    soapHeaders0namespace: 'n2'
  },
  checkbox: {
    remotingEnabled: true,
    wsdl_optionsrejectUnauthorized: true,
    wsdl_optionsstrictSSL: true,
    wsdl_optionsrequestCert: true
  },
  select: {
    securityscheme: 'BasicAuth'
  },
  notPresent: [
    '.input__soapOperations1key',
    '.input__soapHeaders1elementKey',
    '.select__securitypasswordType'
  ]
};
const expectClientSSL = {
  value: {
    securitykeyPath: 'k',
    securitycertPath: 'c'
  },
  notPresent: [
    '.input__securityusername',
    '.input__securitypassword',
    '.select__securitypasswordType'
  ]
};
const expectPlainWS = {
  value: {
    url: TEST_WSDL,
    wsdl: TEST_WSDL + '?wsdl',
    securityusername: '',
    securitypassword: '',
    soapOperations0key: 'k2',
    soapOperations0service: 's2',
    soapOperations0port: '8',
    soapOperations0operation: 'o2',
    soapHeaders0elementKey: 'ek2',
    soapHeaders0elementValue: 'ev2',
    soapHeaders0prefix: 'p2',
    soapHeaders0namespace: 'n2'
  },
  checkbox: {
    remotingEnabled: false,
    wsdl_optionsrejectUnauthorized: false,
    wsdl_optionsstrictSSL: false,
    wsdl_optionsrequestCert: false
  },
  select: {
    securityscheme: 'WS',
    securitypasswordType: 'PasswordText'
  },
  notPresent: [
    '.input__securitykeyPath',
    '.input__securitycertPath',
    '.input__soapOperations1key',
    '.input__soapHeaders1elementKey'
  ]
};
const expectWS = {
  value: {
    url: TEST_WSDL,
    wsdl: TEST_WSDL + '?wsdl',
    securityusername: 'testuser',
    securitypassword: 'passwd',
    soapOperations0key: 'k2',
    soapOperations0service: 's2',
    soapOperations0port: '8',
    soapOperations0operation: 'o2',
    soapOperations1key: 'k3',
    soapOperations1service: 's3',
    soapOperations1port: '9',
    soapOperations1operation: 'o3',
    soapHeaders0elementKey: 'ek2',
    soapHeaders0elementValue: 'ev2',
    soapHeaders0prefix: 'p2',
    soapHeaders0namespace: 'n2',
    soapHeaders1elementKey: 'ek3',
    soapHeaders1elementValue: 'ev3',
    soapHeaders1prefix: 'p3',
    soapHeaders1namespace: 'n3'
  },
  checkbox: {
    remotingEnabled: false,
    wsdl_optionsrejectUnauthorized: false,
    wsdl_optionsstrictSSL: false,
    wsdl_optionsrequestCert: false
  },
  select: {
    securityscheme: 'WS',
    securitypasswordType: 'PasswordText'
  },
  notPresent: [
    '.input__securitykeyPath',
    '.input__securitycertPath',
    '.input__soapOperations2key',
    '.input__soapHeaders2elementKey'
  ]
};
