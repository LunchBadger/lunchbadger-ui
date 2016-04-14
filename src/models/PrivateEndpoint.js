import BaseModel from './BaseModel';
import Port from './Port';

export default class PrivateEndpoint extends BaseModel {
  type = 'PrivateEndpoint';
  _ports = [];
  url = 'http://url.com';

  constructor(id, name) {
    super(id);

    this.name = name;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: 'gateways',
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
}
