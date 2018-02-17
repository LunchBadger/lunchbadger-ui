const request = require('request');

var page;
var memorySelector;
var modelSelector;
var serviceEndpointSelector;
var gatewaySelector;
var apiEndpointModelSelector;
var apiEndpointServiceEndpointSelector;
var SERVICE_ENDPOINT_URL = 'https://httpbin.org';
var SERVICE_ENDPOINT_RESPONSE = `User-agent: *
Disallow: /deny
`;
var MEMORY_NAME;
var MODEL_NAME;
var GATEWAY_NAME;
var SERVICE_ENDPOINT_NAME;
var API_ENDPOINT_1_NAME;
var API_ENDPOINT_2_NAME;
var GATEWAY_MODEL_URL;
var GATEWAY_SERVICE_ENDPOINT_URL;
var url;
var model;
var color;
var form;
var expectedModelJSON;

module.exports = {
  // '@disabled': true,
  'EG integration: deploy gateway': function (browser) {
    page = browser.page.lunchBadger();
    memorySelector = page.getDataSourceSelector(1);
    modelSelector = page.getModelSelector(1);
    serviceEndpointSelector = page.getServiceEndpointSelector(2);
    gatewaySelector = page.getGatewaySelector(1);
    apiEndpointModelSelector = page.getApiEndpointSelector(1);
    apiEndpointServiceEndpointSelector = page.getApiEndpointSelector(2);
    MEMORY_NAME = page.getUniqueName('memory');
    MODEL_NAME = page.getUniqueName('car');
    GATEWAY_NAME = page.getUniqueName('gateway');
    SERVICE_ENDPOINT_NAME = page.getUniqueName('endpoint');
    API_ENDPOINT_1_NAME = `${MODEL_NAME}ApiEndpoint`;
    API_ENDPOINT_2_NAME = `${SERVICE_ENDPOINT_NAME}ApiEndpoint`;
    GATEWAY_MODEL_URL = `http://${GATEWAY_NAME}-test-dev.staging.lunchbadger.io/api/${MODEL_NAME}`;
    GATEWAY_SERVICE_ENDPOINT_URL = `http://${GATEWAY_NAME}-test-dev.staging.lunchbadger.io/robots.txt`;
    url = `http://test-dev.staging.lunchbadger.io/api/${MODEL_NAME}`;
    model = page.getUniqueName('model');
    color = page.getUniqueName('color');
    form = {model, color};
    expectedModelJSON = JSON.stringify(Object.assign({}, form, {id: 1}));
    page
      .open()
      .addElement('gateway')
      .setValueSlow(gatewaySelector + ' .input__name input', GATEWAY_NAME)
      .removePipeline(gatewaySelector, 0)
      .addPipeline(gatewaySelector, 0, 'FirstPipeline')
      .addPolicy(gatewaySelector, 0, 0, 'proxy')
      .addPolicy(gatewaySelector, 0, 1, 'basic-auth')
      .submitGatewayDeploy(gatewaySelector, GATEWAY_NAME)
      .openPipelinesInDetailsPanel(gatewaySelector);
  },
  'EG integration: condition schema parameters': function () {
    page
      .addPolicyCAPair(0, 1, 0)
      .addPolicyCAPair(0, 1, 1)
      .setConditionName(0, 1, 1, 'n', 0, 'never')
      .addPolicyCAPair(0, 1, 2)
      .setConditionName(0, 1, 2, '', 2, 'pathMatch', 'pattern')
      .setConditionParameter(0, 1, 2, 'pattern', '/path*')
      .addPolicyCAPair(0, 1, 3)
      .setConditionName(0, 1, 3, 'e', 1, 'pathExact', 'path')
      .setConditionParameter(0, 1, 3, 'path', '/path')
      .addPolicyCAPair(0, 1, 4)
      .setConditionName(0, 1, 4, 'm', 1, 'method')
      .addPolicyCAPair(0, 1, 5)
      .setConditionName(0, 1, 5, '', 5, 'hostMatch', 'pattern')
      .setConditionParameter(0, 1, 5, 'pattern', '/host*')
      .addPolicyCAPair(0, 1, 6)
      .setConditionName(0, 1, 6, 'e', 3, 'expression', 'expression')
      .setConditionParameter(0, 1, 6, 'expression', 'var a = 1;')
      .addPolicyCAPair(0, 1, 7)
      .setConditionName(0, 1, 7, 'h', 4, 'authenticated')
      .addPolicyCAPair(0, 1, 8)
      .setConditionName(0, 1, 8, 's', 3, 'anonymous')
      .addPolicyCAPair(0, 1, 9)
      .setConditionName(0, 1, 9, 'a', 6, 'ALL OF', 'conditions0name')
      .addPolicyCAPair(0, 1, 10)
      .setConditionName(0, 1, 10, 'f', 1, 'ONE OF', 'conditions0name')
      .addPolicyCAPair(0, 1, 11)
      .setConditionName(0, 1, 11, 'not', 0, 'NOT')
      .addPolicyCAPair(0, 1, 12)
      .setConditionName(0, 1, 12, 'myParam', 0, 'myParam')
      .addConditionCustomParameter(0, 1, 12, 'string', 0)
      .setConditionCustomParameterName(0, 1, 12, 0, 'myString')
      .setConditionCustomParameterValue(0, 1, 12, 'myString', 'myValue', 'text')
      .addConditionCustomParameter(0, 1, 12, 'string', 1)
      .setConditionCustomParameterName(0, 1, 12, 1, 'myString2')
      .setConditionCustomParameterValue(0, 1, 12, 'myString2', 'myValue2', 'text')
      .addConditionCustomParameter(0, 1, 12, 'integer', 2)
      .setConditionCustomParameterName(0, 1, 12, 2, 'myInt')
      .setConditionCustomParameterValue(0, 1, 12, 'myInt', '12', 'number')
      .addConditionCustomParameter(0, 1, 12, 'integer', 3)
      .setConditionCustomParameterName(0, 1, 12, 3, 'myInt2')
      .setConditionCustomParameterValue(0, 1, 12, 'myInt2', '23', 'number')
      .addConditionCustomParameter(0, 1, 12, 'boolean', 4)
      .setConditionCustomParameterName(0, 1, 12, 4, 'myBool')
      .clickConditionCustomParameterBoolean(0, 1, 12, 'myBool')
      .addConditionCustomParameter(0, 1, 12, 'boolean', 5)
      .setConditionCustomParameterName(0, 1, 12, 5, 'myBool2')
      .clickConditionCustomParameterBoolean(0, 1, 12, 'myBool2')
      .addConditionCustomParameter(0, 1, 12, 'array', 6)
      .setConditionCustomParameterName(0, 1, 12, 6, 'myArr')
      .setConditionCustomParameterEnum(0, 1, 12, 'myArr', ['one', 'two', 'three'])
      .checkPipelines(gatewaySelector, expectConditionsPlain)
  },
  'EG integration: remove custom params': function () {
    page
      .removeConditionCustomParameter(0, 1, 12, 1)
      .removeConditionCustomParameter(0, 1, 12, 2)
      .checkPipelines(gatewaySelector, expectCustomConditionsRemoved)
  },
  'EG integration: custom params into allOf': function () {
    page
      .setConditionName(0, 1, 12, 'a', 6, 'ALL OF', 'conditions0name')
      .checkPipelines(gatewaySelector, expectCustomConditions)
  },
  'EG integration: remove C/A pair': function () {
    page
      .removeCondition(0, 1, 12)
      .checkPipelines(gatewaySelector, expectCustomParamsRemoved)
  },
  'EG integration: C/A reordering': function () {
    page
      .check({
        present: [
          '.DetailsPanel .button__moveUp__pipelines0policies1pairs0.disabled',
          '.DetailsPanel .button__moveDown__pipelines0policies1pairs11.disabled'
        ]
      })
      .moveCAPairDown(0, 1, 0)
      .moveCAPairDown(0, 1, 1)
      .moveCAPairUp(0, 1, 1)
      .moveCAPairUp(0, 1, 11)
      .moveCAPairUp(0, 1, 10)
      .moveCAPairDown(0, 1, 10)
      .checkPipelines(gatewaySelector, expectConditionsReordered)
  },
  'EG integration: conditions change': function () {
    page
      .setConditionName(0, 1, 0, '', 5, 'hostMatch', 'pattern')
      .setConditionParameter(0, 1, 0, 'pattern', '/wasPathMatch*')
      .setConditionName(0, 1, 1, 'a', 6, 'ALL OF', 'conditions0name')
      .setConditionParameter(0, 1, 3, 'path', '/somePath')
      .setConditionName(0, 1, 5, 'e', 1, 'pathExact', 'path')
      .setConditionParameter(0, 1, 5, 'path', '/exact')
      .setConditionName(0, 1, 10, 'e', 1, 'pathExact', 'path')
      .setConditionParameter(0, 1, 10, 'path', '/wasAllOf')
      .checkPipelines(gatewaySelector, expectConditionsChanged)
  },
  'EG integration: remove conditions': function () {
    page
      .removeCondition(0, 1, 0)
      .removeCondition(0, 1, 10)
      .removeCondition(0, 1, 9)
      .removeCondition(0, 1, 1)
      .removeCondition(0, 1, 3)
      .removeCondition(0, 1, 0)
      .removeCondition(0, 1, 0)
      .removeCondition(0, 1, 1)
      .removeCondition(0, 1, 1)
      .removeCondition(0, 1, 2)
      .removeCondition(0, 1, 1)
      .checkPipelines(gatewaySelector, expectConditionsRemoved)
  },
  'EG integration: method autocomplete add': function () {
    page
      .setEnum(0, 1, 0, 'methods', [['g', 0], ['g', 0], ['h', 2], ['', 0], ['del', 1], ['del', 0]], 'g GET HEAD OPTIONS del DELETE')
      .checkPipelines(gatewaySelector, expectMethodEnumAdded)
  },
  'EG integration: method autocomplete delete by icon': function () {
    page
      .deleteEnumByClick(0, 1, 0, 'methods', [2, 3, 4], 'g HEAD del')
      .checkPipelines(gatewaySelector, expectMethodEnumDeletedByClick)
  },
  'EG integration: method autocomplete delete by keyboard': function () {
    page
      .deleteEnumByKeyPress(0, 1, 0, 'methods', 1, 'g HEAD')
      .checkPipelines(gatewaySelector, expectMethodEnumDeletedByKeyPress)
  },
  'EG integration: method autocomplete change': function () {
    page
      .setEnum(0, 1, 0, 'methods', [['p', 0], ['', 0], ['', 0]], 'g HEAD p GET POST')
      .checkPipelines(gatewaySelector, expectMethodEnumChanged)
  },
  'EG integration: into allOf': function () {
    page
      .setConditionName(0, 1, 0, 'a', 6, 'ALL OF', 'conditions0name')
      .checkPipelines(gatewaySelector, expectIntoAllOf)
  },
  'EG integration: add allOf conditions': function () {
    page
      .addSubCondition(0, 1, 0)
      .setConditionName(0, 1, 0, 'a', 6, 'ALL OF', 'conditions0name', 'conditions1')
      .addSubCondition(0, 1, 0)
      .setConditionName(0, 1, 0, 'e', 1, 'pathExact', 'conditions2path', 'conditions2')
      .setConditionParameter(0, 1, 0, 'path', '/a', 'conditions2')
      .addSubCondition(0, 1, 0)
      .setConditionName(0, 1, 0, '', 5, 'hostMatch', 'conditions3pattern', 'conditions3')
      .setConditionParameter(0, 1, 0, 'pattern', '/a*', 'conditions3')
      .checkPipelines(gatewaySelector, expectAddedAllOf)
  },

  'EG integration: edit allOf conditions': function () {
    page
      .addSubCondition(0, 1, 0)
      .setConditionName(0, 1, 0, 'e', 1, 'pathExact', 'conditions4path', 'conditions4')
      .setConditionParameter(0, 1, 0, 'path', '/last', 'conditions4')
      .removeSubCondition(0, 1, 0, 2)
      .setConditionName(0, 1, 0, 'a', 6, 'ALL OF', 'conditions0name', 'conditions0')
      .setConditionName(0, 1, 0, 'f', 1, 'ONE OF', 'conditions1name', 'conditions1')
      .addSubCondition(0, 1, 0, 'conditions1')
      .addSubCondition(0, 1, 0, 'conditions1')
      .setConditionName(0, 1, 0, 'e', 1, 'pathExact', 'conditions1conditions1path', 'conditions1conditions1')
      .setConditionParameter(0, 1, 0, 'path', '/afterAlways', 'conditions1conditions1')
      .setConditionName(0, 1, 0, 'e', 1, 'pathExact', 'conditions1conditions2path', 'conditions1conditions2')
      .setConditionParameter(0, 1, 0, 'path', '/afterPathExact', 'conditions1conditions2')
      .checkPipelines(gatewaySelector, expectChangedAllOf)
  },
  'EG integration: remove allOf conditions': function () {
    page
      .removeSubCondition(0, 1, 0, 2)
      .removeSubCondition(0, 1, 0, 1, 'conditions1')
      .checkPipelines(gatewaySelector, expectRemovedAllOf)
  },
  'EG integration: remove pipeline on canvas': function () {
    page
      .closeDetailsPanel()
      .editEntity(gatewaySelector)
      .removePipeline(gatewaySelector, 0)
      .submitCanvasEntity(gatewaySelector)
  },
  'EG integration: add proxy pipelines': function () {
    page
      .editEntity(gatewaySelector)
      .addPipeline(gatewaySelector, 0, 'ModelProxy')
      .addPipeline(gatewaySelector, 1, 'ServiceEndpointProxy')
      .addPolicy(gatewaySelector, 0, 0, 'proxy')
      .addPolicy(gatewaySelector, 1, 0, 'proxy')
      .submitCanvasEntity(gatewaySelector);
  },
  'EG integration: add datasource': function () {
    page
      .addElementFromTooltip('dataSource', 'memory')
      .setValueSlow(memorySelector + ' .input__name input', MEMORY_NAME)
      .submitCanvasEntity(memorySelector);
  },
  'EG integration: add model': function () {
    page
      .addElement('model')
      .setValueSlow(modelSelector + ' .input__name input', MODEL_NAME)
      .clickPresent(modelSelector + ' .button__add__Properties')
      .setValueSlow(modelSelector + ' .input__properties0name input', 'model')
      .clickPresent(modelSelector + ' .button__add__Properties')
      .setValueSlow(modelSelector + ' .input__properties1name input', 'color')
      .submitCanvasEntity(modelSelector);
  },
  'EG integration: connect datasource and model': function () {
    page
      .connectPorts(memorySelector, 'out', modelSelector, 'in');
  },
  'EG integration: add service endpoint': function () {
    page
      .addElementFromTooltip('endpoint', 'serviceendpoint')
      .setValueSlow(serviceEndpointSelector + ' .input__name input', SERVICE_ENDPOINT_NAME)
      .setValueSlow(serviceEndpointSelector + ' .input__urls0 input', SERVICE_ENDPOINT_URL)
      .submitCanvasEntity(serviceEndpointSelector);
  },
  'EG integration: proxy model': function () {
    page
      .connectPorts(modelSelector, 'out', gatewaySelector, 'in', 0)
      .waitForElementVisible(apiEndpointModelSelector + ' .EntityHeader .EntityProperty__field--input input', 60000)
      .check({
        value: {
          [`${apiEndpointModelSelector} .EntityHeader .EntityProperty__field--input input`]: API_ENDPOINT_1_NAME
        }
      })
      .clickPresent(apiEndpointModelSelector + ' .button__add__PATHS')
      .setValueSlow(apiEndpointModelSelector + ' .input__paths0 input', `/api/${MODEL_NAME}*`)
      .submitCanvasEntity(apiEndpointModelSelector);
  },
  'EG integration: proxy service endpoint': function () {
    page
      .connectPorts(serviceEndpointSelector, 'out', gatewaySelector, 'in', 1)
      .waitForElementVisible(apiEndpointServiceEndpointSelector + ' .EntityHeader .EntityProperty__field--input input', 60000)
      .check({
        value: {
          [`${apiEndpointServiceEndpointSelector} .EntityHeader .EntityProperty__field--input input`]: API_ENDPOINT_2_NAME
        }
      })
      .clickPresent(apiEndpointServiceEndpointSelector + ' .button__add__PATHS')
      .setValueSlow(apiEndpointServiceEndpointSelector + ' .input__paths0 input', '/robots*')
      .submitCanvasEntity(apiEndpointServiceEndpointSelector)
      .saveProject()
      .pause(30000);
  },
  'EG integration: api calls': function () {
    page
      .waitForElementNotPresent(gatewaySelector + '.semitransparent', 60000);
    request.put({url, form}, (err, res, putBody) => {
      page
        .check({
          equal: [[putBody, expectedModelJSON]]
        });
      console.log('GET MODEL', GATEWAY_MODEL_URL);
      request(GATEWAY_MODEL_URL, function (errModel, resModel, getModelBody) {
        page
          .check({
            equal: [[getModelBody, `[${expectedModelJSON}]`]]
          });
        console.log('GET SE', GATEWAY_SERVICE_ENDPOINT_URL)
        request(GATEWAY_SERVICE_ENDPOINT_URL, function (errSE, resSE, getServiceEndpointBody) {
          page
            .check({
              equal: [[getServiceEndpointBody, SERVICE_ENDPOINT_RESPONSE]]
            });
        });
      });
    });
  },
  after: function () {
    page
      .pause(10000)
      .close();
  }
};

