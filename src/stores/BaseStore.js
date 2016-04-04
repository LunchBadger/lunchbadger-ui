import {EventEmitter} from 'events';
import {register} from '../dispatcher/AppDispatcher';

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
    this.on('CHANGE', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('CHANGE', callback);
  }

  findEntity(id) {
    return null;
  }

  updateEntity(id, data) {
    const entity = this.findEntity(id);

    if (entity) {
      entity.update(data);
    }
  }
}
