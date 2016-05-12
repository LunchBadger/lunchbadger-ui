import _ from 'lodash';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class Model extends BaseModel {
  static type = 'Model';
  _ports = [];
  _properties = [];
  contextPath = 'model';

  constructor(id, name) {
    super(id);

    this.name = name;

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