const expectConditionsPlain = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'always'
            },
            action: {}
          },
          {
            condition: {
              name: 'never'
            }
          },
          {
            condition: {
              name: 'pathMatch',
              pattern: '/path*'
            }
          },
          {
            condition: {
              name: 'pathExact',
              path: '/path'
            }
          },
          {
            condition: {
              name: 'method'
            }
          },
          {
            condition: {
              name: 'hostMatch',
              pattern: '/host*'
            }
          },
          {
            condition: {
              name: 'expression',
              expression: 'var a = 1;'
            }
          },
          {
            condition: {
              name: 'authenticated'
            }
          },
          {
            condition: {
              name: 'anonymous'
            }
          },
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'ONE OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'NOT'
            }
          },
          {
            condition: {
              name: 'myParam',
              myString: 'myValue',
              myString2: 'myValue2',
              myInt: 12,
              myInt2: 23,
              myBool: true,
              myBool2: true,
              myArr: ['one two three']
            }
          }
        ]
      }
    ]
  }
];
const expectCustomConditionsRemoved = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'always'
            },
            action: {}
          },
          {
            condition: {
              name: 'never'
            }
          },
          {
            condition: {
              name: 'pathMatch',
              pattern: '/path*'
            }
          },
          {
            condition: {
              name: 'pathExact',
              path: '/path'
            }
          },
          {
            condition: {
              name: 'method'
            }
          },
          {
            condition: {
              name: 'hostMatch',
              pattern: '/host*'
            }
          },
          {
            condition: {
              name: 'expression',
              expression: 'var a = 1;'
            }
          },
          {
            condition: {
              name: 'authenticated'
            }
          },
          {
            condition: {
              name: 'anonymous'
            }
          },
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'ONE OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'NOT'
            }
          },
          {
            condition: {
              name: 'myParam',
              myString: 'myValue',
              myInt: 12,
              myBool: true,
              myBool2: true,
              myArr: ['one two three']
            }
          }
        ]
      }
    ]
  }
];
const expectCustomParamsRemoved = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'always'
            },
            action: {}
          },
          {
            condition: {
              name: 'never'
            }
          },
          {
            condition: {
              name: 'pathMatch',
              pattern: '/path*'
            }
          },
          {
            condition: {
              name: 'pathExact',
              path: '/path'
            }
          },
          {
            condition: {
              name: 'method'
            }
          },
          {
            condition: {
              name: 'hostMatch',
              pattern: '/host*'
            }
          },
          {
            condition: {
              name: 'expression',
              expression: 'var a = 1;'
            }
          },
          {
            condition: {
              name: 'authenticated'
            }
          },
          {
            condition: {
              name: 'anonymous'
            }
          },
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'ONE OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'NOT'
            }
          }
        ]
      }
    ]
  }
];
const expectCustomConditions = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'always'
            },
            action: {}
          },
          {
            condition: {
              name: 'never'
            }
          },
          {
            condition: {
              name: 'pathMatch',
              pattern: '/path*'
            }
          },
          {
            condition: {
              name: 'pathExact',
              path: '/path'
            }
          },
          {
            condition: {
              name: 'method'
            }
          },
          {
            condition: {
              name: 'hostMatch',
              pattern: '/host*'
            }
          },
          {
            condition: {
              name: 'expression',
              expression: 'var a = 1;'
            }
          },
          {
            condition: {
              name: 'authenticated'
            }
          },
          {
            condition: {
              name: 'anonymous'
            }
          },
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'ONE OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'NOT'
            }
          },
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'myParam',
                  myString: 'myValue',
                  myInt: 12,
                  myBool: true,
                  myBool2: true,
                  myArr: ['one two three']
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

