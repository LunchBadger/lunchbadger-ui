import React from 'react';
import {diff} from 'just-diff';
import uuid from 'uuid';
import {actions} from './actions';
import {ModelService} from '../services';
import Model, {processMethods} from '../models/Model';
import ModelProperty from '../models/ModelProperty';
import ModelRelation from '../models/ModelRelation';
import {
  reload as workspaceFilesReload,
  update as workspaceFilesUpdate,
} from './workspaceFiles';
import {reloadApiExplorer} from '../utils';

const {
  utils: {
    storeUtils,
    coreActions,
    actions: actionsCore,
  },
  stores: {
    Connections,
  },
  services: {
    ProjectService,
  },
} = LunchBadgerCore;
const PACKAGE_JSON = 'package.json';

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = storeUtils.getNextItemOrder(types, entities);
  const name = storeUtils.uniqueName('NewModel', {
    ...entities.models,
    ...entities.modelsBundled,
  });
  const entity = Model.create({name, itemOrder, loaded: false});
  entity.tmpId = uuid.v4();
  dispatch(actions.updateModel(entity));
  return entity;
}

export const update = (entity, model, paper) => async (dispatch, getState) => {
  const {tmpId} = entity;
  let oldConns = [];
  const beforeUpdateModel = entity.toJSON({isModelForDiff: true});
  const beforeUpdateProperties = entity.toJSON({isPropertiesForDiff: true});
  const beforeUpdateRelations = entity.toJSON({isRelationsForDiff: true});
  const beforeUpdateMethods = entity.toJSON({isMethodsForDiff: true});
  const state = getState();
  const prevModelJs = (state.entities.workspaceFiles.files.server.models || {})[entity.modelJsName];
  const prevPackageJson = (state.entities.workspaceFiles.files || {})[PACKAGE_JSON];
  let {
    modelJs,
    packageJson,
  } = model;
  delete model.modelJs;
  delete model.packageJson;
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Model.create({...entity.toJSON(), ...model});
    updatedEntity.tmpId = tmpId;
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  let type = 'models';
  let updateAction = 'updateModel';
  let removeAction = 'removeModel';
  const {wasBundled} = entity;
  if (wasBundled) {
    type += 'Bundled';
    updateAction += 'Bundled';
    removeAction += 'Bundled';
  }
  const isDifferent = entity.loaded && model.name !== state.entities[type][entity.id].name;
  if (isDifferent) {
    const conns = Connections.search({'fromId': entity.id});
    oldConns = conns.map(({toId}) => toId);
    conns.forEach(conn => paper.detach(conn.info.connection, {
      fireEvent: false
    }));
  }
  const isPublicDifferent = model.public !== state.entities[type][entity.id].public;
  updatedEntity = Model.create({
    ...entity.toJSON(),
    ...model,
    ready: false,
  });
  updatedEntity.tmpId = tmpId;
  if (!entity.loaded && model.name !== state.entities[type][entity.id].name) {
    dispatch(actions[removeAction](entity));
  }
  const afterUpdateModel = updatedEntity.toJSON({isModelForDiff: true});
  const afterUpdateProperties = updatedEntity.toJSON({isPropertiesForDiff: true});
  const afterUpdateRelations = updatedEntity.toJSON({isRelationsForDiff: true});
  const afterUpdateMethods = updatedEntity.toJSON({isMethodsForDiff: true});
  const deltaModel = diff(beforeUpdateModel, afterUpdateModel);
  const deltaProperties = diff(beforeUpdateProperties, afterUpdateProperties);
  const deltaRelations = diff(beforeUpdateRelations, afterUpdateRelations);
  const deltaMethods = diff(beforeUpdateMethods, afterUpdateMethods);
  dispatch(actions[updateAction](updatedEntity));
  try {
    if (isDifferent) {
      const prevEntity = entity.recreate();
      prevEntity.tmpId = uuid.v4();
      prevEntity.deleting = true;
      dispatch(actions[updateAction](prevEntity));
      await ModelService.deleteModelConfig(entity.workspaceId);
      // await new Promise(res => setTimeout(res, 500));
      await ModelService.delete(entity.workspaceId);
    } else {
      if (model.base === 'Model') {
        const dataSource = Connections.search({toId: updatedEntity.id})
          .map(conn => storeUtils.findEntity(state, 0, conn.fromId))
          .find(item => item.constructor.type === 'DataSource');
        if (dataSource) {
          await ModelService.deleteModelConfig(updatedEntity.workspaceId);
        }
      }
    }
    if (isDifferent || isPublicDifferent) {
      const dataSource = Connections.search({toId: entity.id})
        .map(conn => storeUtils.findEntity(state, 0, conn.fromId))
        .find(item => item.constructor.type === 'DataSource');
      if (model.base === 'PersistedModel') {
        await ModelService.upsertModelConfig({
          name: updatedEntity.name,
          id: updatedEntity.workspaceId,
          facetName: 'server',
          dataSource: dataSource ? dataSource.name : null,
          public: updatedEntity.public,
        });
      }
    }
    if (isDifferent) {
      if (modelJs === undefined) {
        modelJs = state.entities.workspaceFiles.files.server.models[entity.modelJsName];
      }
      if (packageJson === undefined) {
        packageJson = state.entities.workspaceFiles.files[PACKAGE_JSON];
      }
    }
    if (deltaModel.length > 0) {
      await new Promise(res => setTimeout(res, 300));
      await ModelService.upsert(updatedEntity.toJSON());
      const dataSource = Connections.renameByKey('toId', entity.id, updatedEntity.id)
        .map(conn => storeUtils.findEntity(state, 0, conn.fromId))
        .find(item => item.constructor.type === 'DataSource');
      if (isDifferent && dataSource) {
        await ModelService.upsertModelConfig({
          name: updatedEntity.name,
          id: updatedEntity.workspaceId,
          facetName: 'server',
          dataSource: dataSource.name,
          public: updatedEntity.public,
        });
      }
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
    if (model.methods && deltaMethods.length > 0) {
      await ModelService.deleteMethods(updatedEntity.workspaceId);
      if (model.methods.length > 0) {
        const {body: methods} = await ModelService.upsertMethods(model.methods);
        updatedEntity.methods = processMethods(methods);
      }
    }
    updatedEntity.ready = true;
    dispatch(actions[updateAction](updatedEntity));
    if (!wasBundled) {
      await dispatch(coreActions.saveToServer({saveProject: false}));
    }
    if (isDifferent) {
      Connections.renameByKey('fromId', entity.id, updatedEntity.id);
      const {renameServiceEndpointInProxies} = LunchBadgerManage.utils;
      dispatch(renameServiceEndpointInProxies(entity.id, updatedEntity.id));
      oldConns.forEach((toId) => {
        const portOut = document.querySelector(`.port-out.port-Model[id="port_out_${updatedEntity.id}"]`);
        const portIn = document.getElementById(`port_in_${toId}`);
        paper.connect({
          source: portOut.querySelector('.port__anchor'),
          target: portIn.querySelector('.port__anchor'),
          parameters: {
            existing: 1,
          },
        });
      });
      await dispatch(coreActions.saveToServer());
    }
    const isModelJsDiff = modelJs && modelJs !== prevModelJs;
    const isPackageJsonDiff = packageJson && packageJson !== prevPackageJson;
    if (isDifferent || isModelJsDiff || isPackageJsonDiff) {
      await dispatch(workspaceFilesUpdate(packageJson, updatedEntity.modelJsName, modelJs));
      if (isPackageJsonDiff) {
        await ProjectService.reinstallDeps();
      }
    } else if (!entity.loaded) {
      await dispatch(workspaceFilesReload());
    }
    if (deltaModel.length
      || deltaProperties.length
      || deltaRelations.length
      || deltaMethods.length
    ) {
      reloadApiExplorer(dispatch, state);
    }
    return updatedEntity;
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const remove = (entity, cb, action = 'removeModel') => async (dispatch, getState) => {
  const {loaded, wasBundled} = entity;
  let updateAction = 'updateModel';
  if (wasBundled) {
    updateAction += 'Bundled';
  }
  let updatedEntity;
  try {
    if (loaded) {
      updatedEntity = entity.recreate();
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
    reloadApiExplorer(dispatch, getState());
  } catch (error) {
    updatedEntity.ready = true;
    updatedEntity.deleting = false;
    error.friendlyTitle = <div>Deleting model <code>{updatedEntity.name}</code> failed</div>;
    error.friendlyMessage = (
      <div>
        <code>{updatedEntity.name}</code> {'failed to delete.'}
        {' '}
        {'You can find more details below.'}
      </div>
    );
    updatedEntity.error = error;
    dispatch(actions[updateAction](updatedEntity));
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

export const rebundleMultiple = (fromMicroservice, toMicroservice, models) => async (dispatch) => {
  const updatedMicroserviceFrom = fromMicroservice.recreate();
  updatedMicroserviceFrom.removeModels(models);
  const updatedMicroserviceTo = toMicroservice.recreate();
  updatedMicroserviceTo.addModels(models);
  dispatch(actions.updateMicroservices([updatedMicroserviceFrom, updatedMicroserviceTo]));
  await dispatch(coreActions.saveToServer());
}
