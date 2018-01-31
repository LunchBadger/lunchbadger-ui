export default [
  {
    "type": "config",
    "schema": {
      "$id": "http://express-gateway.io/models/gateway.config.json",
      "type": "object",
      "properties": {
        "http": {
          "type": "object",
          "properties": {
            "port": {
              "type": "number"
            }
          }
        },
        "https": {
          "type": "object",
          "properties": {
            "port": {
              "type": "number"
            },
            "tls": {
              "type": "object",
              "additionalProperties": {
                "type": "object",
                "properties": {
                  "key": {
                    "type": "string"
                  },
                  "cert": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "admin": {
          "type": "object",
          "properties": {
            "port": {
              "type": "number"
            },
            "hostname": {
              "type": "string"
            }
          }
        },
        "apiEndpoints": {
          "type": [
            "object",
            "null"
          ],
          "additionalProperties": {
            "type": "object",
            "properties": {
              "host": {
                "type": "string"
              },
              "paths": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "pathRegex": {
                "type": "string",
                "format": "regex"
              },
              "scopes": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "methods": {
                "type": [
                  "string",
                  "array"
                ],
                "items": {
                  "type": "array"
                }
              }
            }
          }
        },
        "serviceEndpoints": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string"
              },
              "urls": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          }
        },
        "policies": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "pipelines": {
          "type": [
            "object",
            "array"
          ],
          "additionalProperties": {
            "type": "object",
            "properties": {
              "apiEndpoints": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "policies": {
                "type": "array",
                "items": [
                  {
                    "type": "object",
                    "properties": {
                      "action": {
                        "type": "object"
                      }
                    }
                  },
                  {
                    "type": "object",
                    "properties": {
                      "condition": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "name"
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  {
    "type": "config",
    "schema": {
      "$id": "http://express-gateway.io/models/system.config.json",
      "type": "object",
      "properties": {
        "db": {
          "type": "object",
          "properties": {
            "redis": {
              "type": "object",
              "properties": {
                "emulate": {
                  "type": "boolean",
                  "default": false
                }
              },
              "required": [
                "emulate"
              ]
            }
          },
          "required": [
            "redis"
          ]
        },
        "crypto": {
          "type": "object",
          "properties": {
            "cipherKey": {
              "type": "string",
              "default": "sensitiveKey"
            },
            "algorithm": {
              "type": "string",
              "default": "aes256"
            },
            "saltRounds": {
              "type": "number",
              "default": 10
            }
          },
          "required": [
            "cipherKey",
            "algorithm",
            "saltRounds"
          ]
        },
        "session": {
          "type": "object"
        },
        "accessTokens": {
          "type": "object",
          "properties": {
            "tokenType": {
              "type": "string",
              "enum": [
                "jwt",
                "opaque"
              ],
              "default": "opaque"
            },
            "timeToExpiry": {
              "type": "number",
              "default": 720000
            }
          },
          "required": [
            "tokenType",
            "timeToExpiry"
          ]
        },
        "refreshTokens": {
          "type": "object",
          "properties": {
            "timeToExpiry": {
              "type": "number",
              "default": 720000
            }
          },
          "required": [
            "timeToExpiry"
          ]
        },
        "authorizationCodes": {
          "type": "object",
          "properties": {
            "timeToExpiry": {
              "type": "number",
              "default": 300000
            }
          },
          "required": [
            "timeToExpiry"
          ]
        },
        "plugins": {
          "type": "object"
        }
      },
      "required": [
        "db",
        "crypto",
        "session",
        "accessTokens",
        "refreshTokens",
        "authorizationCodes"
      ]
    }
  },
  {
    "type": "model",
    "schema": {
      "$id": "http://express-gateway.io/models/users.json",
      "type": "object",
      "properties": {
        "firstname": {
          "type": "string"
        },
        "lastname": {
          "type": "string"
        },
        "username": {
          "type": "string"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "redirectUri": {
          "type": "string",
          "format": "uri"
        }
      },
      "required": [
        "username",
        "firstname",
        "lastname"
      ]
    }
  },
  {
    "type": "model",
    "schema": {
      "$id": "http://express-gateway.io/models/credentials.json",
      "type": "object",
      "definitions": {
        "credentialBase": {
          "type": "object",
          "required": [
            "autoGeneratePassword"
          ],
          "properties": {
            "autoGeneratePassword": {
              "type": "boolean",
              "default": true
            },
            "scopes": {
              "type": [
                "string",
                "array"
              ],
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "properties": {
        "basic-auth": {
          "type": "object",
          "required": [
            "autoGeneratePassword",
            "passwordKey"
          ],
          "properties": {
            "autoGeneratePassword": {
              "type": "boolean",
              "default": true
            },
            "scopes": {
              "type": [
                "string",
                "array"
              ],
              "items": {
                "type": "string"
              }
            },
            "passwordKey": {
              "type": "string",
              "default": "password"
            }
          }
        },
        "key-auth": {
          "type": "object",
          "properties": {
            "scopes": {
              "type": [
                "string",
                "array"
              ],
              "items": {
                "type": "string"
              }
            }
          }
        },
        "jwt": {
          "type": "object"
        },
        "oauth2": {
          "type": "object",
          "required": [
            "autoGeneratePassword",
            "passwordKey"
          ],
          "properties": {
            "autoGeneratePassword": {
              "type": "boolean",
              "default": true
            },
            "scopes": {
              "type": [
                "string",
                "array"
              ],
              "items": {
                "type": "string"
              }
            },
            "passwordKey": {
              "type": "string",
              "default": "secret"
            }
          }
        }
      }
    }
  },
  {
    "type": "model",
    "schema": {
      "$id": "http://express-gateway.io/models/applications.json",
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "redirectUri": {
          "type": "string",
          "format": "uri"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/basic-auth.json",
      "type": "object",
      "properties": {
        "passThrough": {
          "type": "boolean",
          "default": false
        }
      }
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/cors.json",
      "type": "object",
      "properties": {
        "origin": {
          "type": [
            "string",
            "boolean",
            "array"
          ],
          "items": {
            "type": "string"
          }
        },
        "methods": {
          "type": [
            "string",
            "array"
          ],
          "items": {
            "type": "string"
          }
        },
        "allowedHeaders": {
          "type": [
            "string",
            "array"
          ],
          "items": {
            "type": "string"
          }
        },
        "exposedHeaders": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "credentials": {
          "type": "boolean"
        },
        "maxAge": {
          "type": "integer"
        },
        "optionsSuccessStatus": {
          "type": "integer"
        }
      }
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/expression.json",
      "type": "object",
      "properties": {
        "jscode": {
          "type": "string"
        }
      },
      "required": [
        "jscode"
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/headers.json",
      "type": "object",
      "properties": {
        "headersPrefix": {
          "type": "string",
          "default": ""
        },
        "forwardHeaders": {
          "type": "object"
        }
      },
      "required": [
        "headersPrefix",
        "forwardHeaders"
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/jwt.json",
      "type": "object",
      "properties": {
        "secretOrPublicKey": {
          "type": "string"
        },
        "secretOrPublicKeyFile": {
          "type": "string"
        },
        "jwtExtractor": {
          "type": "string",
          "enum": [
            "header",
            "query",
            "authScheme",
            "authBearer"
          ],
          "default": "authBearer"
        },
        "jwtExtractorField": {
          "type": "string"
        },
        "audience": {
          "type": "string"
        },
        "issuer": {
          "type": "string"
        },
        "checkCredentialExistence": {
          "type": "boolean",
          "default": true
        }
      },
      "required": [
        "jwtExtractor",
        "checkCredentialExistence"
      ],
      "oneOf": [
        {
          "required": [
            "secretOrPublicKey"
          ]
        },
        {
          "required": [
            "secretOrPublicKeyFile"
          ]
        }
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/keyauth.json",
      "type": "object",
      "properties": {
        "apiKeyHeader": {
          "type": "string"
        },
        "apiKeyHeaderScheme": {
          "type": "string"
        },
        "apiKeyField": {
          "type": "string"
        },
        "passThrough": {
          "type": "boolean",
          "default": false
        },
        "disableHeaders": {
          "type": "boolean"
        },
        "disableHeadersScheme": {
          "type": "boolean"
        },
        "disableQueryParam": {
          "type": "boolean"
        }
      }
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/log.json",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      },
      "required": [
        "message"
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/oauth2.json",
      "type": "object",
      "properties": {
        "passThrough": {
          "type": "boolean",
          "default": false
        },
        "jwt": {
          "$ref": "jwt.json"
        }
      },
      "required": [
        "passThrough"
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/proxy.json",
      "type": "object",
      "properties": {
        "serviceEndpoint": {
          "type": "string"
        },
        "changeOrigin": {
          "type": "boolean",
          "default": true
        },
        "proxyUrl": {
          "type": "string"
        },
        "strategy": {
          "type": "string",
          "enum": [
            "round-robin"
          ],
          "default": "round-robin"
        }
      },
      "required": [
        "serviceEndpoint",
        "strategy",
        "changeOrigin"
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/rate-limit.json",
      "type": "object",
      "properties": {
        "rateLimitBy": {
          "type": "string"
        },
        "windowMs": {
          "type": "integer"
        },
        "delayAfter": {
          "type": "integer"
        },
        "delayMs": {
          "type": "integer"
        },
        "max": {
          "type": "integer"
        },
        "message": {
          "type": "string"
        },
        "statusCode": {
          "type": "integer"
        }
      }
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/terminate.json",
      "type": "object",
      "properties": {
        "statusCode": {
          "type": "number",
          "default": 400
        },
        "message": {
          "type": "string",
          "default": "Terminated"
        }
      },
      "required": [
        "statusCode",
        "message"
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/policies/cAdvisor.json",
      "type": "object",
      "properties": {
        "headerName": {
          "type": "string",
          "default": "eg-consumer-id"
        }
      }
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/always.json"
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/never.json"
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/allOf.json",
      "type": "object",
      "properties": {
        "conditions": {
          "type": "array",
          "items": {
            "$ref": "base.json"
          }
        }
      },
      "required": [
        "conditions"
      ]
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/oneOf.json",
      "type": "object",
      "properties": {
        "conditions": {
          "type": "array",
          "items": {
            "$ref": "base.json"
          }
        }
      },
      "required": [
        "conditions"
      ]
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/not.json",
      "type": "object",
      "properties": {
        "condition": {
          "$ref": "base.json"
        }
      },
      "required": [
        "condition"
      ]
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/pathMatch.json",
      "type": "object",
      "properties": {
        "pattern": {
          "type": "string",
          "format": "regex"
        }
      },
      "required": [
        "pattern"
      ]
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/pathExact.json",
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ]
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/method.json",
      "definitions": {
        "httpMethod": {
          "type": "string",
          "enum": [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "HEAD",
            "OPTIONS"
          ]
        }
      },
      "type": "object",
      "properties": {
        "methods": {
          "anyOf": [
            {
              "$ref": "#/definitions/httpMethod"
            },
            {
              "type": "array",
              "items": {
                "$ref": "#/definitions/httpMethod"
              }
            }
          ]
        }
      },
      "required": [
        "methods"
      ]
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/hostMatch.json",
      "type": "object",
      "properties": {
        "pattern": {
          "type": "string"
        }
      },
      "required": [
        "pattern"
      ]
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/expression.json",
      "type": "object",
      "properties": {
        "expression": {
          "type": "string"
        }
      },
      "required": [
        "expression"
      ]
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/authenticated.json"
    }
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/anonymous.json"
    }
  }
];
