import React from 'react';
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
  updatedEntity = Gateway.create({...entity.toJSON(), ...model, loaded: true, ready: false});
  if (!entity.loaded) {
    updatedEntity.running = null;
  }
  if (isNameChange) {
    updatedEntity.running = false;
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
    userStorage.setObjectKey('gateway', slug(entity.name, {lower: true}), updatedEntity.toJSON());
    dispatch(actions.updateGateway(updatedEntity));
    await dispatch(coreActions.saveToServer());
  } else {
    dispatch(actions.removeGateway(entity));
  }
};

export const saveOrder = orderedIds => (dispatch, getState) => {
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
  const action = {
    serviceEndpoint: endpoint.id,
    changeOrigin: true, // FIXME: fill based on schemas required params
    strategy: 'round-robin',
  };
  if (endpoint.constructor.type === 'Function_') {
    Object.assign(action, {ignorePath: true});
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
