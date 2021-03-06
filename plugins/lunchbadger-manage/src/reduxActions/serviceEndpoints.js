import {actions} from './actions';
import ServiceEndpoint from '../models/ServiceEndpoint';
import initialServiceEndpointUrls from '../utils/initialServiceEndpointUrls';

const {storeUtils, coreActions, actions: actionsCore} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = storeUtils.getNextItemOrder(types, entities);
  const name = storeUtils.uniqueName('ServiceEndpoint', entities.serviceEndpoints);
  const entity = ServiceEndpoint.create({name, itemOrder, loaded: false, urls: initialServiceEndpointUrls});
  dispatch(actions.updateServiceEndpoint(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = ServiceEndpoint.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  updatedEntity = ServiceEndpoint.create({...entity.toJSON(), ...model});
  dispatch(actions.updateServiceEndpoint(updatedEntity));
  await dispatch(coreActions.saveToServer());
  return updatedEntity;
};

export const remove = entity => async (dispatch) => {
  const isAutoSave = entity.loaded;
  dispatch(actions.removeServiceEndpoint(entity));
  if (isAutoSave) {
    await dispatch(coreActions.saveToServer());
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
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
    await dispatch(coreActions.saveToServer());
  }
};
