import BaseStore from 'stores/BaseStore';
import {register} from '../dispatcher/AppDispatcher';
import Pipeline from '../models/Pipeline';
import _ from 'lodash';

const Gateways = [];

class Gateway extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'AddGateway':
          Gateways.push(action.gateway);
          action.gateway.top = this.getNewElementPosition(Gateways);
          this.emitChange();
          break;
        case 'UpdateGateway':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'AddPipeline':
          action.gateway.addPipeline(Pipeline.create({name: action.name}));
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Gateways;
  }

  findEntity(id) {
    return _.find(Gateways, {id: id});
  }
}

export default new Gateway;
