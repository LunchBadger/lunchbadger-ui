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
        },
        "httpHeaders": [
          "Accept",
          "Accept-Charset",
          "Accept-Encoding",
          "Accept-Language",
          "Accept-Datetime",
          "Access-Control-Request-Method",
          "Access-Control-Request-Headers",
          "Authorization",
          "Cache-Control",
          "Connection",
          "Cookie",
          "Content-Length",
          "Content-MD5",
          "Content-Type",
          "Date",
          "Expect",
          "Forwarded",
          "From",
          "Host",
          "If-Match",
          "If-Modified-Since",
          "If-None-Match",
          "If-Range",
          "If-Unmodified-Since",
          "Max-Forwards",
          "Origin",
          "Pragma",
          "Proxy-Authorization",
          "Range",
          "Referer",
          "TE",
          "User-Agent",
          "Upgrade",
          "Via",
          "Warning"
        ],
        "httpMethods": [
          "GET",
          "HEAD",
          "POST",
          "PUT",
          "DELETE",
          "TRACE",
          "OPTIONS",
          "CONNECT",
          "PATCH"
        ]
      }
    }
  },
  {
    "key": "policy:basic-auth",
    "type": "policy",
    "name": "basic-auth",
    "description": "The Basic Authorization policy follows the RFC-7617 standard. From the standard, if a user agent wanted to send the user-id “Aladdin” and password “open sesame”, it would use the following HTTP header.",
    "schema": {
      "type": "object",
      "properties": {
        "passThrough": {
          "type": "boolean"
        }
      }
    }
  },
  {
    "key": "policy:cors",
    "type": "policy",
    "name": "cors",
    "description": "The CORS Policy Enables Cross-origin resource sharing (CORS) in Express Gateway. CORS defines a way in which a browser and server can interact and determine whether or not it is safe to allow a cross-origin request.",
    "schema": {
      "type": "object",
      "properties": {
        "origin": {
          "type": [
            "boolean",
            "array"
          ],
          "items": {
            "type": "string"
          },
          "default": [],
          "description": "Configures the Access-Control-Allow-Origin CORS header."
        },
        "methods": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "enum": {
            "$ref": "defs.json#/definitions/httpMethods"
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
          "type": "array",
          "items": {
            "type": "string"
          },
          "enum": {
            "$ref": "defs.json#/definitions/httpHeaders"
          },
          "description": "Configures the Access-Control-Allow-Headers CORS header."
        },
        "exposedHeaders": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "enum": {
            "$ref": "defs.json#/definitions/httpHeaders"
          },
          "description": "Configures the Access-Control-Expose-Headers CORS header."
        },
        "credentials": {
          "type": "boolean",
          "default": true,
          "description": "Configures the Access-Control-Allow-Credentials CORS header."
        },
        "maxAge": {
          "type": "integer",
          "description": "Configures the Access-Control-Max-Age CORS header."
        },
        "optionsSuccessStatus": {
          "type": "integer",
          "default": 204,
          "description": "Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204."
        }
      }
    }
  },
  {
    "key": "policy:expression",
    "type": "policy",
    "name": "expression",
    "description": "The Expression policy allows you to execute arbitrary JavaScript code in secured shared memory or “sandbox”.",
    "schema": {
      "$id": "http://express-gateway.io/schemas/expression.json",
      "type": "object",
      "properties": {
        "jscode": {
          "$ref": "defs.json#/definitions/jscode",
          "description": "Valid JS code to execute. Note that egContext object will be used as global object for code. All Node.JS global variables like process, require etc. will not be available for security reasons"
        }
      },
      "required": [
        "jscode"
      ]
    }
  },
  {
    "key": "policy:headers",
    "type": "policy",
    "name": "headers",
    "schema": {
      "type": "object",
      "properties": {
        "headersPrefix": {
          "type": "string",
          "description": "String with prefix to be added for each header."
        },
        "forwardHeaders": {
          "type": "object"
        }
      }
    }
  },
  {
    "key": "policy:key-auth",
    "type": "policy",
    "name": "key-auth",
    "description": "The Key Authorization policy is an efficient way of securing restricting access to your API endpoints for applications through API keys. The Express Gateway API key is a key pair separated by colon. The first part of the key pair is a UUID representing the identity of the consumer. The second part of the key pair is a UUID representing the secret.",
    "schema": {
      "type": "object",
      "properties": {
        "apiKeyHeader": {
          "type": "string",
          "default": "Authorization",
          "enum": {
            "$ref": "defs.json#/definitions/httpHeaders"
          },
          "description": "The name of the header that should contain the API key."
        },
        "apiKeyHeaderScheme": {
          "type": "string",
          "default": "apiKey",
          "description": "The enforced scheme in the header."
        },
        "apiKeyField": {
          "type": "string",
          "default": "apiKey",
          "description": "Name of field to check in query parameter."
        },
        "disableHeaders": {
          "type": "boolean",
          "default": true,
          "description": "Disable apikey lookup in headers."
        },
        "disableHeadersScheme": {
          "type": "boolean",
          "default": true,
          "description": "Disable verification of scheme in header."
        },
        "disableQueryParam": {
          "type": "boolean",
          "default": true,
          "description": "Set to true to disable api key lookup in query string."
        }
      }
    }
  },
  {
    "key": "policy:log",
    "type": "policy",
    "name": "log",
    "description": "The Simpler Logger policy provides capability for logging with basic message output. JavaScript ES6 template literal syntax is supported.",
    "schema": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "default": "${req.ip} ${req.method} ${req.originalUrl}",
          "description": "String specifiying the message to log."
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
    "description": "The OAuth 2.0 policy follows the RFC-6749 standard.",
    "schema": {
      "type": "object",
      "properties": {
        "passThrough": {
          "type": "boolean"
        }
      }
    }
  },
  {
    "key": "policy:proxy",
    "type": "policy",
    "name": "proxy",
    "description": "The Proxy policy forwards the request to a service endpoint.",
    "schema": {
      "$id": "http://express-gateway.io/schemas/proxy.json",
      "type": "object",
      "properties": {
        "serviceEndpoint": {
          "$ref": "config.json#/gateway/serviceEndpoint",
          "description": "The name of the service endpoint to forward to"
        },
        "changeOrigin": {
          "type": "boolean",
          "default": true,
          "description": "Changes the origin of the host header to the target URL."
        },
        "proxyUrl": {
          "type": "string",
          "description": "Address of the intermediate proxy. Example: http://corporate.proxy:3128."
        },
        "strategy": {
          "type": "string",
          "enum": [
            "round-robin"
          ],
          "default": "round-robin",
          "description": "Assigns a load-balancing strategy for serviceEndpoint declarations that have more than one URL."
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
    "description": "The Rate Limiter policy is used to limit the number of requests received and processed by the API endpoint. Limits are useful to prevent your system from being overwhelmed in both benign and malevolent situations where the number of requests processed can overwhelm your underlying APIs and supporting services. Rate limits are also useful to control the amount of API consumption to a known capacity of quantity.",
    "schema": {
      "type": "object",
      "properties": {
        "rateLimitBy": {
          "type": "string",
          "default": "${req.ip}",
          "description": "The criteria that is used to limit the number of requests by. By default will limit based on IP address. Use JS template string to configure. Example “${req.ip}”, “${req.hostname}” etc."
        },
        "windowMs": {
          "type": "integer",
          "default": 60000,
          "description": "milliseconds - how long to keep records of requests in memory.",
          "postfix": "milliseconds"
        },
        "delayAfter": {
          "type": "integer",
          "default": 1,
          "description": "max number of connections during windowMs before starting to delay responses. Defaults to 1. Set to 0 to disable delaying.",
          "postfix": "connections"
        },
        "delayMs": {
          "type": "integer",
          "default": 1000,
          "description": "milliseconds - how long to delay the response, multiplied by (number of recent hits - delayAfter). Defaults to 1000 (1 second). Set to 0 to disable delaying.",
          "postfix": "milliseconds"
        },
        "max": {
          "type": "integer",
          "default": 5,
          "description": "max number of connections during windowMs milliseconds before sending a 429 response. Defaults to 5. Set to 0 to disable.",
          "postfix": "connections"
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
      },
      "required": [
        "rateLimitBy",
        "message",
        "statusCode"
      ]
    }
  },
  {
    "key": "policy:terminate",
    "type": "policy",
    "name": "terminate",
    "schema": {
      "type": "object",
      "properties": {
        "statusCode": {
          "type": "integer",
          "description": "Status code to return in the response.",
          "default": 400
        },
        "message": {
          "type": "string",
          "description": "String body to return in the response.",
          "default": "Terminated"
        }
      }
    }
  },
  {
    "key": "condition:always",
    "type": "condition",
    "name": "always",
    "description": "",
    "schema": {

    }
  },
  {
    "key": "condition:never",
    "type": "condition",
    "name": "never",
    "description": "",
    "schema": {

    }
  },
  {
    "key": "condition:allOf",
    "type": "condition",
    "name": "allOf",
    "description": "Matches only if all of its parameters match.",
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
    "description": "Matches if at least one of its parameters matches.",
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
    "description": "Invert condition result.",
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
    "description": "Matches if the request’s path matches the given regular expression parameter.",
    "schema": {
      "type": "object",
      "properties": {
        "pattern": {
          "type": "string",
          "description": "Matches if the request’s path matches the given regular expression parameter."
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
    "description": "Matches if the request’s path is equal to path parameter.",
    "schema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string",
          "description": "Matches if the request’s path is equal to path parameter."
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
    "description": "Matches if the request’s method matches the methods parameter. The parameter can be either a string (e.g. ‘GET’) or an array of such strings.",
    "schema": {
      "type": "object",
      "properties": {
        "methods": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "enum": {
            "$ref": "defs.json#/definitions/httpMethods"
          },
          "description": "Matches if the request’s method matches the methods parameter. The parameter can be either a string (e.g. ‘GET’) or an array of such strings."
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
    "description": "Matches if the Host header passed with the request matches the parameter. Parameter pattern should be a wildcard\string expression.",
    "schema": {
      "type": "object",
      "properties": {
        "pattern": {
          "type": "string",
          "description": "Matches if the Host header passed with the request matches the parameter. Parameter pattern should be a wildcard\string expression."
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
    "description": "Matches execution result of JS code provided in expression property. Code is executed in limited space that has access only to egContext.",
    "schema": {
      "type": "object",
      "properties": {
        "expression": {
          "$ref": "defs.json#/definitions/jscode",
          "description": "Matches execution result of JS code provided in expression property. Code is executed in limited space that has access only to egContext."
        }
      },
      "required": [
        "expression"
      ]
    }
  }
];
