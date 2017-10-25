export default [
  {
    "key": "http://express-gateway.io/schemas/config.json",
    "type": "core",
    "name": "http://express-gateway.io/schemas/config.json",
    "schema": {
      "$id": "http://express-gateway.io/schemas/config.json",
      "gateway": {
        "serviceEndpoint": {
          "type": "string"
        }
      }
    }
  },
  {
    "key": "http://express-gateway.io/schemas/defs.json",
    "type": "core",
    "name": "http://express-gateway.io/schemas/defs.json",
    "schema": {
      "$id": "http://express-gateway.io/schemas/defs.json",
      "definitions": {
        "jscode": {
          "type": "string"
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
          ]
        }
      }
    }
  },
  {
    "key": "policy:basic-auth",
    "type": "policy",
    "name": "basic-auth",
    "schema": {

    }
  },
  {
    "key": "policy:cors",
    "type": "policy",
    "name": "cors",
    "schema": {
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
    "key": "policy:expression",
    "type": "policy",
    "name": "expression",
    "schema": {
      "$id": "http://express-gateway.io/schemas/expression.json",
      "type": "object",
      "properties": {
        "jscode": {
          "$ref": "defs.json#/definitions/jscode"
        }
      },
      "required": [
        "jscode"
      ]
    }
  },
  {
    "key": "policy:key-auth",
    "type": "policy",
    "name": "key-auth",
    "schema": {
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
    "key": "policy:log",
    "type": "policy",
    "name": "log",
    "schema": {
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
    "key": "policy:oauth2",
    "type": "policy",
    "name": "oauth2",
    "schema": {

    }
  },
  {
    "key": "policy:proxy",
    "type": "policy",
    "name": "proxy",
    "schema": {
      "$id": "http://express-gateway.io/schemas/proxy.json",
      "type": "object",
      "properties": {
        "serviceEndpoint": {
          "$ref": "config.json#/gateway/serviceEndpoint"
        },
        "changeOrigin": {
          "type": "boolean"
        },
        "strategy": {
          "type": "string",
          "enum": [
            "round-robin"
          ]
        }
      },
      "required": [
        "serviceEndpoint"
      ]
    }
  },
  {
    "key": "policy:rate-limit",
    "type": "policy",
    "name": "rate-limit",
    "schema": {
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
    "key": "condition:always",
    "type": "condition",
    "name": "always",
    "schema": {

    }
  },
  {
    "key": "condition:never",
    "type": "condition",
    "name": "never",
    "schema": {

    }
  },
  {
    "key": "condition:allOf",
    "type": "condition",
    "name": "allOf",
    "schema": {
      "$id": "http://express-gateway.io/schemas/allOf.json",
      "type": "object",
      "properties": {
        "conditions": {
          "type": "array",
          "items": {
            "$ref": "defs.json#/definitions/condition"
          }
        }
      },
      "required": [
        "conditions"
      ]
    }
  },
  {
    "key": "condition:oneOf",
    "type": "condition",
    "name": "oneOf",
    "schema": {
      "$id": "http://express-gateway.io/schemas/oneOf.json",
      "type": "object",
      "properties": {
        "conditions": {
          "type": "array",
          "items": {
            "$ref": "defs.json#/definitions/condition"
          }
        }
      },
      "required": [
        "conditions"
      ]
    }
  },
  {
    "key": "condition:not",
    "type": "condition",
    "name": "not",
    "schema": {
      "$id": "http://express-gateway.io/schemas/not.json",
      "type": "object",
      "properties": {
        "condition": {
          "$ref": "defs.json#/definitions/condition"
        }
      },
      "required": [
        "condition"
      ]
    }
  },
  {
    "key": "condition:pathMatch",
    "type": "condition",
    "name": "pathMatch",
    "schema": {
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
    "key": "condition:pathExact",
    "type": "condition",
    "name": "pathExact",
    "schema": {
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
    "key": "condition:method",
    "type": "condition",
    "name": "method",
    "schema": {
      "type": "object",
      "properties": {
        "methods": {
          "type": [
            "string",
            "array"
          ],
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "methods"
      ]
    }
  },
  {
    "key": "condition:hostMatch",
    "type": "condition",
    "name": "hostMatch",
    "schema": {
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
    "key": "condition:expression",
    "type": "condition",
    "name": "expression",
    "schema": {
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
  }
];
