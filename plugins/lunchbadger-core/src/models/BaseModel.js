import uuid from 'uuid';
import Connections from '../stores/Connections';

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
  loaded = true;
  slugifyName = false;
  zoomWindow = {
    width: 470,
    height: 600,
  };
  _locked = false;

  static deserializers = {};

  constructor(id) {
    if (id) {
      this.id = id;
    } else {
      this.id = uuid.v4();
    }
  }

  static create(data) {
    const object = new this(data[this.idField]);

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

  /*
   * By default the 'id' field from the data given to the constructor will be
   * used as the ID of the new object. Override this getter to change the name
   * of the ID variable to use.
   *
   * This can be useful if the value in the ID field that comes from the server
   * is not the correct value to use.
   */
  static get idField() {
    return 'id';
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

  getHighlightedPorts() {
    return this.ports;
  }

  toModelJSON() {
    return undefined;
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

  get gaType() {
    return this.constructor.type;
  }

  set locked(locked) {
    return this._locked = locked;
  }

  get locked() {
    return this._locked;
  }

  connectedPorts(selectedSubelementIds) {
    const ids = Object.keys(
      this.getHighlightedPorts(selectedSubelementIds)
        .map(({id}) => id)
        .reduce((prev, curr) => {
          prev[curr] = 1;
          return prev;
        }, {})
    );
    return ids
      .reduce((prev, curr) => [
        ...prev,
        ...Connections.search({fromId: curr}),
        ...Connections.search({toId: curr}),
      ], [])
      .filter(({info: {connection}}) => !!connection && connection.source && connection.target)
      .map(({fromId, toId, info: {connection}}) => {
        const {source, target} = connection;
        const sourceClassList = source.parentElement.classList;
        const targetClassList = target.parentElement.classList;
        const fromDir = sourceClassList.contains('port-out') ? 'out' : 'in';
        const toDir = targetClassList.contains('port-in') ? 'in' : 'out';
        return {[fromId]: fromDir, [toId]: toDir, connection};
      });
  }

}
