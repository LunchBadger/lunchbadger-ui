import BaseModel from './BaseModel';
import Port from './Port';
import portGroups from '../constants/portGroups';
import ModelProperty from 'models/ModelProperty';

const defaultProperties = [
  ModelProperty.create({
    propertyKey: 'key',
    propertyValue: 'value'
  })
];

export default class Model extends BaseModel {
  static type = 'Model';
  _ports = [];
  _properties = [];

  constructor(id, name) {
    super(id);

    this.name = name;

    this.properties = defaultProperties;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PRIVATE,
        portType: 'in'
      }),
      Port.create({
        id: this.id,
        portGroup: portGroups.GATEWAYS,
        portType: 'out'
      })
    ];


  }

  /**
   * @param properties {Properties[]}
   */
  set properties(properties) {
    this._properties = properties;
  }

  /**
   * @returns {Properties[]}
   */
  get properties() {
    return this._properties;
  }

  /**
   * @param policy {Property}
   */
  addProperty(property) {
    this._properties.push(property);
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }
}
