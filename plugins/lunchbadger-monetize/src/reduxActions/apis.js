import {actions} from './actions';
import API from '../models/API';

const {coreActions, actions: actionsCore} = LunchBadgerCore.utils;
const {actions: manageActions} = LunchBadgerManage.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = API.create({name: 'API', itemOrder, loaded: false});
  dispatch(actions.updateAPI(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = API.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  updatedEntity = API.create({...entity.toJSON(), ...model});
  dispatch(actions.updateAPI(updatedEntity));
  await dispatch(coreActions.saveToServer());
  return updatedEntity;
};

export const remove = entity => async (dispatch) => {
  entity.apiEndpoints.forEach(({id}) => {
    Connections.removeConnection(null, id);
  });
  if (LunchBadgerOptimize) {
    dispatch(LunchBadgerOptimize.actions.removeAPIForecast(entity.id));
  }
  dispatch(actions.removeAPI(entity));
  if (entity.loaded) {
    await dispatch(coreActions.saveToServer());
  }
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  const entities = getState().entities.apis;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateAPIs(reordered));
  }
};

export const bundle = (api, endpoint) => (dispatch) => {
  const updatedApi = api.recreate();
  updatedApi.addEndpoint(endpoint);
  dispatch(actions.updateAPI(updatedApi));
  dispatch(manageActions.removeApiEndpoint(endpoint));
};

export const unbundle = (api, endpoint) => (dispatch) => {
  const updatedApi = api.recreate();
  updatedApi.removeEndpoint(endpoint);
  dispatch(actions.updateAPI(updatedApi));
  endpoint.wasBundled = false;
  dispatch(manageActions.updateApiEndpoint(endpoint));
};

export const rebundle = (fromApi, toApi, endpoint) => (dispatch) => {
  const updatedFromApi = fromApi.recreate();
  updatedFromApi.removeEndpoint(endpoint);
  const updatedToApi = toApi.recreate();
  updatedToApi.addEndpoint(endpoint);
  dispatch(actions.updateAPIs([updatedFromApi, updatedToApi]));
};
