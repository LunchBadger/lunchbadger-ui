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

  /**
   * @type {String}
   * @private
   */
  _type = '';

  constructor(id, name, type) {
    super(id);

    this.name = name;
    this.type = type;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PRIVATE,
        portType: 'out'
      })
    ];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      url: this.url,
      schema: this.schema,
      username: this.username,
      password: this.password
    }
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

  get type() {
    return this._type;
  }

  set type(type) {
    this._type = type;
  }
}
