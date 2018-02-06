const customEndpoint1 = 'http://example.com';
const customEndpoint2 = 'http://example.org';

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
    page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
    page.checkEntityDetails({
      text: {
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
        operations0functions0value: 'lat,long',
      },
      checkbox: {
        optionsenabled: false,
        operations0templateoptionsenabled: false,
      },
      select: {
        predefined: 'Google-Maps-Location',
        operations0templatemethod: 'GET',
      },
      notPresent: [
        '.button__remove__operation0',
        '.checkbox__optionsstrictSSL',
        '.checkbox__optionsuseQuerystring',
        '.checkbox__optionsheadersenabled',
        '.input__optionsheadersparams0key',
        '.checkbox__operations0templateoptionsstrictSSL',
        '.checkbox__operations0templateoptionsuseQuerystring',
        '.input__operations0templateheaders2key',
        '.input__operations0templatequery2key',
        '.input__operations0functions1key',
        '.input__operations1templateurl',
      ],
    });

    page.refresh(function () {
      page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
      page.checkEntityDetails({
        text: {
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
          operations0functions0value: 'lat,long',
        },
        checkbox: {
          optionsenabled: false,
          operations0templateoptionsenabled: false,
        },
        select: {
          predefined: 'Google-Maps-Location',
          operations0templatemethod: 'GET',
        },
        notPresent: [
          '.button__remove__operation0',
          '.checkbox__optionsstrictSSL',
          '.checkbox__optionsuseQuerystring',
          '.checkbox__optionsheadersenabled',
          '.input__optionsheadersparams0key',
          '.checkbox__operations0templateoptionsstrictSSL',
          '.checkbox__operations0templateoptionsuseQuerystring',
          '.input__operations0templateheaders2key',
          '.input__operations0templatequery2key',
          '.input__operations0functions1key',
          '.input__operations1templateurl',
        ],
      });
      page.selectValueSlow('.DetailsPanel', 'predefined', 'Google-Maps-GeoCode');
      page.submitDetailsPanel(page.getDataSourceSelector(1));

      page.refresh(function () {
        page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
        page.checkEntityDetails({
          text: {
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
            operations0functions0value: 'street,city,zipcode',
          },
          checkbox: {
            optionsenabled: false,
            operations0templateoptionsenabled: false,
          },
          select: {
            predefined: 'Google-Maps-GeoCode',
            operations0templatemethod: 'GET',
          },
          notPresent: [
            '.button__remove__operation0',
            '.checkbox__optionsstrictSSL',
            '.checkbox__optionsuseQuerystring',
            '.checkbox__optionsheadersenabled',
            '.input__optionsheadersparams0key',
            '.checkbox__operations0templateoptionsstrictSSL',
            '.checkbox__operations0templateoptionsuseQuerystring',
            '.input__operations0templateheaders2key',
            '.input__operations0templatequery3key',
            '.input__operations0functions1key',
            '.input__operations1templateurl',
          ],
        });
        page.selectValueSlow('.DetailsPanel', 'predefined', 'Custom');
        page.submitDetailsPanel(page.getDataSourceSelector(1), ['baseUrl']);
        page.setValueSlow('.DetailsPanel .input__operations0templateurl input', customEndpoint1);
        page.clickSlow('.DetailsPanel .button__add__operation');
        page.setValueSlow('.DetailsPanel .input__operations1templateurl input', customEndpoint2);
        page.submitDetailsPanel(page.getDataSourceSelector(1));

        page.refresh(function () {
          page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
          page.checkEntityDetails({
            text: {
              operations0templateurl: customEndpoint1,
              operations0templateresponsePath: '',
              operations1templateurl: customEndpoint2,
              operations1templateresponsePath: '',
            },
            checkbox: {
              optionsenabled: false,
              operations0templateoptionsenabled: false,
            },
            select: {
              predefined: 'Custom',
              operations0templatemethod: 'GET',
              operations1templatemethod: 'GET',
            },
            notPresent: [
              '.button__remove__operation0',
              '.checkbox__optionsstrictSSL',
              '.checkbox__optionsuseQuerystring',
              '.checkbox__optionsheadersenabled',
              '.input__optionsheadersparams0key',
              '.checkbox__operations0templateoptionsstrictSSL',
              '.checkbox__operations0templateoptionsuseQuerystring',
              '.input__operations0templateheaders0key',
              '.input__operations0templatequery0key',
              '.input__operations0functions0key',
              '.checkbox__operations1templateoptionsstrictSSL',
              '.checkbox__operations1templateoptionsuseQuerystring',
              '.input__operations1templateheaders0key',
              '.input__operations1templatequery0key',
              '.input__operations1functions0key',
              '.input__operations2templateurl',
            ],
          });
          page.clickSlow('.DetailsPanel .checkbox__optionsenabled');
          page.clickSlow('.DetailsPanel .checkbox__optionsstrictSSL');
          page.clickSlow('.DetailsPanel .checkbox__optionsuseQuerystring');
          page.clickSlow('.DetailsPanel .checkbox__optionsheadersenabled');
          page.clickSlow('.DetailsPanel .button__add__optionsHeadersParameter');
          page.setValueSlow('.DetailsPanel .input__optionsheadersparams0key input', 'hpn1');
          page.setValueSlow('.DetailsPanel .input__optionsheadersparams0value input', 'hpv1');
          page.clickSlow('.DetailsPanel .button__add__optionsHeadersParameter');
          page.setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'hpn2');
          page.setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'hpv2');
          page.selectValueSlow('.DetailsPanel', 'operations0templatemethod', 'CONNECT');
          page.setValueSlow('.DetailsPanel .input__operations0templateresponsePath input', '$.test1');
          page.clickSlow('.DetailsPanel .checkbox__operations0templateoptionsenabled');
          page.clickSlow('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL');
          page.clickSlow('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring');
          page.clickSlow('.DetailsPanel .button__add__operation0headersParameter');
          page.setValueSlow('.DetailsPanel .input__operations0templateheaders0key input', 'o1hpn1');
          page.setValueSlow('.DetailsPanel .input__operations0templateheaders0value input', 'o1hpv1');
          page.clickSlow('.DetailsPanel .button__add__operation0headersParameter');
          page.setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'o1hpn2');
          page.setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'o1hpv2');
          page.clickSlow('.DetailsPanel .button__add__operation0queryParameter');
          page.setValueSlow('.DetailsPanel .input__operations0templatequery0key input', 'o1qpn1');
          page.setValueSlow('.DetailsPanel .input__operations0templatequery0value input', '{o1qpv11},{o1qpv12}');
          page.clickSlow('.DetailsPanel .button__add__operation0queryParameter');
          page.setValueSlow('.DetailsPanel .input__operations0templatequery1key input', 'o1qpn2');
          page.setValueSlow('.DetailsPanel .input__operations0templatequery1value input', '{o1qpv21},{o1qpv22}');
          page.clickSlow('.DetailsPanel .button__add__operation0function');
          page.setValueSlow('.DetailsPanel .input__operations0functions0key input', 'o1fn1');
          page.setValueSlow('.DetailsPanel .input__operations0functions0value input', 'o1qpv11 ,  o1qpv12');
          page.clickSlow('.DetailsPanel .button__add__operation0function');
          page.setValueSlow('.DetailsPanel .input__operations0functions1key input', 'o1fn2');
          page.setValueSlow('.DetailsPanel .input__operations0functions1value input', 'o1qpv21,  o1qpv22');
          page.selectValueSlow('.DetailsPanel', 'operations1templatemethod', 'OPTIONS');
          page.setValueSlow('.DetailsPanel .input__operations1templateresponsePath input', '$.test2');
          page.clickSlow('.DetailsPanel .checkbox__operations1templateoptionsenabled');
          page.clickSlow('.DetailsPanel .checkbox__operations1templateoptionsstrictSSL');
          page.clickSlow('.DetailsPanel .checkbox__operations1templateoptionsuseQuerystring');
          page.clickSlow('.DetailsPanel .button__add__operation1headersParameter');
          page.setValueSlow('.DetailsPanel .input__operations1templateheaders0key input', 'o2hpn1');
          page.setValueSlow('.DetailsPanel .input__operations1templateheaders0value input', 'o2hpv1');
          page.clickSlow('.DetailsPanel .button__add__operation1headersParameter');
          page.setValueSlow('.DetailsPanel .input__operations1templateheaders1key input', 'o2hpn2');
          page.setValueSlow('.DetailsPanel .input__operations1templateheaders1value input', 'o2hpv2');
          page.clickSlow('.DetailsPanel .button__add__operation1queryParameter');
          page.setValueSlow('.DetailsPanel .input__operations1templatequery0key input', 'o2qpn1');
          page.setValueSlow('.DetailsPanel .input__operations1templatequery0value input', '{o2qpv11},{o2qpv12}');
          page.clickSlow('.DetailsPanel .button__add__operation1queryParameter');
          page.setValueSlow('.DetailsPanel .input__operations1templatequery1key input', 'o2qpn2');
          page.setValueSlow('.DetailsPanel .input__operations1templatequery1value input', '{o2qpv21},{o2qpv22}');
          page.clickSlow('.DetailsPanel .button__add__operation1function');
          page.setValueSlow('.DetailsPanel .input__operations1functions0key input', 'o2fn1');
          page.setValueSlow('.DetailsPanel .input__operations1functions0value input', 'o2qpv11 ,  o2qpv12');
          page.clickSlow('.DetailsPanel .button__add__operation1function');
          page.setValueSlow('.DetailsPanel .input__operations1functions1key input', 'o2fn2');
          page.setValueSlow('.DetailsPanel .input__operations1functions1value input', 'o2qpv21,  o2qpv22');
          page.submitDetailsPanel(page.getDataSourceSelector(1));

          page.refresh(function () {
            page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
            page.checkEntityDetails({
              text: {
                optionsheadersparams0key: 'hpn1',
                optionsheadersparams0value: 'hpv1',
                optionsheadersparams1key: 'hpn2',
                optionsheadersparams1value: 'hpv2',
                operations0templateurl: customEndpoint1,
                operations0templateresponsePath: '$.test1',
                operations0templateheaders0key: 'o1hpn1',
                operations0templateheaders0value: 'o1hpv1',
                operations0templateheaders1key: 'o1hpn2',
                operations0templateheaders1value: 'o1hpv2',
                operations0templatequery0key: 'o1qpn1',
                operations0templatequery0value: '{o1qpv11},{o1qpv12}',
                operations0templatequery1key: 'o1qpn2',
                operations0templatequery1value: '{o1qpv21},{o1qpv22}',
                operations0functions0key: 'o1fn1',
                operations0functions0value: 'o1qpv11,o1qpv12',
                operations0functions1key: 'o1fn2',
                operations0functions1value: 'o1qpv21,o1qpv22',
                operations1templateurl: customEndpoint2,
                operations1templateresponsePath: '$.test2',
                operations1templateheaders0key: 'o2hpn1',
                operations1templateheaders0value: 'o2hpv1',
                operations1templateheaders1key: 'o2hpn2',
                operations1templateheaders1value: 'o2hpv2',
                operations1templatequery0key: 'o2qpn1',
                operations1templatequery0value: '{o2qpv11},{o2qpv12}',
                operations1templatequery1key: 'o2qpn2',
                operations1templatequery1value: '{o2qpv21},{o2qpv22}',
                operations1functions0key: 'o2fn1',
                operations1functions0value: 'o2qpv11,o2qpv12',
                operations1functions1key: 'o2fn2',
                operations1functions1value: 'o2qpv21,o2qpv22',
              },
              checkbox: {
                optionsenabled: true,
                optionsstrictSSL: true,
                optionsuseQuerystring: true,
                optionsheadersenabled: true,
                operations0templateoptionsenabled: true,
                operations0templateoptionsstrictSSL: true,
                operations0templateoptionsuseQuerystring: true,
                operations1templateoptionsenabled: true,
                operations1templateoptionsstrictSSL: true,
                operations1templateoptionsuseQuerystring: true,
              },
              select: {
                predefined: 'Custom',
                operations0templatemethod: 'CONNECT',
                operations1templatemethod: 'OPTIONS',
              },
              notPresent: [
                '.button__remove__operation0',
                '.input__optionsheadersparams2key',
                '.input__operations0templateheaders2key',
                '.input__operations0templatequery2key',
                '.input__operations0functions2key',
                '.input__operations1templateheaders2key',
                '.input__operations1templatequery2key',
                '.input__operations1functions2key',
                '.input__operations2templateurl',
              ],
            });
            page.clickSlow('.DetailsPanel .checkbox__optionsstrictSSL');
            page.clickSlow('.DetailsPanel .checkbox__optionsuseQuerystring');
            page.clickSlow('.DetailsPanel .button__remove__optionsHeadersParameter0');
            page.clickSlow('.DetailsPanel .button__add__optionsHeadersParameter');
            page.setValueSlow('.DetailsPanel .input__optionsheadersparams1key input', 'hpn3');
            page.setValueSlow('.DetailsPanel .input__optionsheadersparams1value input', 'hpv3');
            page.clickSlow('.DetailsPanel .checkbox__operations0templateoptionsstrictSSL');
            page.clickSlow('.DetailsPanel .checkbox__operations0templateoptionsuseQuerystring');
            page.clickSlow('.DetailsPanel .button__remove__operation0headersParameter0');
            page.clickSlow('.DetailsPanel .button__add__operation0headersParameter');
            page.setValueSlow('.DetailsPanel .input__operations0templateheaders1key input', 'o1hpn3');
            page.setValueSlow('.DetailsPanel .input__operations0templateheaders1value input', 'o1hpv3');
            page.clickSlow('.DetailsPanel .button__remove__operation0queryParameter0');
            page.clickSlow('.DetailsPanel .button__add__operation0queryParameter');
            page.setValueSlow('.DetailsPanel .input__operations0templatequery1key input', 'o1qpn3');
            page.setValueSlow('.DetailsPanel .input__operations0templatequery1value input', '{o1qpv31},{o1qpv32}');
            page.clickSlow('.DetailsPanel .button__remove__operation0function0');
            page.clickSlow('.DetailsPanel .button__add__operation0function');
            page.setValueSlow('.DetailsPanel .input__operations0functions1key input', 'o1fn3');
            page.setValueSlow('.DetailsPanel .input__operations0functions1value input', 'o1qpv31 ,  o1qpv32');
            page.clickSlow('.DetailsPanel .checkbox__operations1templateoptionsstrictSSL');
            page.clickSlow('.DetailsPanel .checkbox__operations1templateoptionsuseQuerystring');
            page.clickSlow('.DetailsPanel .button__remove__operation1headersParameter0');
            page.clickSlow('.DetailsPanel .button__add__operation1headersParameter');
            page.setValueSlow('.DetailsPanel .input__operations1templateheaders1key input', 'o2hpn3');
            page.setValueSlow('.DetailsPanel .input__operations1templateheaders1value input', 'o2hpv3');
            page.clickSlow('.DetailsPanel .button__remove__operation1queryParameter0');
            page.clickSlow('.DetailsPanel .button__add__operation1queryParameter');
            page.setValueSlow('.DetailsPanel .input__operations1templatequery1key input', 'o2qpn3');
            page.setValueSlow('.DetailsPanel .input__operations1templatequery1value input', '{o2qpv31},{o2qpv32}');
            page.clickSlow('.DetailsPanel .button__remove__operation1function0');
            page.clickSlow('.DetailsPanel .button__add__operation1function');
            page.setValueSlow('.DetailsPanel .input__operations1functions1key input', 'o2fn3');
            page.setValueSlow('.DetailsPanel .input__operations1functions1value input', 'o2qpv31 ,  o2qpv32');
            page.submitDetailsPanel(page.getDataSourceSelector(1));

            page.refresh(function () {
              page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
              page.checkEntityDetails({
                text: {
                  optionsheadersparams0key: 'hpn2',
                  optionsheadersparams0value: 'hpv2',
                  optionsheadersparams1key: 'hpn3',
                  optionsheadersparams1value: 'hpv3',
                  operations0templateurl: customEndpoint1,
                  operations0templateresponsePath: '$.test1',
                  operations0templateheaders0key: 'o1hpn2',
                  operations0templateheaders0value: 'o1hpv2',
                  operations0templateheaders1key: 'o1hpn3',
                  operations0templateheaders1value: 'o1hpv3',
                  operations0templatequery0key: 'o1qpn2',
                  operations0templatequery0value: '{o1qpv21},{o1qpv22}',
                  operations0templatequery1key: 'o1qpn3',
                  operations0templatequery1value: '{o1qpv31},{o1qpv32}',
                  operations0functions0key: 'o1fn2',
                  operations0functions0value: 'o1qpv21,o1qpv22',
                  operations0functions1key: 'o1fn3',
                  operations0functions1value: 'o1qpv31,o1qpv32',
                  operations1templateurl: customEndpoint2,
                  operations1templateresponsePath: '$.test2',
                  operations1templateheaders0key: 'o2hpn2',
                  operations1templateheaders0value: 'o2hpv2',
                  operations1templateheaders1key: 'o2hpn3',
                  operations1templateheaders1value: 'o2hpv3',
                  operations1templatequery0key: 'o2qpn2',
                  operations1templatequery0value: '{o2qpv21},{o2qpv22}',
                  operations1templatequery1key: 'o2qpn3',
                  operations1templatequery1value: '{o2qpv31},{o2qpv32}',
                  operations1functions0key: 'o2fn2',
                  operations1functions0value: 'o2qpv21,o2qpv22',
                  operations1functions1key: 'o2fn3',
                  operations1functions1value: 'o2qpv31,o2qpv32',
                },
                checkbox: {
                  optionsenabled: true,
                  optionsstrictSSL: false,
                  optionsuseQuerystring: false,
                  optionsheadersenabled: true,
                  operations0templateoptionsenabled: true,
                  operations0templateoptionsstrictSSL: false,
                  operations0templateoptionsuseQuerystring: false,
                  operations1templateoptionsenabled: true,
                  operations1templateoptionsstrictSSL: false,
                  operations1templateoptionsuseQuerystring: false,
                },
                select: {
                  predefined: 'Custom',
                  operations0templatemethod: 'CONNECT',
                  operations1templatemethod: 'OPTIONS',
                },
                notPresent: [
                  '.button__remove__operation0',
                  '.input__optionsheadersparams2key',
                  '.input__operations0templateheaders2key',
                  '.input__operations0templatequery2key',
                  '.input__operations0functions2key',
                  '.input__operations1templateheaders2key',
                  '.input__operations1templatequery2key',
                  '.input__operations1functions2key',
                  '.input__operations2templateurl',
                ],
              });
              page.clickSlow('.DetailsPanel .checkbox__optionsheadersenabled');
              page.clickSlow('.DetailsPanel .button__remove__operation1');
              page.clickSlow('.DetailsPanel .checkbox__operations0templateoptionsenabled');
              page.clickSlow('.DetailsPanel .button__remove__operation0headersParameter0');
              page.clickSlow('.DetailsPanel .button__remove__operation0queryParameter0');
              page.clickSlow('.DetailsPanel .button__remove__operation0function0');
              page.submitDetailsPanel(page.getDataSourceSelector(1));

              page.refresh(function () {
                page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
                page.checkEntityDetails({
                  text: {
                    operations0templateurl: customEndpoint1,
                    operations0templateresponsePath: '$.test1',
                    operations0templateheaders0key: 'o1hpn3',
                    operations0templateheaders0value: 'o1hpv3',
                    operations0templatequery0key: 'o1qpn3',
                    operations0templatequery0value: '{o1qpv31},{o1qpv32}',
                    operations0functions0key: 'o1fn3',
                    operations0functions0value: 'o1qpv31,o1qpv32',
                  },
                  checkbox: {
                    optionsenabled: true,
                    optionsstrictSSL: false,
                    optionsuseQuerystring: false,
                    optionsheadersenabled: false,
                    operations0templateoptionsenabled: false,
                  },
                  select: {
                    predefined: 'Custom',
                    operations0templatemethod: 'CONNECT',
                  },
                  notPresent: [
                    '.button__remove__operation0',
                    '.checkbox__operations0templateoptionsstrictSSL',
                    '.checkbox__operations0templateoptionsuseQuerystring',
                    '.input__optionsheadersparams0key',
                    '.input__operations0templateheaders1key',
                    '.input__operations0templatequery1key',
                    '.input__operations0functions1key',
                    '.input__operations1templateurl',
                  ],
                });
                page.clickSlow('.DetailsPanel .checkbox__optionsenabled');
                page.clickSlow('.DetailsPanel .button__remove__operation0headersParameter0');
                page.clickSlow('.DetailsPanel .button__remove__operation0queryParameter0');
                page.clickSlow('.DetailsPanel .button__remove__operation0function0');
                page.submitDetailsPanel(page.getDataSourceSelector(1));

                page.refresh(function () {
                  page.openEntityInDetailsPanel(page.getDataSourceSelector(1));
                  page.checkEntityDetails({
                    text: {
                      operations0templateurl: customEndpoint1,
                      operations0templateresponsePath: '$.test1',
                    },
                    checkbox: {
                      optionsenabled: false,
                      operations0templateoptionsenabled: false,
                    },
                    select: {
                      predefined: 'Custom',
                      operations0templatemethod: 'CONNECT',
                    },
                    notPresent: [
                      '.checkbox__optionsstrictSSL',
                      '.checkbox__optionsuseQuerystring',
                      '.checkbox__optionsheadersenabled',
                      '.button__remove__operation0',
                      '.checkbox__operations0templateoptionsstrictSSL',
                      '.checkbox__operations0templateoptionsuseQuerystring',
                      '.input__optionsheadersparams0key',
                      '.input__operations0templateheaders0key',
                      '.input__operations0templatequery0key',
                      '.input__operations0functions0key',
                      '.input__operations1templateurl',
                    ],
                  });
                  page.closeDetailsPanel();
                  page.removeEntity(page.getDataSourceSelector(1));
                  page.waitForUninstallDependency();
                  page.close();
                });
              });
            });
          });
        });
      });
    });
  }
};
