import BaseModel from './BaseModel';

export default class Port extends BaseModel {
  static type = 'Port';

  _portGroup = null;

  _portType = null;

  constructor(id, portGroup, portType) {
    super(id);

    this._portGroup = portGroup;
    this._portType = portType;
  }

  set portGroup(portGroup) {
    this._portGroup = portGroup;
  }

  get portGroup() {
    return this._portGroup;
  }

  set portType(portType) {
    this._portType = portType;
  }

  get portType() {
    return this._portType;
  }
}
