import _ from 'lodash';

const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;
const Backends = [];

class Backend extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'InitializeBackend':
          Backends.push.apply(Backends, action.data);
          this.emitInit();
          break;
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
        case 'RemoveEntity':
          _.remove(Backends, {id: action.entity.id});
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
