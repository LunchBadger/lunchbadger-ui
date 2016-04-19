import BaseModel from './BaseModel';

export default class Connection extends BaseModel {
  static type = 'Connection';
  _fromId = null;
  _toId = null;

  constructor(id, fromId, toId) {
    super(id);

    this._fromId = fromId;
    this._toId = toId;
  }

  get fromId() {
    return this._fromId;
  }

  set fromId(fromId) {
    this._fromId = fromId;
  }

  get toId() {
    return this._toId;
  }

  set toId(toId) {
    this._toId = toId;
  }
}
