import {actions} from './actions';
import Microservice from '../models/Microservice';
import {update as updateModel, remove as removeModel} from './models';

const {actions: coreActions} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Microservice.create({name: 'Microservice', itemOrder, loaded: false});
  dispatch(actions.updateMicroservice(entity));
  return entity;
};

export const removeNonExistentSubModels = () => (dispatch, getState) => {
  const {microservices, modelsBundled} = getState().entities;
  const updatedMicroservices = [];
  Object.keys(microservices).forEach((id) => {
    const updatedMicroservice = microservices[id].recreate();
    const modelsAmount = updatedMicroservice.models.length;
    updatedMicroservice.models = updatedMicroservice.models.filter(id => !!modelsBundled[id]);
    if (updatedMicroservice.models.length !== modelsAmount) {
      updatedMicroservices.push(updatedMicroservice);
    }
  });
  if (updatedMicroservices.length > 0) {
    dispatch(actions.updateMicroservices(updatedMicroservices));
  }
};

export const update = (entity, model) => async (dispatch, getState) => {
  const {multiEnvironments, entities: {modelsBundled}} = getState();
  const index = multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Microservice.create({...entity.toJSON(), ...model});
    dispatch(coreActions.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const models = model.models.map(({id}) => id);
  updatedEntity = Microservice.create({...entity.toJSON(), ...model, models, ready: false});
  dispatch(actions.updateMicroservice(updatedEntity));
  entity.models.forEach((id) => {
    if (!models.includes(id)) dispatch(coreActions.removeEntity(modelsBundled[id]));
  });
  await Promise.all(entity.models.map((id) =>
    models.includes(id)
    ? dispatch(updateModel(modelsBundled[id], model.models.find((item) => item.id === id).toJSON()))
    : dispatch(removeModel(modelsBundled[id], 'removeModelBundled'))
  ));
  updatedEntity = updatedEntity.recreate();
  updatedEntity.ready = true;
  dispatch(actions.updateMicroservice(updatedEntity));
  return updatedEntity;
};

export const remove = entity => (dispatch, getState) => {
  const modelsBundled = getState().entities.modelsBundled;
  entity.models.forEach(async (id) => {
    Connections.removeConnection(id);
    Connections.removeConnection(null, id);
    await dispatch(removeModel(modelsBundled[id], 'removeModelBundled'));
    dispatch(coreActions.removeEntity(modelsBundled[id]));
  });
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
