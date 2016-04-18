import uuid from 'uuid';

export default class BaseModel {
  _id = null;
  left = 0;
  top = 0;

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

  remove() {
    delete this;
  }

  update(data) {
    Object.keys(data).forEach((propertyName) => {
      if (data.hasOwnProperty(propertyName)) {
        this[propertyName] = data[propertyName];
      }
    });
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}
