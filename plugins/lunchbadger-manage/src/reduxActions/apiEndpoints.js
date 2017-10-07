import {actions} from './actions';
import ApiEndpoint from '../models/ApiEndpoint';

const {actions: coreActions} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = ApiEndpoint.create({name: 'ApiEndpoint', itemOrder, loaded: false});
  dispatch(actions.updateApiEndpoint(entity));
  return entity;
}

export const addAndConnect = (endpoint, fromId, outPort) => (dispatch, getState) => {
  const state = getState();
  const {entities, plugins: {quadrants}} = state;
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = ApiEndpoint.create({
    name: endpoint.name + 'ApiEndpoint',
    path: endpoint.contextPath,
    itemOrder,
    loaded: false,
  });
  Connections.addConnection(fromId, entity.id, {source: outPort});
  dispatch(actions.updateApiEndpoint(entity));
  dispatch(coreActions.setStates([
    {key: 'currentElement', value: entity},
    {key: 'currentEditElement', value: entity},
  ]));
}

export const update = (entity, model) => (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = ApiEndpoint.create({...entity.toJSON(), ...model});
    dispatch(coreActions.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  updatedEntity = ApiEndpoint.create({...entity.toJSON(), ...model});
  dispatch(actions.updateApiEndpoint(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removeApiEndpoint(entity));
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  const entities = getState().entities.apiEndpoints;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateApiEndpoints(reordered));
  }
};
