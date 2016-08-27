import {EventEmitter} from 'events';
import {register} from '../dispatcher/AppDispatcher';
import _ from 'lodash';

export default class BaseStore extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(400);
  }

  subscribe(actionSubscribe) {
    this._dispatchToken = register(actionSubscribe());
  }

  get dispatchToken() {
    return this._dispatchToken;
  }

  emitChange() {
    setTimeout(() => {
      this.emit('CHANGE');
    });
  }

  emitInit() {
    this.emit('INIT');
  }

  addChangeListener(callback) {
    this.on('CHANGE', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('CHANGE', callback);
  }

  addInitListener(callback) {
    this.once('INIT', callback);
  }

  removeInitListener(callback) {
    this.removeListener(callback);
  }

  findEntity() {
    return null;
  }

  updateEntity(id, data) {
    const entity = this.findEntity(id);

    if (entity) {
      entity.update(data);
    }
  }

  setEntitiesOrder(store) {
    return _.each(store, function (entity, index) {
      if (entity) {
        entity.itemOrder = index;
      }
    });
  }

  sortItems(items) {
    return _.sortBy(items, (item) => {
      return item.itemOrder;
    });
  }

  formatId(id) {
    const idSplit = id.split('_');

    return idSplit.slice(-1)[0];
  }
}
