import {actions} from './actions';
import Portal from '../models/Portal';

const {Connections} = LunchBadgerCore.stores;
const {storeUtils, coreActions, actions: actionsCore} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const name = storeUtils.uniqueName('Portal', entities.portals);
  const entity = Portal.create({name, itemOrder, loaded: false});
  dispatch(actions.updatePortal(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Portal.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  updatedEntity = Portal.create({...entity.toJSON(), ...model});
  dispatch(actions.updatePortal(updatedEntity));
  dispatch(actionsCore.addSystemInformationMessage({
    type: 'success',
    message: 'Portal successfully deployed',
  }));
  await dispatch(coreActions.saveToServer());
  return updatedEntity;
};

export const remove = entity => async (dispatch) => {
  entity.apis.forEach((api) => {
    api.apiEndpoints.forEach(({id: toId}) => {
      Connections.removeConnection(null, toId);
    });
    if (LunchBadgerOptimize) {
      dispatch(LunchBadgerOptimize.actions.removeAPIForecast(api.id));
    }
  });
  dispatch(actions.removePortal(entity));
  if (entity.loaded) {
    await dispatch(coreActions.saveToServer());
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
  const entities = getState().entities.portals;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updatePortals(reordered));
    await dispatch(coreActions.saveToServer());
  }
};

export const bundle = (portal, api) => async (dispatch) => {
  const updatedPortal = portal.recreate();
  updatedPortal.addAPI(api);
  dispatch(actions.updatePortal(updatedPortal));
  dispatch(actions.removeAPI(api));
  await dispatch(coreActions.saveToServer());
};

export const unbundle = (portal, api) => async (dispatch) => {
  const updatedPortal = portal.recreate();
  updatedPortal.removeAPI(api);
  dispatch(actions.updatePortal(updatedPortal));
  api.wasBundled = false;
  dispatch(actions.updateAPI(api));
  await dispatch(coreActions.saveToServer());
};

export const rebundle = (fromPortal, toPortal, api) => async (dispatch) => {
  const updatedFromPortal = fromPortal.recreate();
  updatedFromPortal.removeAPI(api);
  const updatedToPortal = toPortal.recreate();
  updatedToPortal.addAPI(api);
  dispatch(actions.updatePortals([updatedFromPortal, updatedToPortal]));
  await dispatch(coreActions.saveToServer());
};

export const rebundleMultiple = (fromPortal, toPortal, apis) => async (dispatch) => {
  const updatedFromPortal = fromPortal.recreate();
  updatedFromPortal.removeAPIs(apis);
  const updatedToPortal = toPortal.recreate();
  updatedToPortal.addAPIs(apis);
  dispatch(actions.updatePortals([updatedFromPortal, updatedToPortal]));
  await dispatch(coreActions.saveToServer());
};
