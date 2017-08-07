import {actions} from './actions';
import Microservice from '../models/Microservice';

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Microservice.create({name: 'Microservice', itemOrder, loaded: false});
  dispatch(actions.updateMicroservice(entity));
  return entity;
}

export const update = (entity, model) => (dispatch) => {
  let updatedEntity = Microservice.create({...entity.toJSON(), ...model});
  dispatch(actions.updateMicroservice(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch) => {
  dispatch(actions.removeMicroservice(entity));
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  const entities = getState().entities.microservices;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateMicroservices(reordered));
  }
};
