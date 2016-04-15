import BaseModel from './BaseModel';
import Port from './Port';
import portGroups from '../constants/portGroups';

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
        portGroup: portGroups.GATEWAYS,
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
