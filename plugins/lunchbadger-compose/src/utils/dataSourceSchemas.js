import React from 'react';

const host = {
  type: 'string',
  description: 'Database host name',
};

const port = {
  type: 'number',
  description: 'Database TCP port',
};

const database = {
  type: 'string',
  description: 'Database name',
};

const username = {
  type: 'string',
  description: 'Username to connect to database',
};

const password = {
  type: 'string',
  description: 'Password to connect to database',
  password: true,
};

const commonProperties = {
  host,
  port,
  database,
  username,
  password,
};

const required = [
  'host',
  'port',
  'database',
  'username',
];

const canvas = [
  'host',
  'port',
  'database',
  'username',
  'password',
  'url',
];

export default {
  mongodb: {
    properties: {
      ...commonProperties,
      url: {
        type: 'string',
        description: (
          <div>
            Connection URL of form <code>{'mongodb://user:password@host/db'}</code>.
            Overrides other connection settings.
            In order to leverage the DNS seedlist, use a connection string prefix of <code>mongodb+srv:</code>.
          </div>
        ),
      },
      authSource: {
        type: 'string',
        description: 'Authentification database name',
      },
      allowExtendedOperators: {
        type: 'boolean',
        description: <div>enable using MongoDB operators such as <code>$currentDate</code>, <code>$inc</code>, <code>$max</code>, <code>$min</code>, <code>$mul</code>, <code>$rename</code>, <code>$setOnInsert</code>, <code>$set</code>, <code>$unset</code>, <code>$addToSet</code>, <code>$pop</code>, <code>$pullAll</code>, <code>$pull</code>, <code>$pushAll</code>, <code>$push</code>, and <code>$bit</code>.</div>,
      },
      enableGeoIndexing: {
        type: 'boolean',
        description: <div>Enable 2dsphere indexing for model properties of type <code>GeoPoint</code>. This allows for indexed <code>near</code> queries.</div>,
      },
      lazyConnect: {
        type: 'boolean',
        description: 'Enable, so database instance will not be attached to the datasource and the connection is deferred. It will try to establish the connection automatically once users hit the endpoint. If the mongodb server is offline, the app will start, however, the endpoints will not work.',
      },
      disableDefaultSort: {
        type: 'boolean',
        description: <div>Disable the default sorting behavior on <code>id</code> column, this will help performance using indexed columns available in mongodb.</div>,
      },
      reconnect: {
        type: 'boolean',
        description: 'Server will attempt to reconnect on loss of connection.',
      },
      reconnectTries: {
        type: 'number',
        description: <div>Server attempt to reconnect <code>#</code> times.</div>,
      },
      reconnectInterval: {
        type: 'number',
        description: <div>Server will wait <code>#</code> milliseconds between retries.</div>,
      },
      emitError: {
        type: 'boolean',
        description: 'Server will emit errors events.',
      },
      size: {
        type: 'number',
        description: 'Server connection pool size.',
      },
      keepAlive: {
        type: 'boolean',
        description: 'TCP Connection keep alive enabled.',
      },
      keepAliveInitialDelay: {
        type: 'number',
        description: 'Initial delay before TCP keep alive enabled.',
      },
      noDelay: {
        type: 'boolean',
        description: 'TCP Connection no delay.',
      },
      connectionTimeout: {
        type: 'number',
        description: 'TCP Connection timeout setting.',
      },
      socketTimeout: {
        type: 'number',
        description: 'TCP Socket timeout setting.',
      },
      singleBufferSerializtion: {
        type: 'boolean',
        description: 'Serialize into single buffer, trade of peak memory for serialization speed.',
      },
      ssl: {
        type: 'boolean',
        description: 'Use SSL for connection.',
      },
      passphrase: {
        type: 'string',
        description: 'SSL Certificate pass phrase.',
      },
      rejectUnauthorized: {
        type: 'boolean',
        description: 'Reject unauthorized server certificates.',
      },
      promoteLongs: {
        type: 'boolean',
        description: 'Convert Long values from the db into Numbers if they fit into 53 bits.',
      },
    },
    required,
    canvas,
  },
  redis: {
    properties: {
      ...commonProperties,
      url: {
        type: 'string',
        description: (
          <div>
            Connection URL of form <code>{'redis://user:password@host/db'}</code>.
            Overrides other connection settings.
          </div>
        ),
      },
    },
    required,
    canvas,
  },
  mysql: {
    properties: {
      ...commonProperties,
      url: {
        type: 'string',
        description: (
          <div>
            Connection URL of form <code>{'mysql://user:password@host/db'}</code>.
            Overrides other connection settings.
          </div>
        ),
      },
      collation: {
        type: 'string',
        description: 'Determines the charset for the connection.',
      },
      connectionLimit: {
        type: 'number',
        description: 'The maximum number of connections to create at once.',
      },
      debug: {
        type: 'boolean',
        description: 'Turn on verbose mode to debug database queries and lifecycle.',
      },
      socketPath: {
        type: 'string',
        description: <div>The path to a unix domain socket to connect to. When used <code>host</code> and <code>port</code> are ignored.</div>,
      },
      supportBigNumbers: {
        type: 'boolean',
        description: <div>Enable this option to deal with big numbers (<code>BIGINT</code> and <code>DECIMAL</code> columns) in the database.</div>,
      },
      timezone: {
        type: 'string',
        description: 'The timezone used to store local dates.',
      },
      localAddress: {
        type: 'string',
        description: 'The source IP address to use for TCP connection.',
      },
      connectTimeout: {
        type: 'number',
        description: 'The milliseconds before a timeout occurs during the initial connection to the MySQL server.',
      },
      stringifyObjects: {
        type: 'boolean',
        description: 'Stringify objects instead of converting to values.',
      },
      insecureAuth: {
        type: 'boolean',
        description: 'Allow connecting to MySQL instances that ask for the old (insecure) authentication method.',
      },
      typeCast: {
        type: 'boolean',
        description: 'Determines if column values should be converted to native JavaScript types.',
      },
      bigNumberStrings: {
        type: 'boolean',
        description: (
          <div>
            Enabling both supportBigNumbers and bigNumberStrings forces big numbers (<code>BIGINT</code> and <code>DECIMAL</code> columns) to be always returned as JavaScript String objects. Enabling <code>supportBigNumbers</code> but leaving <code>bigNumberStrings</code> disabled will return big numbers as String objects only when they cannot be accurately represented with [JavaScript Number objects] (which happens when they exceed the [-2^53, +2^53] range), otherwise they will be returned as Number objects. This option is ignored if <code>supportBigNumbers</code> is disabled.
          </div>
        ),
      },
      dateStrings: {
        types: ['boolean', 'array'],
        items: {type: 'string'},
        description: 'Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript Date objects. Can be <code>true</code>/<code>false</code> or an array of type names to keep as strings.',
      },
      trace: {
        type: 'boolean',
        description: <div>Generates stack traces on <code>Error</code> to include call site of library entrance ("long stack traces"). Slight performance penalty for most calls.</div>,
      },
      multipleStatements: {
        type: 'boolean',
        description: 'Allow multiple mysql statements per query. Be careful with this, it could increase the scope of SQL injection attacks.',
      },
    },
    required,
    canvas,
  },
  postgresql: {
    properties: {
      ...commonProperties,
      url: {
        type: 'string',
        description: (
          <div>
            Connection URL of form <code>{'postgres://user:password@host/db'}</code>.
            Overrides other connection settings.
          </div>
        ),
      },
      debug: {
        type: 'boolean',
        description: 'Turn on verbose mode to debug database queries and lifecycle.',
      },
      min: {
        type: 'integer',
        description: 'Minimum number of clients in the connection pool.',
      },
      max: {
        type: 'integer',
        description: 'Maximum number of clients in the connection pool.',
      },
      idleTimeoutMillis: {
        type: 'integer',
        description: 'Maximum time a client in the pool has to stay idle before closing it.',
      },
      ssl: {
        type: 'boolean',
        description: 'Whether to try SSL/TLS to connect to server',
      },
    },
    required,
    canvas,
  },
  web3: {
    properties: {
      url: {
        type: 'string',
      },
    },
    required: ['url'],
    canvas: ['url'],
  },
  salesforce: {
    properties: {
      username,
      password: {
        ...password,
        contextual: 'Password should be a concatenation of the Salesforce password and API token',
      },
    },
    required: ['username'],
    canvas: ['username', 'password'],
  },
  manta: {
    properties: {
      url: {
        type: 'string',
      },
      user: {
        type: 'string',
      },
      subuser: {
        type: 'string',
      },
      keyId: {
        type: 'string',
      },
      privateKeyPath: {
        type: 'string',
      },
      rootDirectory: {
        type: 'string',
      },
    },
    required: ['url', 'user', 'keyId'],
    canvas: ['url', 'user', 'subuser', 'keyId'],
  },
};
