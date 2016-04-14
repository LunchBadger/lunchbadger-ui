import BaseStore from 'stores/BaseStore';
import {register} from '../dispatcher/AppDispatcher';
import _ from 'lodash';

const Privates = [];

class Private extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'AddPrivateEndpoint':
          Privates.push(action.endpoint);
          this.emitChange();
          break;

        case 'AddModel':
          Privates.push(action.model);
          this.emitChange();
          break;

        case 'UpdatePrivateEndpoint':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;

        case 'UpdateModel':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Privates;
  }

  findEntity(id) {
    return _.find(Privates, {id: id});
  }
}

export default new Private;
