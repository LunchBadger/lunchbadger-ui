import _ from 'lodash';
import {actions} from './actions';
import Microservice from '../models/Microservice';
import {update as updateModel, remove as removeModel} from './models';

const {storeUtils, coreActions, actions: actionsCore} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = storeUtils.getNextItemOrder(types,  entities);
  const name = storeUtils.uniqueName('Microservice', entities.microservices);
  const entity = Microservice.create({name, itemOrder, loaded: false});
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
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const removedModels = _.difference(
    entity.models,
    (model.models || []).map(p => p.lunchbadgerId),
  );
  removedModels.forEach((id) => {
    Connections.removeConnection(id);
    if (LunchBadgerManage) {
      const {removeServiceEndpointFromProxies} = LunchBadgerManage.utils;
      dispatch(removeServiceEndpointFromProxies(id));
    }
  });
  const models = model.models.map(({lunchbadgerId}) => lunchbadgerId);
  updatedEntity = Microservice.create({...entity.toJSON(), ...model, models, ready: false});
  dispatch(actions.updateMicroservice(updatedEntity));
  entity.models.forEach((id) => {
    if (!models.includes(id)) dispatch(actionsCore.removeEntity(modelsBundled[id]));
  });
  await Promise.all(entity.models.map((id) =>
    models.includes(id)
    ? dispatch(updateModel(modelsBundled[id], model.models.find((item) => item.lunchbadgerId === id)))
    : dispatch(removeModel(modelsBundled[id], null, 'removeModelBundled'))
  ));
  updatedEntity = updatedEntity.recreate();
  updatedEntity.ready = true;
  dispatch(actions.updateMicroservice(updatedEntity));
  await dispatch(coreActions.saveToServer());
  return updatedEntity;
};

export const remove = entity => async (dispatch, getState) => {
  const modelsBundled = getState().entities.modelsBundled;
  for (let i = 0; i < entity.models.length; i += 1) {
    const id = entity.models[i];
    Connections.removeConnection(id);
    Connections.removeConnection(null, id);
    await dispatch(removeModel(modelsBundled[id], null, 'removeModelBundled'));
    dispatch(actionsCore.removeEntity(modelsBundled[id]));
  }
  dispatch(actions.removeMicroservice(entity));
  if (entity.loaded) {
    await dispatch(coreActions.saveToServer());
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
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
    await dispatch(coreActions.saveToServer());
  }
};
