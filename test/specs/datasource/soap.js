// var page;
// var entitySelector;
const TEST_WSDL = 'http://www.webservicex.com/globalweather.asmx';

module.exports = {
  '@disabled': true,
  'Datasource: soap': function (browser) {
    var page = browser.page.lunchBadger();
    // entitySelector = page.getDataSourceSelector(1);
    page.open();
    page.testDatasource('soap', [
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
      page.clickVisible('.DetailsPanel .checkbox__remotingEnabled');
      page.clickVisible('.DetailsPanel .checkbox__wsdl_optionsrejectUnauthorized');
      page.clickVisible('.DetailsPanel .checkbox__wsdl_optionsstrictSSL');
      page.clickVisible('.DetailsPanel .checkbox__wsdl_optionsrequestCert');
      page.setValueSlow('.DetailsPanel .input__securityusername input', 'testuser');
      page.setValueSlow('.DetailsPanel .input__securitypassword input', 'passwd');
      page.selectValueSlow('.DetailsPanel', 'securitypasswordType', 'PasswordDigest');
      page.clickVisible('.DetailsPanel .button__add__operation');
      page.setValueSlow('.DetailsPanel .input__soapOperations0key input', 'k1');
      page.setValueSlow('.DetailsPanel .input__soapOperations0service input', 's1');
      page.setValueSlow('.DetailsPanel .input__soapOperations0port input', '7');
      page.setValueSlow('.DetailsPanel .input__soapOperations0operation input', 'o1');
      page.clickVisible('.DetailsPanel .button__add__operation');
      page.setValueSlow('.DetailsPanel .input__soapOperations1key input', 'k2');
      page.setValueSlow('.DetailsPanel .input__soapOperations1service input', 's2');
      page.setValueSlow('.DetailsPanel .input__soapOperations1port input', '8');
      page.setValueSlow('.DetailsPanel .input__soapOperations1operation input', 'o2');
      page.clickVisible('.DetailsPanel .button__add__soapHeader');
      page.setValueSlow('.DetailsPanel .input__soapHeaders0elementKey input', 'ek1');
      page.setValueSlow('.DetailsPanel .input__soapHeaders0elementValue input', 'ev1');
      page.setValueSlow('.DetailsPanel .input__soapHeaders0prefix input', 'p1');
      page.setValueSlow('.DetailsPanel .input__soapHeaders0namespace input', 'n1');
      page.clickVisible('.DetailsPanel .button__add__soapHeader');
      page.setValueSlow('.DetailsPanel .input__soapHeaders1elementKey input', 'ek2');
      page.setValueSlow('.DetailsPanel .input__soapHeaders1elementValue input', 'ev2');
      page.setValueSlow('.DetailsPanel .input__soapHeaders1prefix input', 'p2');
      page.setValueSlow('.DetailsPanel .input__soapHeaders1namespace input', 'n2');
      page.submitDetailsPanel(page.getDataSourceSelector(1));

      page.refresh(function () {
        page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
        page.checkEntityDetails({
          text: {
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
            soapHeaders1namespace: 'n2',
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
        page.clickVisible('.DetailsPanel .button__remove__operation0');
        page.clickVisible('.DetailsPanel .button__remove__soapHeader0');
        page.submitDetailsPanel(page.getDataSourceSelector(1));

        page.refresh(function () {
          page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
          page.checkEntityDetails({
            text: {
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
              soapHeaders0namespace: 'n2',
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
          page.clickVisible('.DetailsPanel .checkbox__remotingEnabled');
          page.clickVisible('.DetailsPanel .checkbox__wsdl_optionsrejectUnauthorized');
          page.clickVisible('.DetailsPanel .checkbox__wsdl_optionsstrictSSL');
          page.clickVisible('.DetailsPanel .checkbox__wsdl_optionsrequestCert');
          page.selectValueSlow('.DetailsPanel', 'securityscheme', 'ClientSSL');
          page.setValueSlow('.DetailsPanel .input__securitykeyPath input', 'testKeyPath');
          page.setValueSlow('.DetailsPanel .input__securitycertPath input', 'testCertPath');
          page.checkEntityDetails({
            text: {
              securitykeyPath: 'testKeyPath',
              securitycertPath: 'testCertPath',
            },
            notPresent: [
              '.input__securityusername',
              '.input__securitypassword',
              '.select__securitypasswordType',
            ],
          });
          page.selectValueSlow('.DetailsPanel', 'securityscheme', 'WS');
          page.setValueSlow('.DetailsPanel .input__securityusername input', 'testuser');
          page.setValueSlow('.DetailsPanel .input__securitypassword input', 'passwd');
          page.clickVisible('.DetailsPanel .button__add__operation');
          page.setValueSlow('.DetailsPanel .input__soapOperations1key input', 'k3');
          page.setValueSlow('.DetailsPanel .input__soapOperations1service input', 's3');
          page.setValueSlow('.DetailsPanel .input__soapOperations1port input', '9');
          page.setValueSlow('.DetailsPanel .input__soapOperations1operation input', 'o3');
          page.clickVisible('.DetailsPanel .button__add__soapHeader');
          page.setValueSlow('.DetailsPanel .input__soapHeaders1elementKey input', 'ek3');
          page.setValueSlow('.DetailsPanel .input__soapHeaders1elementValue input', 'ev3');
          page.setValueSlow('.DetailsPanel .input__soapHeaders1prefix input', 'p3');
          page.setValueSlow('.DetailsPanel .input__soapHeaders1namespace input', 'n3');
          page.submitDetailsPanel(page.getDataSourceSelector(1));

          page.refresh(function () {
            page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
            page.checkEntityDetails({
              text: {
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
                soapHeaders1namespace: 'n3',
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
                '.input__securitykeyPath',
                '.input__securitycertPath',
                '.input__soapOperations2key',
                '.input__soapHeaders2elementKey',
              ],
            });
            page.closeDetailsPanel();
            page.removeEntity(page.getDataSourceSelector(1));
            page.waitForDependencyFinish();
            page.close();
          });
        });
      });
    });
  }
};
