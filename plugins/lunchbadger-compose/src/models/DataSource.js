import _ from 'lodash';
import {update, remove} from '../reduxActions/dataSources';
import predefinedRests from '../utils/predefinedRests';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class DataSource extends BaseModel {
  static type = 'DataSource';
  static entities = 'dataSources';

  _ports = [];
  _url = '';
  _host = '';
  _port = '';
  _database = '';
  _username = '';
  _subuser = '';
  _keyId = '';
  _password = '';
  _type = '';
  predefined = 'custom';
  operations = _.merge([], predefinedRests.custom.operations);
  options = undefined;
  wsdl = '';
  wsdl_options = {
    rejectUnauthorized: false,
    strictSSL: false,
    requestCert: false,
  };
  remotingEnabled: false;
  security = {
    scheme: 'WS',
    username: '',
    password: '',
    passwordType: 'PasswordText',
    keyPath: '',
    certPath: '',
  };
  soapOperations = {};
  soapHeaders = [];

  constructor(id, name, connector) {
    super(id);
    this.name = name;
    this.connector = connector;
    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PRIVATE,
        portType: 'out'
      })
    ];
  }

  recreate() {
    return DataSource.create(this);
  }

  static get idField() {
    return 'lunchbadgerId';
  }

  toJSON() {
    const json = {
      id: this.workspaceId,
      facetName: 'server',
      name: this.name,
      connector: this.connector,
      url: this.url,
      database: this.database,
      username: this.username,
      password: this.password,
      itemOrder: this.itemOrder,
      lunchbadgerId: this.id,
    };
    if (this.isWithPort) {
      delete json.url;
      json.host = this.host;
      json.port = this.port;
    }
    if (this.isRest) {
      delete json.url;
      delete json.database;
      delete json.username;
      delete json.password;
      json.predefined = this.predefined;
      json.options = this.options;
      json.operations = this.operations;
    }
    if (this.isSoap || this.isEthereum) {
      delete json.database;
      delete json.username;
      delete json.password;
    }
    if (this.isSalesforce) {
      delete json.url;
      delete json.database;
    }
    if (this.isTritonObjectStorage) {
      delete json.database;
      delete json.username;
      delete json.password;
      json.user = this.username;
      json.subuser = this.subuser;
      json.keyId = this.keyId;
    }
    if (this.isSoap) {
      const {wsdl, wsdl_options, remotingEnabled, security, operations, soapHeaders} = this;
      Object.assign(json, {wsdl, wsdl_options, remotingEnabled, security, operations, soapHeaders});
    }
    return json;
  }

  get workspaceId() {
    return `server.${this.name}`;
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }

  get url() {
    return this._url;
  }

  set url(url) {
    this._url = url;
  }

  get host() {
    return this._host;
  }

  set host(host) {
    this._host = host;
  }

  get port() {
    return this._port;
  }

  set port(port) {
    this._port = port.toString();
  }

  get database() {
    return this._database;
  }

  set database(database) {
    this._database = database;
  }

  get username() {
    return this._username;
  }

  set username(username) {
    this._username = username;
  }

  get user() {
    return this._username;
  }

  set user(username) {
    this._username = username;
  }

  get subuser() {
    return this._subuser;
  }

  set subuser(subuser) {
    this._subuser = subuser;
  }

  get keyId() {
    return this._keyId;
  }

  set keyId(keyId) {
    this._keyId = keyId;
  }

  get password() {
    return this._password;
  }

  set password(password) {
    this._password = password;
  }

  get connector() {
    return this._connector;
  }

  set connector(connector) {
    this._connector = connector;
  }

  get isWithPort() {
    return ['mysql', 'mongodb', 'redis'].includes(this._connector);
  }

  get isMemory() {
    return this._connector === 'memory';
  }

  get isRest() {
    return this._connector === 'rest';
  }

  get isSoap() {
    return this._connector === 'soap';
  }

  get isEthereum() {
    return this._connector === 'web3';
  }

  get isSalesforce() {
    return this._connector === 'salesforce';
  }

  get isMongoDB() {
    return this._connector === 'mongodb';
  }

  get isRedis() {
    return this._connector === 'redis';
  }

  get isTritonObjectStorage() {
    return this._connector === 'manta';
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.dataSources;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Data Source');
        }
      }
      const withPort = model.hasOwnProperty('port');
      const isRest = model.hasOwnProperty('operations');
      let fields = ['name', 'url', 'database', 'username'];
      if (withPort) {
        fields = ['name', 'host', 'port', 'database', 'username'];
      }
      const isTritonObjectStorage = model.hasOwnProperty('subuser');
      if (isTritonObjectStorage) {
        fields = ['name', 'url', 'user', 'keyId'];
      }
      checkFields(fields, model, validations.data);
      if (withPort && model.port !== '') {
        if (isNaN(+model.port)) {
          validations.data.port = 'Port format is invalid';
        } else {
          model.port = Math.floor(+model.port);
          if (model.port < 0 || model.port >= 65536) {
            validations.data.port = 'Port should be >= 0 and < 65536';
          }
          model.port = model.port.toString();
        }
      }
      if (isRest && model.operations[0].template.url === '') {
        validations.data['baseUrl'] = messages.fieldCannotBeEmpty;
      }
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  update(model) {
    return async dispatch => await dispatch(update(this, model));
  }

  remove() {
    return async dispatch => await dispatch(remove(this));
  }

  processModel(model) {
    const data = _.merge({}, model);
    if (data.hasOwnProperty('predefined')) {
      const options = data.options;
      if (!options.enabled) {
        data.options = undefined;
      } else {
        data.options = {};
        if (options.hasOwnProperty('strictSSL')) {
          data.options.strictSSL = options.strictSSL;
        }
        if (options.hasOwnProperty('useQuerystring')) {
          data.options.useQuerystring = options.useQuerystring;
        }
        if (options.headers.enabled) {
          data.options.headers = {};
          (options.headers.params || []).forEach(({key, value}) => {
            if (key.trim() !== '') {
              data.options.headers[key.trim()] = value;
            }
          });
        }
      }
      if (!data.operations) {
        data.operations = undefined;
      } else {
        data.operations.forEach((operation) => {
          if (!operation.template.options.enabled) {
            operation.template.options = undefined;
          } else {
            delete operation.template.options.enabled;
          }
          const headers = operation.template.headers || [];
          operation.template.headers = {};
          headers.forEach(({key, value}) => {
            if (key.trim() !== '') {
              operation.template.headers[key.trim()] = value;
            }
          });
          const query = operation.template.query || [];
          operation.template.query = {};
          query.forEach(({key, value}) => {
            if (key.trim() !== '') {
              operation.template.query[key.trim()] = value;
            }
          });
          const functions = operation.functions || [];
          operation.functions = {};
          functions.forEach(({key, value}) => {
            if (key.trim() !== '') {
              operation.functions[key.trim()] = value.split(',').map(i => i.trim()).filter(i => i !== '');
            }
          });
        });
      }
    }
    if (data.hasOwnProperty('wsdl')) {
      data.soapOperations = {};
      (model.soapOperations || []).forEach(({key, service, port, operation}) => {
        if (key.trim() !== '') {
          data.soapOperations[key] = {service, port, operation};
        }
      });
      data.soapHeaders = [];
      (model.soapHeaders || []).forEach(({elementKey, elementValue, prefix, namespace}) => {
        if (elementKey.trim() !== '') {
          data.soapHeaders.push({
            element: {
              [elementKey]: elementValue,
            },
            prefix,
            namespace,
          });
        }
      });
    }
    return data;
  }

}
