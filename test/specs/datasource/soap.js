const TEST_WSDL = 'http://www.webservicex.com/globalweather.asmx';

module.exports = {
  // '@disabled': true,
  'Datasource: soap': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('soap', [
      'url',
    ], [
      ['URL', TEST_WSDL]
    ], function () {
      page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
      page.checkEntityDetails({
        text: {
          url: TEST_WSDL,
          wsdl: '',
          securityusername: '',
          securitypassword: '',
        },
        checkbox: {
          remotingEnabled: false,
          wsdl_optionsrejectUnauthorized: false,
          wsdl_optionsstrictSSL: false,
          wsdl_optionsrequestCert: false,
        },
        select: {
          securityscheme: 'WS',
          securitypasswordType: 'PasswordText',
        },
        notPresent: [
          '.input__soapOperations0key',
          '.input__soapHeaders0elementKey',
        ],
      });
      page.setValueSlow('.DetailsPanel .input__wsdl input', TEST_WSDL + '?wsdl');
      page.click('.DetailsPanel .checkbox__remotingEnabled');
      page.click('.DetailsPanel .checkbox__wsdl_optionsrejectUnauthorized');
      page.click('.DetailsPanel .checkbox__wsdl_optionsstrictSSL');
      page.click('.DetailsPanel .checkbox__wsdl_optionsrequestCert');
      page.setValueSlow('.DetailsPanel .input__securityusername input', 'testuser');
      page.setValueSlow('.DetailsPanel .input__securitypassword input', 'passwd');
      page.selectValueSlow('.DetailsPanel', 'securitypasswordType', 'PasswordDigest');
      page.click('.DetailsPanel .button__add__operation');
      page.setValueSlow('.DetailsPanel .input__soapOperations0key input', 'key1');
      page.setValueSlow('.DetailsPanel .input__soapOperations0service input', 'service1');
      page.setValueSlow('.DetailsPanel .input__soapOperations0port input', '7');
      page.setValueSlow('.DetailsPanel .input__soapOperations0operation input', 'operation1');
      page.click('.DetailsPanel .button__add__operation');
      page.setValueSlow('.DetailsPanel .input__soapOperations1key input', 'key2');
      page.setValueSlow('.DetailsPanel .input__soapOperations1service input', 'service2');
      page.setValueSlow('.DetailsPanel .input__soapOperations1port input', '8');
      page.setValueSlow('.DetailsPanel .input__soapOperations1operation input', 'operation2');
      page.click('.DetailsPanel .button__add__soapHeader');
      page.setValueSlow('.DetailsPanel .input__soapHeaders0elementKey input', 'elKey1');
      page.setValueSlow('.DetailsPanel .input__soapHeaders0elementValue input', 'elVal1');
      page.setValueSlow('.DetailsPanel .input__soapHeaders0prefix input', 'prefix1');
      page.setValueSlow('.DetailsPanel .input__soapHeaders0namespace input', 'namespace1');
      page.click('.DetailsPanel .button__add__soapHeader');
      page.setValueSlow('.DetailsPanel .input__soapHeaders1elementKey input', 'elKey2');
      page.setValueSlow('.DetailsPanel .input__soapHeaders1elementValue input', 'elVal2');
      page.setValueSlow('.DetailsPanel .input__soapHeaders1prefix input', 'prefix2');
      page.setValueSlow('.DetailsPanel .input__soapHeaders1namespace input', 'namespace2');
      page.submitDetailsPanel(page.getDataSourceSelector(1));
      page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
      page.checkEntityDetails({
        text: {
          url: TEST_WSDL,
          wsdl: TEST_WSDL + '?wsdl',
          securityusername: 'testuser',
          securitypassword: 'passwd',
          soapOperations0key: 'key1',
          soapOperations0service: 'service1',
          soapOperations0port: '7',
          soapOperations0operation: 'operation1',
          soapOperations1key: 'key2',
          soapOperations1service: 'service2',
          soapOperations1port: '8',
          soapOperations1operation: 'operation2',
          soapHeaders0elementKey: 'elKey1',
          soapHeaders0elementValue: 'elVal1',
          soapHeaders0prefix: 'prefix1',
          soapHeaders0namespace: 'namespace1',
          soapHeaders1elementKey: 'elKey2',
          soapHeaders1elementValue: 'elVal2',
          soapHeaders1prefix: 'prefix2',
          soapHeaders1namespace: 'namespace2',
        },
        checkbox: {
          remotingEnabled: true,
          wsdl_optionsrejectUnauthorized: true,
          wsdl_optionsstrictSSL: true,
          wsdl_optionsrequestCert: true,
        },
        select: {
          securityscheme: 'WS',
          securitypasswordType: 'PasswordDigest',
        },
        notPresent: [
          '.input__soapOperations2key',
          '.input__soapHeaders2elementKey',
        ],
      });
      page.refresh(function () {
        page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
        page.checkEntityDetails({
          text: {
            url: TEST_WSDL,
            wsdl: TEST_WSDL + '?wsdl',
            securityusername: 'testuser',
            securitypassword: 'passwd',
            soapOperations0key: 'key1',
            soapOperations0service: 'service1',
            soapOperations0port: '7',
            soapOperations0operation: 'operation1',
            soapOperations1key: 'key2',
            soapOperations1service: 'service2',
            soapOperations1port: '8',
            soapOperations1operation: 'operation2',
            soapHeaders0elementKey: 'elKey1',
            soapHeaders0elementValue: 'elVal1',
            soapHeaders0prefix: 'prefix1',
            soapHeaders0namespace: 'namespace1',
            soapHeaders1elementKey: 'elKey2',
            soapHeaders1elementValue: 'elVal2',
            soapHeaders1prefix: 'prefix2',
            soapHeaders1namespace: 'namespace2',
          },
          checkbox: {
            remotingEnabled: true,
            wsdl_optionsrejectUnauthorized: true,
            wsdl_optionsstrictSSL: true,
            wsdl_optionsrequestCert: true,
          },
          select: {
            securityscheme: 'WS',
            securitypasswordType: 'PasswordDigest',
          },
          notPresent: [
            '.input__soapOperations2key',
            '.input__soapHeaders2elementKey',
          ],
        });
        page.selectValueSlow('.DetailsPanel', 'securityscheme', 'BasicAuth');
        page.checkEntityDetails({
          text: {
            securityusername: 'testuser',
            securitypassword: 'passwd',
          },
          notPresent: [
            '.select__securitypasswordType',
          ],
        });
        page.setValueSlow('.DetailsPanel .input__securityusername input', 'bauser');
        page.setValueSlow('.DetailsPanel .input__securitypassword input', 'bapasswd');
        page.click('.DetailsPanel .button__remove__operation0');
        page.click('.DetailsPanel .button__remove__soapHeader0');
        page.submitDetailsPanel(page.getDataSourceSelector(1));
        page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
        page.checkEntityDetails({
          text: {
            url: TEST_WSDL,
            wsdl: TEST_WSDL + '?wsdl',
            securityusername: 'bauser',
            securitypassword: 'bapasswd',
            soapOperations0key: 'key2',
            soapOperations0service: 'service2',
            soapOperations0port: '8',
            soapOperations0operation: 'operation2',
            soapHeaders0elementKey: 'elKey2',
            soapHeaders0elementValue: 'elVal2',
            soapHeaders0prefix: 'prefix2',
            soapHeaders0namespace: 'namespace2',
          },
          checkbox: {
            remotingEnabled: true,
            wsdl_optionsrejectUnauthorized: true,
            wsdl_optionsstrictSSL: true,
            wsdl_optionsrequestCert: true,
          },
          select: {
            securityscheme: 'BasicAuth',
          },
          notPresent: [
            '.input__soapOperations1key',
            '.input__soapHeaders1elementKey',
            '.select__securitypasswordType',
          ],
        });
        page.refresh(function () {
          page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
          page.checkEntityDetails({
            text: {
              url: TEST_WSDL,
              wsdl: TEST_WSDL + '?wsdl',
              securityusername: 'bauser',
              securitypassword: 'bapasswd',
              soapOperations0key: 'key2',
              soapOperations0service: 'service2',
              soapOperations0port: '8',
              soapOperations0operation: 'operation2',
              soapHeaders0elementKey: 'elKey2',
              soapHeaders0elementValue: 'elVal2',
              soapHeaders0prefix: 'prefix2',
              soapHeaders0namespace: 'namespace2',
            },
            checkbox: {
              remotingEnabled: true,
              wsdl_optionsrejectUnauthorized: true,
              wsdl_optionsstrictSSL: true,
              wsdl_optionsrequestCert: true,
            },
            select: {
              securityscheme: 'BasicAuth',
            },
            notPresent: [
              '.input__soapOperations1key',
              '.input__soapHeaders1elementKey',
              '.select__securitypasswordType',
            ],
          });
          page.click('.DetailsPanel .checkbox__remotingEnabled');
          page.click('.DetailsPanel .checkbox__wsdl_optionsrejectUnauthorized');
          page.click('.DetailsPanel .checkbox__wsdl_optionsstrictSSL');
          page.click('.DetailsPanel .checkbox__wsdl_optionsrequestCert');
          page.selectValueSlow('.DetailsPanel', 'securityscheme', 'ClientSSL');
          page.checkEntityDetails({
            notPresent: [
              '.input__securityusername',
              '.input__securitypassword',
              '.select__securitypasswordType',
            ],
          });
          page.setValueSlow('.DetailsPanel .input__securitykeyPath input', 'testKeyPath');
          page.setValueSlow('.DetailsPanel .input__securitycertPath input', 'testCertPath');
          page.click('.DetailsPanel .button__add__operation');
          page.setValueSlow('.DetailsPanel .input__soapOperations1key input', 'key3');
          page.setValueSlow('.DetailsPanel .input__soapOperations1service input', 'service3');
          page.setValueSlow('.DetailsPanel .input__soapOperations1port input', '9');
          page.setValueSlow('.DetailsPanel .input__soapOperations1operation input', 'operation3');
          page.click('.DetailsPanel .button__add__soapHeader');
          page.setValueSlow('.DetailsPanel .input__soapHeaders1elementKey input', 'elKey3');
          page.setValueSlow('.DetailsPanel .input__soapHeaders1elementValue input', 'elVal3');
          page.setValueSlow('.DetailsPanel .input__soapHeaders1prefix input', 'prefix3');
          page.setValueSlow('.DetailsPanel .input__soapHeaders1namespace input', 'namespace3');
          page.submitDetailsPanel(page.getDataSourceSelector(1));
          page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
          page.checkEntityDetails({
            text: {
              url: TEST_WSDL,
              wsdl: TEST_WSDL + '?wsdl',
              securitykeyPath: 'testKeyPath',
              securitycertPath: 'testCertPath',
              soapOperations0key: 'key2',
              soapOperations0service: 'service2',
              soapOperations0port: '8',
              soapOperations0operation: 'operation2',
              soapOperations1key: 'key3',
              soapOperations1service: 'service3',
              soapOperations1port: '9',
              soapOperations1operation: 'operation3',
              soapHeaders0elementKey: 'elKey2',
              soapHeaders0elementValue: 'elVal2',
              soapHeaders0prefix: 'prefix2',
              soapHeaders0namespace: 'namespace2',
              soapHeaders1elementKey: 'elKey3',
              soapHeaders1elementValue: 'elVal3',
              soapHeaders1prefix: 'prefix3',
              soapHeaders1namespace: 'namespace3',
            },
            checkbox: {
              remotingEnabled: false,
              wsdl_optionsrejectUnauthorized: false,
              wsdl_optionsstrictSSL: false,
              wsdl_optionsrequestCert: false,
            },
            select: {
              securityscheme: 'ClientSSL',
            },
            notPresent: [
              '.input__securityusername',
              '.input__securitypassword',
              '.select__securitypasswordType',
              '.input__soapOperations2key',
              '.input__soapHeaders2elementKey',
            ],
          });
          page.refresh(function () {
            page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
            page.checkEntityDetails({
              text: {
                url: TEST_WSDL,
                wsdl: TEST_WSDL + '?wsdl',
                securitykeyPath: 'testKeyPath',
                securitycertPath: 'testCertPath',
                soapOperations0key: 'key2',
                soapOperations0service: 'service2',
                soapOperations0port: '8',
                soapOperations0operation: 'operation2',
                soapOperations1key: 'key3',
                soapOperations1service: 'service3',
                soapOperations1port: '9',
                soapOperations1operation: 'operation3',
                soapHeaders0elementKey: 'elKey2',
                soapHeaders0elementValue: 'elVal2',
                soapHeaders0prefix: 'prefix2',
                soapHeaders0namespace: 'namespace2',
                soapHeaders1elementKey: 'elKey3',
                soapHeaders1elementValue: 'elVal3',
                soapHeaders1prefix: 'prefix3',
                soapHeaders1namespace: 'namespace3',
              },
              checkbox: {
                remotingEnabled: false,
                wsdl_optionsrejectUnauthorized: false,
                wsdl_optionsstrictSSL: false,
                wsdl_optionsrequestCert: false,
              },
              select: {
                securityscheme: 'ClientSSL',
              },
              notPresent: [
                '.input__securityusername',
                '.input__securitypassword',
                '.select__securitypasswordType',
                '.input__soapOperations2key',
                '.input__soapHeaders2elementKey',
              ],
            });
            page.closeDetailsPanel();
            page.close();
          });
        });
      });
    });
  }
};
