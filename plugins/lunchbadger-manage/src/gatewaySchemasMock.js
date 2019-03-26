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
          "default": { }
        },
        "session": {
          "type": "object",
          "default": { }
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
          "default": { }
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
          "default": { }
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
          "default": { }
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
        },
        "conditionAction": {
          "type": [
            "object",
            "null"
          ],
          "properties": {
            "action": {
              "type": "object",
              "default": { }
            },
            "condition": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                }
              },
              "required": [
                "name"
              ],
              "default": {
                "name": "always"
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
          "allOf": [
            {
              "properties": {
                "port": {
                  "type": "number",
                  "default": 9876
                },
                "host": {
                  "type": "string"
                },
                "hostname": {
                  "type": "string"
                }
              },
              "required": [
                "port"
              ]
            }
          ]
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
            "apiEndpoint": {
              "type": "string"
            },
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
                  "maxProperties": 1,
                  "additionalProperties": {
                    "anyOf": [
                      {
                        "$ref": "#/definitions/conditionAction"
                      },
                      {
                        "type": "array",
                        "items": {
                          "$ref": "#/definitions/conditionAction"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          "required": [
            "policies"
          ]
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
    "type": "internal",
    "schema": {
      "$id": "http://express-gateway.io/schemas/base/auth.json",
      "type": "object",
      "properties": {
        "passThrough": {
          "type": "boolean",
          "default": false,
          "description": "Specify whether continue with pipeline processing in case the authentication fails"
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
      "$id": "http://express-gateway.io/schemas/policies/basic-auth.json",
      "allOf": [
        {
          "$ref": "http://express-gateway.io/schemas/base/auth.json"
        }
      ]
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
          "default": "*",
          "description": "Configures the Access-Control-Allow-Origin CORS header."
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
          ],
          "description": "Configures the Access-Control-Allow-Methods CORS header."
        },
        "allowedHeaders": {
          "type": [
            "string",
            "array"
          ],
          "items": {
            "type": "string"
          },
          "description": "Configures the Access-Control-Allow-Headers CORS header."
        },
        "exposedHeaders": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Configures the Access-Control-Expose-Headers CORS header."
        },
        "credentials": {
          "type": "boolean",
          "description": " Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted."
        },
        "maxAge": {
          "type": "integer",
          "description": "Configures the Access-Control-Max-Age CORS header. Set to an integer to pass the header, otherwise it is omitted."
        },
        "optionsSuccessStatus": {
          "type": "integer",
          "default": 204,
          "description": "Provides a status code to use for successful OPTIONS requests"
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
          "type": "string",
          "description": "Javascript code to execute against the current egContext",
          "examples": [
            "req.testValue = 10"
          ]
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
          "default": "",
          "description": "A prefix string to be attached to any sent headers"
        },
        "forwardHeaders": {
          "type": "object",
          "description": "A key-value pair of headers/value to be added to the current http request",
          "examples": [
            {
              "X-API-Gateway": "Express-Gateway"
            }
          ]
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
          "type": "string",
          "description": "The secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature.",
          "examples": [
            "secretString",
            "PEMCertificate"
          ],
          "multiline": true
        },
        "jwtExtractor": {
          "type": "string",
          "enum": [
            "header",
            "query",
            "authScheme",
            "authBearer"
          ],
          "default": "authBearer",
          "description": "The method to use to extract the JWT from the current HTTP Request"
        },
        "jwtExtractorField": {
          "type": "string",
          "description": "An optional argument for the selected extractor"
        },
        "audience": {
          "type": "string",
          "description": "If defined, the token audience (aud) will be verified against this value."
        },
        "issuer": {
          "type": "string",
          "description": "If defined the token issuer (iss) will be verified against this value"
        },
        "checkCredentialExistence": {
          "type": "boolean",
          "default": true,
          "description": "Value istructing the gateway whether verify the sub against the internal SOC"
        }
      },
      "required": [
        "jwtExtractor",
        "checkCredentialExistence",
        "secretOrPublicKey"
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/key-auth.json",
      "allOf": [
        {
          "$ref": "http://express-gateway.io/schemas/base/auth.json"
        },
        {
          "type": "object",
          "properties": {
            "apiKeyHeader": {
              "type": "string",
              "default": "Authorization",
              "description": "HTTP Header to look for the apiScheme + apiKey string"
            },
            "apiKeyHeaderScheme": {
              "type": "string",
              "default": "apiKey",
              "description": "HTTP Authorization Scheme to verify before extracting the API Key"
            },
            "apiKeyField": {
              "type": "string",
              "default": "apiKey",
              "description": "Query String parameter name to look for to extract the apiKey"
            },
            "disableHeaders": {
              "type": "boolean",
              "default": false,
              "description": "Entirely disable lookup API Key from the header"
            },
            "disableHeadersScheme": {
              "type": "boolean",
              "default": false,
              "description": "Enable or disable apiScheme check"
            },
            "disableQueryParam": {
              "type": "boolean",
              "default": false,
              "description": "Entirely disable lookup API Key from the query string"
            }
          }
        }
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/log.json",
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "description": "A template expression to print out on the log stream",
          "examples": [
            "This is a log message"
          ]
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
      "allOf": [
        {
          "$ref": "http://express-gateway.io/schemas/base/auth.json"
        },
        {
          "type": "object",
          "properties": {
            "jwt": {
              "$ref": "jwt.json"
            }
          }
        }
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/oauth2-introspect.json",
      "allOf": [
        {
          "$ref": "http://express-gateway.io/schemas/base/auth.json"
        },
        {
          "type": "object",
          "properties": {
            "endpoint": {
              "type": "string",
              "format": "uri",
              "description": "Endpoint that will be used to validate the provided token",
              "examples": [
                "https://authorization.server/oauth2-introspect"
              ]
            },
            "authorization_value": {
              "type": "string",
              "description": "Value put as Authorization header that'll be sent as part of the HTTP request to the specified endpoint"
            },
            "ttl": {
              "title": "TTL",
              "type": "integer",
              "default": 60,
              "description": "Time, in seconds, in which the current token, if validated before, will be consider as valid without making a new request to the authorization endpoint"
            }
          },
          "required": [
            "endpoint",
            "ttl"
          ]
        }
      ]
    }
  },
  {
    "type": "policy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/policies/proxy.json",
      "type": "object",
      "properties": {
        "auth": {
          "type": "string",
          "description": " Basic authentication i.e. 'user:password' to compute an Authorization header."
        },
        "autoRewrite": {
          "type": "boolean",
          "default": false,
          "description": "Rewrites the location host/port on (201/301/302/307/308) redirects based on requested host/port."
        },
        "changeOrigin": {
          "type": "boolean",
          "default": true,
          "description": "Changes the origin of the host header to the target URL"
        },
        "followRedirects": {
          "type": "boolean",
          "default": false,
          "description": "Specify whether you want to follow redirects"
        },
        "hostRewrite": {
          "type": "string",
          "description": "Rewrites the location hostname on (201/301/302/307/308) redirects."
        },
        "ignorePath": {
          "type": "boolean",
          "default": false,
          "description": "Specify whether you want to ignore the proxy path of the incoming request"
        },
        "prependPath": {
          "type": "boolean",
          "default": true,
          "description": "Specify whether you want to prepend the target's path to the proxy path"
        },
        "preserveHeaderKeyCase": {
          "type": "boolean",
          "default": false,
          "description": "Specify whether you want to keep letter case of response header key"
        },
        "protocolRewrite": {
          "type": "string",
          "enum": [
            "http",
            "https"
          ],
          "description": "Forces the protocol on the proxied request"
        },
        "proxyUrl": {
          "type": "string",
          "description": "An intermediate HTTP Proxy where send the requests to instead of the service endpoint directly"
        },
        "secure": {
          "type": "boolean",
          "default": true,
          "description": "Flag specifying if you want to verify the SSL Certs"
        },
        "serviceEndpoint": {
          "type": "string",
          "description": "The serviceEndpoint reference where to proxy the requests to"
        },
        "stripPath": {
          "type": "boolean",
          "default": false,
          "description": "Specifies whether you want to strip the apiEndpoint path from the final URL."
        },
        "strategy": {
          "type": "string",
          "enum": [
            "round-robin"
          ],
          "default": "round-robin",
          "description": "Specifies how to balance the requests between multiple urls in the same service endpoint"
        },
        "toProxy": {
          "type": "boolean",
          "default": false,
          "description": "Passes the absolute URL as the path"
        },
        "xfwd": {
          "type": "boolean",
          "default": false,
          "description": "Adds x-forward headers to the proxied request"
        }
      },
      "required": [
        "strategy",
        "changeOrigin",
        "stripPath",
        "ignorePath",
        "prependPath",
        "followRedirects"
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
          "type": "string",
          "description": "The criteria that is used to limit the number of requests by. Can be a JS Expression"
        },
        "windowMs": {
          "type": "integer",
          "default": 60000,
          "description": "How long to keep records of requests in memory."
        },
        "delayAfter": {
          "type": "integer",
          "default": 1,
          "description": "Max number of connections during windowMs before starting to delay responses."
        },
        "delayMs": {
          "type": "integer",
          "default": 1000,
          "description": "How long to delay the response, in milliseconds."
        },
        "max": {
          "type": "integer",
          "default": 5,
          "description": "Max number of connections during windowMs milliseconds before sending a 429 response. Set to 0 to disable."
        },
        "message": {
          "type": "string",
          "default": "Too many requests, please try again later.",
          "description": "Error message returned when max is exceeded."
        },
        "statusCode": {
          "type": "integer",
          "default": 429,
          "description": "HTTP status code returned when max is exceeded."
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
          "default": 400,
          "description": "HTTP Status Code to return for the request"
        },
        "message": {
          "type": "string",
          "default": "Terminated",
          "description": "text/plain message to return as a response"
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
          "format": "regex",
          "description": "RegExp to match against the req.url property"
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
          "type": "string",
          "description": "Path to match against the req.url property"
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
          "type": "string",
          "description": "Pattern to match against the HOST header in the current HTTP Request"
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
          "type": "string",
          "description": "Javascript Expression to execute with the current egContext object"
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
