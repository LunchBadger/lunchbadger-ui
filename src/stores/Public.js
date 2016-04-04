import BaseStore from 'stores/BaseStore';
import {register} from '../dispatcher/AppDispatcher';
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
        case 'AddProduct':
          action.product.name += ' ' + (Publics.length + 1);
          Publics.push(action.product);
          this.emitChange();
          break;
        case 'UpdateProduct':
          this.updateEntity(action.id, action.data);
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
