import {actions} from './actions';
import ApiEndpoint from '../models/ApiEndpoint';

const {storeUtils, coreActions, actions: actionsCore} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const uniqueApiEndpointName = (str, entities) => storeUtils.uniqueName(str, {
  ...entities.apiEndpoints,
  ...Object.values({...entities.apis, ...entities.portals})
    .reduce((map, {apiEndpointsNames}) => [...map, ...apiEndpointsNames], [])
    .reduce((map, {id, name}) => ({...map, [id]: {name}}), {}),
})

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const name = uniqueApiEndpointName('ApiEndpoint', entities);
  const entity = ApiEndpoint.create({name, itemOrder, loaded: false});
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
      const name = uniqueApiEndpointName(endpoint.name + 'ApiEndpoint', entities);
      const entity = ApiEndpoint.create({
        name,
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

export const saveOrder = orderedIds => async (dispatch, getState) => {
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
    await dispatch(coreActions.saveToServer());
  }
};
