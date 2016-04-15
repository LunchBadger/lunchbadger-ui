import BaseModel from './BaseModel';
import Port from './Port';

export default class PublicEndpoint extends BaseModel {
  type = 'PublicEndpoint';
  _ports = [];
  url = 'http://url.com';

  constructor(id, name) {
    super(id);

    this.name = name;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: 'public',
        portType: 'in'
      })
    ];
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }
}
