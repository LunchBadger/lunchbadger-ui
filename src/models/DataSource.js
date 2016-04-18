import BaseModel from './BaseModel';
import Port from './Port';

export default class DataSource extends BaseModel {
  type = 'DataSource';

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
  _schema = '';

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

  constructor(id, name) {
    super(id);

    this.name = name;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: 'private',
        portType: 'out'
      })
    ];
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

  get schema() {
    return this._schema;
  }

  set schema(schema) {
    this._schema = schema;
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
}
