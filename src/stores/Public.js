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
          action.endpoint.name += ' ' + (Publics.length + 1);
          Publics.push(action.endpoint);
          this.emitChange();
          break;
        case 'UpdatePublicEndpoint':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'AddAPI':
          action.product.name += ' ' + (Publics.length + 1);
          Publics.push(action.product);
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
      }
    });
  }

  getData() {
    return Publics;
  }

  findEntity(id) {
    return _.find(Publics, {id: id});
  }
}

export default new Public;