const expectConditionsReordered = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'pathMatch',
              pattern: '/path*'
            }
          },
          {
            condition: {
              name: 'never'
            }
          },
          {
            condition: {
              name: 'always'
            },
            action: {}
          },
          {
            condition: {
              name: 'pathExact',
              path: '/path'
            }
          },
          {
            condition: {
              name: 'method'
            }
          },
          {
            condition: {
              name: 'hostMatch',
              pattern: '/host*'
            }
          },
          {
            condition: {
              name: 'expression',
              expression: 'var a = 1;'
            }
          },
          {
            condition: {
              name: 'authenticated'
            }
          },
          {
            condition: {
              name: 'anonymous'
            }
          },
          {
            condition: {
              name: 'NOT'
            }
          },
          {
            condition: {
              name: 'ONE OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          },
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          }
        ]
      }
    ]
  }
];
const expectConditionsChanged = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'hostMatch',
              pattern: '/wasPathMatch*'
            }
          },
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'never'
                }
              ]
            }
          },
          {
            condition: {
              name: 'always'
            },
            action: {}
          },
          {
            condition: {
              name: 'pathExact',
              path: '/somePath'
            }
          },
          {
            condition: {
              name: 'method',
              methods: []
            }
          },
          {
            condition: {
              name: 'pathExact',
              path: '/exact'
            }
          },
          {
            condition: {
              name: 'expression',
              expression: 'var a = 1;'
            }
          },
          {
            condition: {
              name: 'authenticated'
            }
          },
          {
            condition: {
              name: 'anonymous'
            }
          },
          {
            condition: {
              name: 'NOT'
            }
          },
          {
            condition: {
              name: 'pathExact',
              path: '/wasAllOf'
            }
          },
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'always'
                }
              ]
            }
          }
        ]
      }
    ]
  }
];
const expectConditionsRemoved = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'method',
              methods: []
            }
          }
        ]
      }
    ]
  }
];
const expectMethodEnumAdded = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'method',
              methods: ['g', 'GET', 'HEAD', 'OPTIONS', 'del', 'DELETE']
            }
          }
        ]
      }
    ]
  }
];

