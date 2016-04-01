import uuid from 'uuid';

export default class BaseModel {
  _id = uuid.v1();

  constructor(id) {
    if (id) {
      this.id = id;
    }
  }

  set id(id) {
    this._id = id;

    return this;
  }

  get id() {
    return this._id;
  }
}
