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
          this.addGateway(action.gateway);
          break;
        case 'UpdateGateway':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'AddPipeline':
          action.gateway.addPipeline(Pipeline.create({name: action.name}));
          this.emitChange();
          break;
        case 'DeployGateway':
          this.addGateway(action.gateway);
          break;
        case 'DeployGatewaySuccess':
          const gateway = this.findEntityByGateway(action.gateway);

          if (gateway) {
            gateway.ready = true;
            this.emitChange();
          }
          break;
      }
    });
  }

  /**
   * @param gateway {Gateway}
   */
  addGateway(gateway) {
    Gateways.push(gateway);
    gateway.top = this.getNewElementPosition(Gateways);
    this.emitChange();
  }

  /**
   * @returns {Gateway[]}
   */
  getData() {
    return Gateways;
  }

  findEntity(id) {
    return _.find(Gateways, {id: id});
  }

  /**
   * @param gateway {Gateway}
   * @returns {Gateway|undefined}
   */
  findEntityByGateway(gateway) {
    const id = gateway.id;

    return this.findEntity(id);
  }
}

export default new Gateway;
