import BaseModel from './BaseModel';
import Port from './Port';

export default class DataSource extends BaseModel {
  type = 'DataSource';
  _ports = [];

  constructor(id, name) {
    super(id);

    this.name = name;

    this.ports = [
      Port.create({
        id: this.id,
        portGroup: 'backend',
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
