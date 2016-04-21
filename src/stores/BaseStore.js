import {EventEmitter} from 'events';
import {register} from '../dispatcher/AppDispatcher';
import _ from 'lodash';

export default class BaseStore extends EventEmitter {
  constructor() {
    super();
  }

  subscribe(actionSubscribe) {
    this._dispatchToken = register(actionSubscribe());
  }

  get dispatchToken() {
    return this._dispatchToken;
  }

  emitChange() {
    this.emit('CHANGE');
  }

  addChangeListener(callback) {
    this.on('CHANGE', _.bind(_.debounce(callback), this));
  }

  removeChangeListener(callback) {
    this.removeListener('CHANGE', callback);
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
    console.log(store);
    return _.each(store, function (entity, index) {
      console.log(entity, index);
      entity.itemOrder = index;
    });
  }
}
