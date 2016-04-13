import BaseModel from './BaseModel';

export default class Port extends BaseModel {
  type = 'Port';

  _portGroup = null;

  _portType = null;

  _DOMReference = null;

  constructor(id, portGroup, portType, DOMReference) {
    super(id);

    this._portGroup = portGroup;
    this._portType = portType;
    this._DOMReference = DOMReference;
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

  set DOMReference(DOMReference) {
    this._DOMReference = DOMReference;
  }

  get DOMReference() {
    return this._DOMReference;
  }
}
