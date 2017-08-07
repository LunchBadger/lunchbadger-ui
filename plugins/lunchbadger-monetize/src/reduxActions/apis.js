import {actions} from './actions';
import API from '../models/API';

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = API.create({name: 'API', itemOrder, loaded: false});
  dispatch(actions.updateAPI(entity));
  return entity;
}

export const update = (entity, model) => (dispatch) => {
  let updatedEntity = API.create({...entity.toJSON(), ...model});
  dispatch(actions.updateAPI(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removeAPI(entity));
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
