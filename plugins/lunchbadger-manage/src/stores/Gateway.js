import Pipeline from '../models/Pipeline';
import _ from 'lodash';

const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Gateways = [];

class Gateway extends BaseStore {
  constructor() {
    super();
    register((action) => {
      this.handleBaseActions('Gateway', ['Gateway'], action);

      switch (action.type) {
        case 'AddPipeline':
          action.gateway.addPipeline(Pipeline.create({name: action.name}));
          this.emitChange();
          break;
        case 'RemovePipeline':
          action.gateway.removePipeline(action.pipeline);
          this.emitChange();
          break;
        case 'DeployGateway':
          Gateways.push(action.gateway);
          action.gateway.itemOrder = Gateways.length - 1;
          this.emitChange();
          break;
        case 'DeployGatewaySuccess':
          const gateway = this.findEntityByGateway(action.gateway);
          if (gateway) {
            gateway.ready = true;
            this.emitChange();
          }
          break;
        case 'ClearData':
          Gateways = [];
          this.emitChange();
          break;
      }
    });
  }

  /**
   * @returns {Gateway[]}
   */
  getData() {
    return Gateways;
  }

  setData(data) {
    Gateways = data;
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

  findEntityByPipelineId(pipelineId) {
    return _.find(Gateways, (gateway) => {
      return !!_.find(gateway.pipelines, {id: pipelineId});
    });
  }
}

export default new Gateway;
