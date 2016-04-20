import BaseStore from 'stores/BaseStore';
import update from 'react/lib/update';
import {register} from '../dispatcher/AppDispatcher';
import _ from 'lodash';

const Publics = [];

class Public extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'UpdatePublicOrder':
          Publics.splice(action.itemOrder, 0, Publics.splice(action.hoverOrder, 1)[0]);
          this.setEntitiesOrder(Publics);
          this.emitChange();
          break;
        case 'AddPublicEndpoint':
          Publics.push(action.endpoint);
          action.endpoint.itemOrder = Publics.length - 1;
          this.emitChange();
          break;
        case 'RemovePublicEndpoint':
          Publics.splice(this.findEntityIndex(action.endpoint.id), 1);
          action.endpoint.remove();
          this.emitChange();
          break;
        case 'UpdatePublicEndpoint':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'MovePublicEndpoint':
          Publics.push(action.endpoint);
          this.emitChange();
          break;
        case 'AddAPI':
          Publics.push(action.API);
          action.API.itemOrder = Publics.length - 1;
          this.emitChange();
          break;
        case 'UpdateAPI':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'AddEndpoint':
          action.api.addEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'RemoveEndpoint':
          action.api.removeEndpoint(action.endpoint);
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Publics;
  }

  findEntity(id) {
    return _.find(Publics, {id: id});
  }

  findEntityIndex(id) {
    return _.findIndex(Publics, {id: id});
  }
}

export default new Public;
