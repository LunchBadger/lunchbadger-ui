import React from 'react';

const argumentDescriptions = {
  arg: {
    type: 'string',
    description: 'Argument name.',
  },
  description: {
    type: 'string',
    description: 'A text description of the argument. This is used by API documentation generators like OpenAPI (formerly Swagger).',
  },
  http: {
    type: 'object',
    description: 'For input arguments: an object describing mapping from HTTP request to the argument value.',
    properties: {
      source: {
        type: 'string',
        description:
          <div>
            Specify HTTP mapping for input parameters:
            <ul>
              <li><code>body</code> - The whole request body is used as the value.</li>
              <li><code>form</code> - The value is looked up using <code>req.body</code> which searches the request body.</li>
              <li><code>query</code> - The value is looked up using <code>req.query</code> which searches the query string.</li>
              <li><code>path</code> - The value is looked up using <code>req.params</code> which searches the route arguments.</li>
              <li><code>req</code> - The Express HTTP request object.</li>
              <li><code>res</code> - The Express HTTP response object.</li>
              <li><code>context</code> - The whole context object, which holds request and response objects.</li>
            </ul>
          </div>,
        enum: [
          'body',
          'form',
          'query',
          'path',
          'req',
          'res',
          'context',
        ]
      },
    },
  },
  'http.target': {
    type: 'string',
    description:
      <div>
        Map the callback argument value to the HTTP response object. The following values are supported:
        <ul>
          <li><code>status</code> sets the <code>res.statusCode</code> to the provided value</li>
          <li><code>header</code> sets the <code>http.header</code> or arg named header to the value</li>
        </ul>
      </div>,
    enum: [
      'status',
      'header',
    ],
  },
  required: {
    type: 'boolean',
    description: <div><code>true</code> if argument is required; <code>false</code> otherwise.</div>,
  },
  root: {
    type: 'boolean',
    description: <div>For callback arguments: set this property to <code>true</code> if your function has a single callback argument to use as the root object returned to remote caller. Otherwise the root object returned is a map (argument-name to argument-value).</div>,
  },
  type: {
    type: 'string',
    description: 'Argument datatype.',
    enum: [
      'String',
      'Number',
      'Date',
      'Boolean',
      'GeoPoint',
      'Array',
      'Object',
      'Buffer',
    ],
  },
  default: {
    type: 'string',
    description: 'Default value that will be used to populate loopback-explorer input fields and swagger documentation. Note: This value will not be passed into remote methods function if argument is not present.',
  },
  documented: {
    type: 'boolean',
    description: <div>If set to <code>false</code>, this parameter will not be present in generated OpenAPI (formerly Swagger) documentation.</div>,
  },
};

const schemas = {
  methods: {
    properties: {
      accepts: {
        type: 'array',
        types: ['array'],
        items: {
          type: 'object',
          types: ['object'],
          properties: argumentDescriptions,
        },
        description: 'Defines arguments that the remote method accepts that map to the static method you define.',
      },
      accessScopes: {
        type: 'array',
        description: <div>Defines access scopes. A user will be allowed to invoke this remote method only when their access token was granted at least one of the scopes defined by <code>accessScopes</code> list.</div>,
        items: {
          type: 'string',
        },
      },
      description: {
        type: 'string',
        description: 'Text description of the method, used by API documentation generators such as OpenAPI (formerly Swagger).',
      },
      http: {
        type: 'object',
        description: <div>The <code>http</code> property provides information on HTTP route at which the remote method is exposed.</div>,
        properties: {
          path: {
            type: 'string',
            description: 'HTTP path (relative to the model) at which the method is exposed.',
          },
          verb: {
            type: 'string',
            description: 'HTTP method (verb) at which the method is available.',
            default: 'post',
            enum: [
              'get',
              'post',
              'patch',
              'put',
              'del',
              'all',
            ],
          },
          status: {
            type: 'integer',
            description: 'Default HTTP status set when the callback is called without an error.',
          },
          errorStatus: {
            type: 'integer',
            description: 'Default HTTP status set when the callback is called with an error.',
          },
        },
      },
      notes: {
        type: 'string',
        description: 'Additional notes, used by OpenAPI (formerly Swagger). ',
      },
      documented: {
        type: 'boolean',
        description: <div>If set to <code>false</code>, this method will not be present in generated OpenAPI (formerly Swagger) documentation.</div>,
      },
      returns: {
        type: 'array',
        types: ['array'],
        items: {
          type: 'object',
          types: ['object'],
          properties: argumentDescriptions,
        },
        description: <div>Describes the remote method''s callback arguments. The <code>err</code> argument is assumed; do not specify. Default if not provided is the empty array, <code>[]</code>.</div>,
        properties: argumentDescriptions,
      },
    },
  },
};

export default schemas;
