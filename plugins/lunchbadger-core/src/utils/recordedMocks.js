export default (method, url) => {
  const recordedData = {
    EventStream: {
      KubeWatcher: {
        data: '{"dev": {"gateway":{"gateway-ko-dev-gateway-c99f98bc8-ppvpw":{"status":{"running":true,"stopped":false,"failed":false,"pod":{"initialized":true,"ready":true,"podscheduled":true},"containers":{"gateway":{"ready":true,"restartCount":0,"state":{"running":{"startedAt":"2018-09-24T14:07:28Z"}},"lastState":{}}},"summary":"RUNNING"},"id":"4db46b92-27b4-401a-807f-d6f1ab2e8ed9","slug":"gateway"}},"sls-api":{"sls-api-ko-dev-5d54594f98-hkrwp":{"status":{"running":true,"stopped":false,"failed":false,"pod":{"initialized":true,"ready":true,"podscheduled":true},"containers":{"sls":{"ready":true,"restartCount":0,"state":{"running":{"startedAt":"2018-09-14T14:53:13Z"}},"lastState":{}}},"summary":"RUNNING"},"id":null}},"workspace":{"workspace-ko-dev-6bb78cbcdf-ltzhb":{"status":{"running":true,"stopped":false,"failed":false,"pod":{"initialized":true,"ready":true,"podscheduled":true},"containers":{"lunchbadger-workspace":{"ready":true,"restartCount":0,"state":{"running":{"startedAt":"2018-09-21T13:13:26Z"}},"lastState":{}}},"summary":"RUNNING"},"id":null}},"kubeless-fn":{}}}',
      },
    },
    GET: {
      'http://internal-ko-dev.staging.lunchbadger.io/project-api/api/WorkspaceStatus/ping': {},
      'http://internal-ko-dev.staging.lunchbadger.io/workspace-api/api/Facets/server/datasources': [],
      'http://internal-ko-dev.staging.lunchbadger.io/workspace-api/api/Facets/server/models?filter[include]=properties&filter[include]=relations': [],
      'http://internal-ko-dev.staging.lunchbadger.io/workspace-api/api/Facets/server/modelConfigs': [],
      'http://sls-ko-dev.staging.lunchbadger.io/service': [],
      'http://internal-ko-dev.staging.lunchbadger.io/project-api/api/WorkspaceFiles/files': {},
      'http://internal-ko-dev.staging.lunchbadger.io/project-api/api/Projects/ko-dev': {
        "id": "kristofolbinski-dev",
        "name": "main",
        "gateways": [
            {
                "id": "d52f8c70-cfd6-4cf6-ac00-f2c71a2cf3f6",
                "name": "Gateway",
                "dnsPrefix": "gateway",
                "itemOrder": 0,
                "pipelines": [
                    {
                        "id": "9654e913-178a-43c1-9bd6-7fa90642296f",
                        "name": "Pipeline",
                        "policies": [ ]
                    }
                ],
                "policies": [
                    "basic-auth",
                    "cors",
                    "expression",
                    "headers",
                    "jwt",
                    "key-auth",
                    "log",
                    "oauth2",
                    "oauth2-introspect",
                    "proxy",
                    "rate-limit",
                    "terminate"
                ],
                "system": { }
            },
            {
                "id": "906df5a8-f4a8-4b5b-8d0f-8265c131084b",
                "name": "Gateway2",
                "dnsPrefix": "gateway",
                "itemOrder": 1,
                "pipelines": [
                    {
                        "id": "1d4ce0f9-0671-4fa4-b481-ea2cb88ae27d",
                        "name": "Pipeline",
                        "policies": [ ]
                    }
                ],
                "policies": [
                    "basic-auth",
                    "cors",
                    "expression",
                    "headers",
                    "jwt",
                    "key-auth",
                    "log",
                    "oauth2",
                    "oauth2-introspect",
                    "proxy",
                    "rate-limit",
                    "terminate"
                ],
                "system": { }
            }
        ],
        "apis": [ ],
        "serviceEndpoints": [
            {
                "id": "4479f8b3-6618-4144-be69-2a4bdb922daf",
                "name": "ServiceEndpoint",
                "urls": [
                    "http://example.org"
                ],
                "itemOrder": 2
            }
        ],
        "apiEndpoints": [
            {
                "id": "351663df-ca48-4f02-9b7d-4c038e149f1f",
                "name": "ApiEndpoint",
                "host": "*",
                "paths": [
                    "e"
                ],
                "itemOrder": 0
            }
        ],
        "connections": [ ],
        "states": [
            {
                "id": "54787711-7d68-46a2-96c3-c5044007dc7d",
                "key": "currentElement",
                "value": {
                    "id": "cf4e1999-7bff-46a3-a7d3-bda313f0e5ff",
                    "type": "dataSources"
                }
            },
            {
                "id": "5603f139-0724-4b84-b59a-345bdb434347",
                "key": "multiEnvironments",
                "value": {
                    "selected": 0,
                    "environments": [
                        {
                            "name": "Development",
                            "delta": false,
                            "edit": false,
                            "entities": { }
                        }
                    ]
                }
            }
        ],
        "portals": [ ],
        "microServices": [ ],
        "functions": [ ]
    },
    },
    POST: {
      'http://staging-api.lunchbadger.com/api/producers': {},
    },
  }
  if (!recordedData[method] || !recordedData[method][url]) {
    throw new Error(`Missing mock for ${method} ${url}`);
  }
  return recordedData[method][url];
};
