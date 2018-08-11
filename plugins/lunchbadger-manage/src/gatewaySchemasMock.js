export default [
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
          ],
          "default": {

          }
        },
        "session": {
          "type": "object",
          "default": {

          }
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
            },
            "issuer": {
              "type": "string"
            },
            "audience": {
              "type": [
                "string",
                "array"
              ],
              "items": {
                "type": "string"
              }
            },
            "subject": {
              "type": "string"
            },
            "algorithm": {
              "type": "string",
              "default": "HS256"
            }
          },
          "required": [
            "tokenType",
            "timeToExpiry"
          ],
          "default": {

          }
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
          ],
          "default": {

          }
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
          ],
          "default": {

          }
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
    "type": "config",
    "schema": {
      "$id": "http://express-gateway.io/models/gateway.config.json",
      "definitions": {
        "baseApiEndpoint": {
          "type": "object",
          "properties": {
            "host": {
              "type": "string"
            },
            "paths": {
              "type": [
                "string",
                "array"
              ],
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
              "uniqueItems": true,
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
            }
          }
        }
      },
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
                  },
                  "ca": {
                    "type": "array",
                    "uniqueItems": true,
                    "items": {
                      "type": "string"
                    }
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
            "anyOf": [
              {
                "$ref": "#/definitions/baseApiEndpoint"
              },
              {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/baseApiEndpoint"
                }
              }
            ]
          }
        },
        "serviceEndpoints": {
          "type": [
            "object",
            "null"
          ],
          "additionalProperties": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "format": "uri"
              },
              "urls": {
                "type": "array",
                "items": {
                  "type": "string",
                  "format": "uri"
                }
              }
            },
            "oneOf": [
              {
                "required": [
                  "url"
                ]
              },
              {
                "required": [
                  "urls"
                ]
              }
            ]
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
            "array",
            "null"
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
          },
          "default": "*"
        },
        "methods": {
          "type": [
            "string",
            "array"
          ],
          "items": {
            "type": "string"
          },
          "default": [
            "GET",
            "HEAD",
            "PUT",
            "PATCH",
            "POST",
            "DELETE"
          ]
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
          "type": "integer",
          "default": 204
        },
        "preflightContinue": {
          "type": "boolean",
          "default": false
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
      "$id": "http://express-gateway.io/schemas/policies/key-auth.json",
      "type": "object",
      "properties": {
        "apiKeyHeader": {
          "type": "string",
          "default": "Authorization"
        },
        "apiKeyHeaderScheme": {
          "type": "string",
          "default": "apiKey"
        },
        "apiKeyField": {
          "type": "string",
          "default": "apiKey"
        },
        "passThrough": {
          "type": "boolean",
          "default": false
        },
        "disableHeaders": {
          "type": "boolean",
          "default": false
        },
        "disableHeadersScheme": {
          "type": "boolean",
          "default": false
        },
        "disableQueryParam": {
          "type": "boolean",
          "default": false
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
      "$id": "http://express-gateway.io/schemas/policies/oauth2-introspect.json",
      "type": "object",
      "properties": {
        "endpoint": {
          "type": "string"
        },
        "authorization_value": {
          "type": "string"
        },
        "ttl": {
          "type": "integer",
          "default": 60,
          "label": "TTL"
        },
        "passThrough": {
          "type": "boolean",
          "default": false
        }
      },
      "required": [
        "endpoint",
        "ttl",
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
        "stripPath": {
          "type": "boolean",
          "default": false
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
        "changeOrigin",
        "stripPath"
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
          "type": "integer",
          "default": 60000
        },
        "delayAfter": {
          "type": "integer",
          "default": 1
        },
        "delayMs": {
          "type": "integer",
          "default": 1000
        },
        "max": {
          "type": "integer",
          "default": 5
        },
        "message": {
          "type": "string",
          "default": "Too many requests, please try again later."
        },
        "statusCode": {
          "type": "integer",
          "default": 429
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
      "type": "object",
      "properties": {
        "methods": {
          "type": "array",
          "items": {
            "type": "string"
          },
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
  },
  {
    "type": "condition",
    "schema": {
      "$id": "http://express-gateway.io/schemas/conditions/tlsClientAuthenticated.json"
    }
  }
];
