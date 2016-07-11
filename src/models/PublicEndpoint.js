const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class PublicEndpoint extends BaseModel {
  static type = 'PublicEndpoint';
  _ports = [];
  wasBundled = false;
  url = 'https://root/endpoint';

  constructor(id, name) {
    super(id);

    this.name = name;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PUBLIC,
        portType: 'in'
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
}
