import {actions} from './actions';
import PrivateEndpoint from '../models/PrivateEndpoint';

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = PrivateEndpoint.create({name: 'PrivateEndpoint', itemOrder, loaded: false});
  dispatch(actions.updatePrivateEndpoint(entity));
  return entity;
}

export const update = (entity, model) => (dispatch) => {
  let updatedEntity = PrivateEndpoint.create({...entity.toJSON(), ...model});
  dispatch(actions.updatePrivateEndpoint(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removePrivateEndpoint(entity));
};
