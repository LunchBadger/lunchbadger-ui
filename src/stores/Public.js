import BaseStore from 'stores/BaseStore';
import {register} from '../dispatcher/AppDispatcher';
import PublicEndpoint from '../models/PublicEndpoint';
import _ from 'lodash';

const Publics = [];

class Public extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'AddPublicEndpoint':
          Publics.push(action.endpoint);
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
        case 'AddAPI':
          Publics.push(action.API);
          this.emitChange();
          break;
        case 'UpdateAPI':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'AddEndpoint':
          action.api.addEndpoint(PublicEndpoint.create({name: action.name}));
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
