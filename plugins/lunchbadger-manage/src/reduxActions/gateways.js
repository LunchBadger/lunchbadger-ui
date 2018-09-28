import {actions} from './actions';
import _ from 'lodash';
import slug from 'slug';
import Gateway from '../models/Gateway';
import Pipeline from '../models/Pipeline';
import Policy from '../models/Policy';
import initialPipelinePolicies from '../utils/initialPipelinePolicies';
import ConditionAction from '../models/ConditionAction';

const {Connections} = LunchBadgerCore.stores;
const {coreActions, actions: actionsCore, storeUtils, userStorage} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[2].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const pipelines = {Pipeline: {policies: initialPipelinePolicies}};
  const policies = Object.keys(entities.gatewaySchemas.policy);
  const entity = Gateway.create({
    name: 'Gateway',
    itemOrder,
    loaded: false,
    pipelines,
    policies,
  });
  dispatch(actions.updateGateway(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const isNameChange = entity.loaded && model.name !== entity.name;
  const isAutoSave = !entity.loaded || isNameChange;
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Gateway.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const removedPipelines = _.difference(
    entity.pipelines.map(p => p.id),
    (model.pipelines || []).map(p => p.id),
  );
  removedPipelines.forEach((id) => {
    Connections.removeConnection(id);
    Connections.removeConnection(null, id);
  });
  const entityData = {
    ...entity.toJSON(),
    ...model,
    loaded: true,
    ready: false,
  };
  if (isAutoSave) {
    entityData.pipelinesLunchbadger = true;
  }
  updatedEntity = Gateway.create(entityData);
  if (isAutoSave) {
    updatedEntity.running = null;
  }
  dispatch(actions.updateGateway(updatedEntity));
  if (isAutoSave) {
    await dispatch(coreActions.saveToServer({plain: updatedEntity.id}));
  }
  updatedEntity = updatedEntity.recreate();
  updatedEntity.ready = true;
  updatedEntity.loaded = true;
  dispatch(actions.updateGateway(updatedEntity));
  if (!isAutoSave) {
    await dispatch(coreActions.saveToServer());
  }
  return updatedEntity;
};

export const remove = entity => async (dispatch) => {
  const isAutoSave = entity.loaded;
  if (isAutoSave) {
    const updatedEntity = entity.recreate();
    updatedEntity.deleting = true;
    const slugId = `${entity.id}-${slug(entity.name, {lower: true})}`;
    userStorage.setObjectKey('gateway', slugId, updatedEntity.toJSON());
    dispatch(actions.updateGateway(updatedEntity));
    await dispatch(coreActions.saveToServer());
  } else {
    dispatch(actions.removeGateway(entity));
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
  const entities = getState().entities.gateways;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateGateways(reordered));
    await dispatch(coreActions.saveToServer());
  }
};

export const addPipeline = gatewayId => (dispatch, getState) => {
  const entity = getState().entities.gateways[gatewayId].recreate();
  entity.addPipeline(Pipeline.create({name: 'Pipeline'}));
  dispatch(actions.updateGateway(entity));
};

export const removePipeline = (gatewayId, pipeline) => (dispatch, getState) => {
  const entity = getState().entities.gateways[gatewayId].recreate();
  const {id} = pipeline;
  Connections.removeConnection(id);
  Connections.removeConnection(null, id);
  entity.removePipeline(pipeline);
  dispatch(actions.updateGateway(entity));
};

export const addServiceEndpointIntoProxy = (endpoint, pipelineId) => (dispatch, getState) => {
  const state = getState();
  const gateway = storeUtils.findGatewayByPipelineId(state, pipelineId).recreate();
  const pipeline = gateway.pipelines.find(({id}) => id === pipelineId);
  const {entities: {gatewaySchemas: {policy: {proxy}}}} = state;
  const requiredProxyFields = proxy.required
    .map(field => ({field, value: proxy.properties[field].default}))
    .reduce((map, {field, value}) => ({...map, [field]: value}), {});
  const action = {
    ...requiredProxyFields,
    serviceEndpoint: endpoint.id,
  };
  if (endpoint.constructor.type === 'Function_') {
    Object.assign(action, {ignorePath: true});
  } else if (endpoint.constructor.type === 'Model') {
    Object.assign(action, {stripPath: true});
  }
  if (!pipeline.policies.find(({name}) => name === 'proxy')) {
    pipeline.addPolicy(Policy.create({proxy: []}));
  }
  pipeline.policies
    .filter(({name}) => name === 'proxy')
    .forEach((policy) => {
      if (!policy.hasConditionActionWithServiceEndpoint(endpoint.id)) {
        policy.addConditionAction(ConditionAction.create({action}));
      }
    });
  dispatch(actions.updateGateway(gateway));
};

export const removeServiceEndpointFromProxy = (serviceEndpoint, pipelineId) => (dispatch, getState) => {
  const state = getState();
  let gateway = storeUtils.findGatewayByPipelineId(state, pipelineId);
  if (!gateway) return;
  gateway = gateway.recreate();
  const pipeline = gateway.pipelines.find(({id}) => id === pipelineId);
  pipeline.policies
    .filter(({name}) => name === 'proxy')
    .forEach((policy) => {
      policy.removeConditionActionByServiceEndpoint(serviceEndpoint);
    });
  dispatch(actions.updateGateway(gateway));
};

export const removeServiceEndpointFromProxies = serviceEndpoint => (dispatch, getState) => {
  const state = getState();
  const {entities: {gateways}} = state;
  Object.values(gateways).forEach((entity) => {
    const gateway = entity.recreate();
    gateway.pipelines.forEach((pipeline) => {
      pipeline.policies
        .filter(({name}) => name === 'proxy')
        .forEach(policy => policy.removeConditionActionByServiceEndpoint(serviceEndpoint));
    });
    dispatch(actions.updateGateway(gateway));
  });
};
