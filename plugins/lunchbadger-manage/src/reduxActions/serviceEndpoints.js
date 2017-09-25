import {actions} from './actions';
import ServiceEndpoint from '../models/ServiceEndpoint';
import initialServiceEndpointUrls from '../utils/initialServiceEndpointUrls';
const {actions: coreActions} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = ServiceEndpoint.create({name: 'ServiceEndpoint', itemOrder, loaded: false, urls: initialServiceEndpointUrls});
  dispatch(actions.updateServiceEndpoint(entity));
  return entity;
}

export const update = (entity, model) => (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = ServiceEndpoint.create({...entity.toJSON(), ...model});
    dispatch(coreActions.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  updatedEntity = ServiceEndpoint.create({...entity.toJSON(), ...model});
  dispatch(actions.updateServiceEndpoint(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removeServiceEndpoint(entity));
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  const entities = getState().entities.serviceEndpoints;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateServiceEndpoints(reordered));
  }
};
