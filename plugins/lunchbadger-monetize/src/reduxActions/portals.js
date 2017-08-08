import {actions} from './actions';
import Portal from '../models/Portal';

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Portal.create({name: 'Portal', itemOrder, loaded: false});
  dispatch(actions.updatePortal(entity));
  return entity;
}

export const update = (entity, model) => (dispatch) => {
  let updatedEntity = Portal.create({...entity.toJSON(), ...model});
  dispatch(actions.updatePortal(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removePortal(entity));
};

export const saveOrder = orderedIds => (dispatch, getState) => {
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
  }
};

export const bundle = (portal, api) => (dispatch) => {
  const updatedPortal = portal.recreate();
  updatedPortal.addAPI(api);
  dispatch(actions.updatePortal(updatedPortal));
  dispatch(actions.removeAPI(api));
};

export const unbundle = (portal, api) => (dispatch) => {
  const updatedPortal = portal.recreate();
  updatedPortal.removeAPI(api);
  dispatch(actions.updatePortal(updatedPortal));
  api.wasBundled = false;
  dispatch(actions.updateAPI(api));
};

export const rebundle = (fromPortal, toPortal, api) => (dispatch) => {
  const updatedFromPortal = fromPortal.recreate();
  updatedFromPortal.removeAPI(api);
  const updatedToPortal = toPortal.recreate();
  updatedToPortal.addAPI(api);
  dispatch(actions.updatePortals([updatedFromPortal, updatedToPortal]));
};
