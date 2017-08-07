import {actions} from './actions';
import Gateway from '../models/Gateway';
import Pipeline from '../models/Pipeline';
import Policy from '../models/Policy';

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[2].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Gateway.create({name: 'Gateway', itemOrder, loaded: false});
  dispatch(actions.updateGateway(entity));
  return entity;
}

export const update = (entity, model) => (dispatch) => {
  let updatedEntity = Gateway.create({
    ...entity.toJSON(),
    ...model,
    pipelines: model.pipelines.map(pipeline => Pipeline.create({
      ...pipeline,
      policies: pipeline.policies.map(policy => Policy.create(policy)),
    })),
  });
  dispatch(actions.updateGateway(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removeGateway(entity));
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
  const props = {...getState().entities.gateways[gatewayId]};
  props.pipelines = [...props.pipelines, Pipeline.create()];
  const entity = Gateway.create(props);
  dispatch(actions.updateGatewaySuccess({entity}));
}

export const removePipeline = (gatewayId, pipelineId) => (dispatch, getState) => {
  const props = {...getState().entities.gateways[gatewayId]};
  props.pipelines = props.pipelines.filter(p => p.id !== pipelineId);
  const entity = Gateway.create(props);
  dispatch(actions.updateGatewaySuccess({entity}));
}
