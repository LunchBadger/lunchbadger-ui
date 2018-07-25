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
    setTimeout(async () => {
      const types = quadrants[3].entities;
      const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
      const entity = ApiEndpoint.create({
        name: endpoint.name + 'ApiEndpoint',
        path: endpoint.contextPath,
        itemOrder,
        loaded: false,
      });
      const toId = entity.id;
      Connections.addConnection(fromId, toId, {source: outPort});
      await dispatch(actions.updateApiEndpoint(entity));
      const {info: {connection}} = Connections.find({fromId, toId});
      connection && connection.addType('wip');
      const value = {
        id: entity.id,
        type: entity.constructor.entities,
      };
      dispatch(actionsCore.setStates([
        {key: 'currentElement', value},
        {key: 'currentEditElement', value: entity},
        {key: 'currentlySelectedParent', value: null},
        {key: 'currentlySelectedSubelements', value: []},
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
  Connections.getConnectionsForTarget(entity.id).map(({info: {connection}}) => connection.removeType('wip'));
  await dispatch(coreActions.saveToServer());
  return updatedEntity;
};

export const remove = entity => async (dispatch) => {
  dispatch(actions.removeApiEndpoint(entity));
  if (entity.loaded) {
    await dispatch(coreActions.saveToServer());
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
