import {actions} from './actions';
import ApiEndpoint from '../models/ApiEndpoint';

const {coreActions, actions: actionsCore} = LunchBadgerCore.utils;
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
  const {entities, plugins: {quadrants}, states} = state;
  const isPanelClosed = !states.currentlyOpenedPanel;
  if (isPanelClosed) {
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
    setTimeout(() => {
      dispatch(actionsCore.setStates([
        {key: 'currentElement', value: entity},
        {key: 'currentEditElement', value: entity},
      ]));
    });
  }
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = ApiEndpoint.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  updatedEntity = ApiEndpoint.create({...entity.toJSON(), ...model});
  dispatch(actions.updateApiEndpoint(updatedEntity));
  // await dispatch(coreActions.saveToServer());
  return updatedEntity;
};

export const remove = entity => async (dispatch) => {
  const isAutoSave = entity.loaded;
  dispatch(actions.removeApiEndpoint(entity));
  if (isAutoSave) {
    // await dispatch(coreActions.saveToServer());
  }
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
