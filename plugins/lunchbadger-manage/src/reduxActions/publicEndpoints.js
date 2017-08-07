import {actions} from './actions';
import PublicEndpoint from '../models/PublicEndpoint';

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = PublicEndpoint.create({name: 'PublicEndpoint', itemOrder, loaded: false});
  dispatch(actions.updatePublicEndpoint(entity));
  return entity;
}

export const update = (entity, model) => (dispatch) => {
  let updatedEntity = PublicEndpoint.create({...entity.toJSON(), ...model});
  dispatch(actions.updatePublicEndpoint(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removePublicEndpoint(entity));
};
