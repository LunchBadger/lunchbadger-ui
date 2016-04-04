import BaseStore from 'stores/BaseStore';
import {register} from '../dispatcher/AppDispatcher';
import _ from 'lodash';

const Backends = [];

class Backend extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'AddDataSource':
          action.dataSource.name += ' ' + (Backends.length + 1);
          Backends.push(action.dataSource);
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
    return _.find(Backends, {id: id});
  }
}

export default new Backend;