const expectMethodEnumDeletedByClick = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'method',
              methods: ['g', 'HEAD', 'del']
            }
          }
        ]
      }
    ]
  }
];
const expectMethodEnumDeletedByKeyPress = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'method',
              methods: ['g HEAD']
            }
          }
        ]
      }
    ]
  }
];
const expectMethodEnumChanged = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'method',
              methods: ['g HEAD p GET POST']
            }
          }
        ]
      }
    ]
  }
];
const expectIntoAllOf = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'method',
                  methods: ['g HEAD p GET POST']
                }
              ]
            }
          }
        ]
      }
    ]
  }
];
const expectAddedAllOf = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'method',
                  methods: ['g HEAD p GET POST']
                },
                {
                  name: 'ALL OF',
                  conditions: [
                    {
                      name: 'always'
                    }
                  ]
                },
                {
                  name: 'pathExact',
                  path: '/a'
                },
                {
                  name: 'hostMatch',
                  pattern: '/a*'
                }
              ]
            }
          }
        ]
      }
    ]
  }
];
const expectChangedAllOf = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'ALL OF',
                  conditions: [
                    {
                      name: 'method',
                      methods: ['g HEAD p GET POST']
                    }
                  ]
                },
                {
                  name: 'ONE OF',
                  conditions: [
                    {
                      name: 'always'
                    },
                    {
                      name: 'pathExact',
                      path: '/afterAlways'
                    },
                    {
                      name: 'pathExact',
                      path: '/afterPathExact'
                    }
                  ]
                },
                {
                  name: 'hostMatch',
                  pattern: '/a*'
                },
                {
                  name: 'pathExact',
                  path: '/last'
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

const expectRemovedAllOf = [
  {
    name: 'FirstPipeline',
    policies: [
      {
        policy: 'proxy'
      },
      {
        policy: 'basic-auth',
        ca: [
          {
            condition: {
              name: 'ALL OF',
              conditions: [
                {
                  name: 'ALL OF',
                  conditions: [
                    {
                      name: 'method',
                      methods: ['g HEAD p GET POST']
                    }
                  ]
                },
                {
                  name: 'ONE OF',
                  conditions: [
                    {
                      name: 'always'
                    },
                    {
                      name: 'pathExact',
                      path: '/afterPathExact'
                    }
                  ]
                },
                {
                  name: 'pathExact',
                  path: '/last'
                }
              ]
            }
          }
        ]
      }
    ]
  }
];
