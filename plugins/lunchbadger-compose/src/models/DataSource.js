import {update, remove} from '../reduxActions/dataSources';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class DataSource extends BaseModel {
  static type = 'DataSource';

  /**
   * Collection of ports
   * @type {Port[]}
   * @private
   */
  _ports = [];

  /**
   * @type {String}
   * @private
   */
  _url = '';

  /**
   * @type {String}
   * @private
   */
  _host = '';

  /**
   * @type {String}
   * @private
   */
  _port = '';

  /**
   * @type {String}
   * @private
   */
  _database = '';

  /**
   * @type {String}
   * @private
   */
  _user = ''; // in MySQL

  /**
   * @type {String}
   * @private
   */
  _username = '';

  /**
   * @type {String}
   * @private
   */
  _password = '';

  /**
   * @type {String}
   * @private
   */
  _type = '';

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
      user: this.user,
      username: this.username,
      password: this.password,
      itemOrder: this.itemOrder,
      lunchbadgerId: this.id,
    };
    if (this.connector === 'mysql') {
      delete json.url;
      json.host = this.host;
      json.port = this.port;
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

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;
  }

  get username() {
    return this._username;
  }

  set username(username) {
    this._username = username;
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
      const isMySql = model.hasOwnProperty('port');
      const fields = isMySql
        ? ['name', 'host', 'port', 'database', 'user', 'password']
        : ['name', 'url', 'database', 'username', 'password'];
      checkFields(fields, model, validations.data);
      if (isMySql && model.port !== '') {
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

}
