import BaseModel from './BaseModel';
import Port from './Port';
import portGroups from '../constants/portGroups';

export default class DataSource extends BaseModel {
  static type = 'DataSource';
  _ports = [];

  constructor(id, name) {
    super(id);

    this.name = name;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PRIVATE,
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
