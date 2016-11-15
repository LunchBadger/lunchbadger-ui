import _ from 'lodash';

const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Backends = [];

class Backend extends BaseStore {
  constructor() {
    super();
    register((action) => {
      this.handleBaseActions('Backend', ['DataSource'], action);
    });
  }

  getData() {
    return Backends;
  }

  setData(data) {
    Backends = data;
  }

  findEntity(id) {
    id = this.formatId(id);

    return _.find(Backends, {id: id});
  }

}

export default new Backend;
