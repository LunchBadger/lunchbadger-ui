import uuid from 'uuid';

export default class BaseModel {
  _id = null;

  constructor(id) {
    if (id) {
      this.id = id;
    } else {
      this.id = uuid.v4();
    }
  }

  static create(data) {
    const object = new this();

    Object.keys(data).forEach((propertyName) => {
      if (data.hasOwnProperty(propertyName)) {
        object[propertyName] = data[propertyName];
      }
    });

    return object;
  }

  set id(id) {
    this._id = id;

    return this;
  }

  get id() {
    return this._id;
  }
}
