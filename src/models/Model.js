import BaseModel from './BaseModel';
import Port from './Port';
import portGroups from '../constants/portGroups';
import ModelProperty from 'models/ModelProperty';
import _ from 'lodash';

const defaultProperty = ModelProperty.create({
  propertyKey: 'key',
  propertyValue: 'value',
  propertyType: 'type',
  propertyIsRequired: true,
  propertyIsIndex: true,
  propertyNotes: 'sth'
});

export default class Model extends BaseModel {
  static type = 'Model';
  _ports = [];
  _properties = [];
  contextPath = 'model';

  constructor(id, name) {
    super(id);

    this.name = name;

    this.addProperty(defaultProperty);

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
   * @param property {Property}
   */
  addProperty(property) {
    this._properties.push(property);
  }

  /**
   * @param property {Property}
   */
  removeProperty(property) {
    _.remove(this._properties, function (prop) {
      return prop.id === property.id
    });
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }
}
