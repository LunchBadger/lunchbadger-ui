import _ from 'lodash';

const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Backends = [];

class Backend extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'InitializeBackend':
          Backends.push.apply(Backends, action.data);
          Backends = this.sortItems(Backends);
          this.emitInit();
          break;
        case 'UpdateBackendOrder':
          _.remove(Backends, action.entity);
          Backends.splice(action.hoverOrder, 0, action.entity);
          Backends = this.sortItems(this.setEntitiesOrder(Backends));
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
