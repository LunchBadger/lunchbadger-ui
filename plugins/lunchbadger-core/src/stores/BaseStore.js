import {EventEmitter} from 'events';
import {register} from '../dispatcher/AppDispatcher';
import _ from 'lodash';

export default class BaseStore extends EventEmitter {
  constructor(initCalls) {
    super();

    this.initCalls = initCalls || 1;
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

  handleBaseActions(name, types, action) {
    let type = action.type.replace(new RegExp(types.join('|'), 'g'), name);
    let storeObj = this.getData();

    switch (type) {
      case `Initialize${name}`:
        storeObj.push.apply(storeObj, action.data);
        storeObj = this.sortItems(storeObj);

        this.initCalls--;
        if (this.initCalls <= 0) {
          this.emitInit();
        } else {
          this.emitChange();
        }
        break;
      case `Update${name}Order`:
        _.remove(storeObj, action.entity);
        storeObj.splice(action.hoverOrder, 0, action.entity);
        storeObj = this.sortItems(this.setEntitiesOrder(storeObj));
        this.emitChange();
        break;
      case `Add${name}`:
        storeObj.push(action.entity);
        action.entity.itemOrder = storeObj.length - 1;
        this.emitChange();
        break;
      case `Update${name}`:
        this.updateEntity(action.id, action.data);
        this.emitChange();
        break;
      case `Update${name}Start`:
        this.updateEntity(action.id, { ready: false });
        this.emitChange();
        break;
      case `Update${name}End`:
        this.updateEntity(action.id, _.merge(action.data, { ready: true }));
        this.emitChange();
        break;
      case 'RemoveEntity':
        _.remove(storeObj, {id: action.entity.id});
        this.emitChange();
        break;
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

  findEntityByFilter(filter) {
    return _.find(this.getData(), filter);
  }
}
