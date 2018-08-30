import {diff} from 'just-diff';
import {actions} from './actions';
import {ModelService} from '../services';
import Model from '../models/Model';
import ModelProperty from '../models/ModelProperty';
import ModelRelation from '../models/ModelRelation';
import DataSource from '../models/DataSource';
import {
  reload as workspaceFilesReload,
  update as workspaceFilesUpdate,
} from './workspaceFiles';

const {storeUtils, coreActions, actions: actionsCore} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Model.create({name: 'NewModel', itemOrder, loaded: false});
  dispatch(actions.updateModel(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const beforeUpdateModel = entity.toJSON({isModelForDiff: true});
  const beforeUpdateProperties = entity.toJSON({isPropertiesForDiff: true});
  const beforeUpdateRelations = entity.toJSON({isRelationsForDiff: true});
  const state = getState();
  const prevFiles = (state.entities.workspaceFiles.files.server.models || {})[entity.modelJsName];
  let {files} = model;
  delete model.files;
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Model.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  let type = 'models';
  let updateAction = 'updateModel';
  const {wasBundled} = entity;
  if (wasBundled) {
    type += 'Bundled';
    updateAction += 'Bundled';
  }
  const isDifferent = entity.loaded && model.name !== state.entities[type][entity.id].name;
  updatedEntity = Model.create({
    ...entity.toJSON(),
    ...model,
    ready: false,
  });
  const afterUpdateModel = updatedEntity.toJSON({isModelForDiff: true});
  const afterUpdateProperties = updatedEntity.toJSON({isPropertiesForDiff: true});
  const afterUpdateRelations = updatedEntity.toJSON({isRelationsForDiff: true});
  const deltaModel = diff(beforeUpdateModel, afterUpdateModel);
  const deltaProperties = diff(beforeUpdateProperties, afterUpdateProperties);
  const deltaRelations = diff(beforeUpdateRelations, afterUpdateRelations);
  dispatch(actions[updateAction](updatedEntity));
  try {
    if (isDifferent) {
      await ModelService.deleteModelConfig(entity.workspaceId);
      await ModelService.delete(entity.workspaceId);
      const dataSource = Connections.search({toId: entity.id})
        .map(conn => storeUtils.findEntity(state, 0, conn.fromId))
        .find(item => item instanceof DataSource);
      await ModelService.upsertModelConfig({
        name: updatedEntity.name,
        id: updatedEntity.workspaceId,
        facetName: 'server',
        dataSource: dataSource ? dataSource.name : null,
        public: updatedEntity.public,
      });
      if (files === undefined) {
        files = state.entities.workspaceFiles.files.server.models[entity.modelJsName];
      }
    }
    if (deltaModel.length > 0) {
      await new Promise(res => setTimeout(res, 300));
      await ModelService.upsert(updatedEntity.toJSON());
    }
    if (deltaProperties.length > 0) {
      await ModelService.deleteProperties(updatedEntity.workspaceId);
      if (model.properties.length > 0) {
        const upsertProperties = model.properties.map((item) => {
          item.attach(updatedEntity);
          return item.toJSON();
        });
        const {body: properties} = await ModelService.upsertProperties(upsertProperties);
        updatedEntity.properties = properties.map((item) => {
          const property = ModelProperty.create(item);
          property.attach(updatedEntity);
          return property;
        });
      }
    }
    if (model.relations && deltaRelations.length > 0) {
      await ModelService.deleteRelations(updatedEntity.workspaceId);
      if (model.relations.length > 0) {
        const upsertRelations = model.relations.map((item) => {
          item.attach(updatedEntity);
          return item.toJSON();
        });
        const {body: relations} = await ModelService.upsertRelations(upsertRelations);
        updatedEntity.relations = relations.map((item) => {
          const relation = ModelRelation.create(item);
          relation.attach(updatedEntity);
          return relation;
        });
      }
    }
    if (isDifferent || (files && files !== prevFiles)) {
      await dispatch(workspaceFilesUpdate(updatedEntity.modelJsName, files));
    } else if (!entity.loaded) {
      await dispatch(workspaceFilesReload());
    }
    updatedEntity.ready = true;
    dispatch(actions[updateAction](updatedEntity));
    if (!wasBundled) {
      await dispatch(coreActions.saveToServer({saveProject: false}));
    }
    return updatedEntity;
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const remove = (entity, cb, action = 'removeModel') => async (dispatch) => {
  try {
    const {loaded, wasBundled} = entity;
    if (loaded) {
      let updateAction = 'updateModel';
      if (wasBundled) {
        updateAction += 'Bundled';
      }
      const updatedEntity = entity.recreate();
      updatedEntity.ready = false;
      updatedEntity.deleting = true;
      dispatch(actions[updateAction](updatedEntity));
      await ModelService.delete(entity.workspaceId);
      await ModelService.deleteModelConfig(entity.workspaceId);
    }
    dispatch(actions[action](entity));
    if (cb) {
      await dispatch(cb());
    }
    if (!wasBundled) {
      await dispatch(coreActions.saveToServer({saveProject: false}));
    }
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
  const entities = getState().entities.models;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateModels(reordered));
    try {
      await ModelService.upsert(reordered);
    } catch (error) {
      dispatch(coreActions.addSystemDefcon1({error}));
    }
  }
};

export const bundle = (microservice, model) => async (dispatch) => {
  try {
    let updatedMicroservice = microservice.recreate();
    updatedMicroservice.ready = false;
    dispatch(actions.updateMicroservice(updatedMicroservice));
    const updatedModel = model.recreate();
    updatedModel.wasBundled = true;
    await ModelService.upsert(updatedModel);
    updatedMicroservice = microservice.recreate();
    updatedMicroservice.addModel(updatedModel);
    dispatch(actions.updateMicroservice(updatedMicroservice));
    dispatch(actions.updateModelBundled(updatedModel));
    dispatch(actions.removeModel(updatedModel));
    await dispatch(coreActions.saveToServer());
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const unbundle = (microservice, model) => async (dispatch) => {
  try {
    let updatedMicroservice = microservice.recreate();
    updatedMicroservice.ready = false;
    dispatch(actions.updateMicroservice(updatedMicroservice));
    const updatedModel = model.recreate();
    updatedModel.wasBundled = false;
    await ModelService.upsert(updatedModel);
    updatedMicroservice = microservice.recreate();
    updatedMicroservice.removeModel(updatedModel);
    dispatch(actions.updateMicroservice(updatedMicroservice));
    dispatch(actions.updateModel(updatedModel));
    dispatch(actions.removeModelBundled(updatedModel));
    await dispatch(coreActions.saveToServer());
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
}

export const rebundle = (fromMicroservice, toMicroservice, model) => async (dispatch) => {
  const updatedMicroserviceFrom = fromMicroservice.recreate();
  updatedMicroserviceFrom.removeModel(model);
  const updatedMicroserviceTo = toMicroservice.recreate();
  updatedMicroserviceTo.addModel(model);
  dispatch(actions.updateMicroservices([updatedMicroserviceFrom, updatedMicroserviceTo]));
  await dispatch(coreActions.saveToServer());
}
