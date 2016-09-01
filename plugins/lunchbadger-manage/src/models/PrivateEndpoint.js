const BaseModel = LunchBadgerCore.models.BaseModel;
const portGroups = LunchBadgerCore.constants.portGroups;
const Port = LunchBadgerCore.models.Port;

export default class PrivateEndpoint extends BaseModel {
  static type = 'PrivateEndpoint';
  _ports = [];
  url = 'https://private/endpoint';

  constructor(id, name) {
    super(id);

    this.name = name;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.GATEWAYS,
        portType: 'out'
      })
    ];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      itemOrder: this.itemOrder
    }
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }

  // The default/initial REST path to be used when auto-creating a public
  // endpoint associated with this.
  get contextPath() {
    return this.name.toLowerCase().replace(/ /g, '-');
  }
}
