import {actions} from './actions';
import PublicEndpoint from '../models/PublicEndpoint';

const {actions: coreActions} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = PublicEndpoint.create({name: 'PublicEndpoint', itemOrder, loaded: false});
  dispatch(actions.updatePublicEndpoint(entity));
  return entity;
}

export const addAndConnect = (endpoint, fromId, outPort) => (dispatch, getState) => {
  const state = getState();
  const {entities, plugins: {quadrants}} = state;
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = PublicEndpoint.create({
    name: endpoint.name + 'PublicEndpoint',
    path: endpoint.contextPath,
    itemOrder,
    loaded: false,
  });
  Connections.addConnection(fromId, entity.id, {source: outPort});
  dispatch(actions.updatePublicEndpoint(entity));
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
    updatedEntity = PublicEndpoint.create({...entity.toJSON(), ...model});
    dispatch(coreActions.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  updatedEntity = PublicEndpoint.create({...entity.toJSON(), ...model});
  dispatch(actions.updatePublicEndpoint(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removePublicEndpoint(entity));
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  const entities = getState().entities.publicEndpoints;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updatePublicEndpoints(reordered));
  }
};
