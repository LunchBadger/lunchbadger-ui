import BaseStore from './BaseStore';
import {register} from '../dispatcher/AppDispatcher';
import _ from 'lodash';

const Backends = [];

class Backend extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'UpdateBackendOrder':
          Backends.splice(action.itemOrder, 0, Backends.splice(action.hoverOrder, 1)[0]);
          this.setEntitiesOrder(Backends);
          this.emitChange();
          break;
        case 'AddDataSource':
          Backends.push(action.dataSource);
          action.dataSource.itemOrder = Backends.length - 1;
          this.emitChange();
          break;

        case 'UpdateDataSource':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Backends;
  }

  findEntity(id) {
    id = this.formatId(id);
    
    return _.find(Backends, {id: id});
  }

}

export default new Backend;
