import uuid from 'uuid';

export default class BaseModel {
  _id = null;

  /**
   * Indicates if given entity is deployed and ready to work
   * @type {boolean}
   * @private
   */
  _ready = true;
  left = 0;
  top = 0;
  itemOrder = 0;

  static deserializers = {};

  constructor(id) {
    if (id) {
      this.id = id;
    } else {
      this.id = uuid.v4();
    }
  }

  static create(data) {
    const object = new this(data.id);

    Object.keys(data).forEach((propertyName) => {
      if (propertyName === 'id') {
        return;
      }
      if (data.hasOwnProperty(propertyName)) {
        if (this.deserializers[propertyName]) {
          this.deserializers[propertyName](object, data[propertyName]);
        } else {
          object[propertyName] = data[propertyName];
        }
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
        if (this.constructor.deserializers[propertyName]) {
          this.constructor.deserializers[propertyName](this, data[propertyName]);
        } else {
          this[propertyName] = data[propertyName];
        }
      }
    });
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set ready(ready) {
    return this._ready = ready;
  }

  get ready() {
    return this._ready;
  }
}
