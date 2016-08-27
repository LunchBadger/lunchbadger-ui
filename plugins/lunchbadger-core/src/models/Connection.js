import BaseModel from './BaseModel';

export default class Connection extends BaseModel {
  static type = 'Connection';
  _fromId = null;
  _toId = null;
  _info = null;

  constructor(id, fromId, toId, info) {
    super(id);

    this._fromId = fromId;
    this._toId = toId;
    this._info = info;
  }

  toJSON() {
    return {
      id: this.id,
      fromId: this.fromId,
      toId: this.toId
    }
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
  
  get info() {
    return this._info;
  }
  
  set info(info) {
    this._info = info;
  }
}
