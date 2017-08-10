import {actions} from './actions';
import {ModelService} from '../services';
import Model from '../models/Model';
import ModelProperty from '../models/ModelProperty';
import ModelRelation from '../models/ModelRelation';
import DataSource from '../models/DataSource';

const {storeUtils} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Model.create({name: 'NewModel', itemOrder, loaded: false});
  dispatch(actions.updateModel(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const isDifferent = entity.loaded && model.name !== state.entities.models[entity.id].name;
  let updatedEntity = Model.create({...entity.toJSON(), ...model, ready: false});
  dispatch(actions.updateModel(updatedEntity));
  try {
    if (isDifferent) {
      await ModelService.delete(entity.workspaceId);
      await ModelService.deleteModelConfig(entity.workspaceId);
      const dataSource = storeUtils.filterConnections(state, {toId: entity.id})
        .map(conn => storeUtils.findEntity(state, 0, conn.fromId))
        .find(item => item instanceof DataSource);
      await ModelService.upsertModelConfig({
        name: updatedEntity.name,
        id: updatedEntity.workspaceId,
        facetName: 'server',
        dataSource: dataSource ? dataSource.name : null,
        public: updatedEntity.public,
      });
    }
    const {body} = await ModelService.upsert(updatedEntity.toJSON());
    updatedEntity = Model.create(body);
    await ModelService.deleteProperties(updatedEntity.workspaceId);
    if (model.properties.length > 0) {
      const upsertProperties = model.properties.map(item => item.toJSON());
      const {body: properties} = await ModelService.upsertProperties(upsertProperties);
      updatedEntity.properties = properties.map((item) => {
        const property = ModelProperty.create(item);
        property.attach(updatedEntity);
        return property;
      });
    }
    if (model.relations) {
      await ModelService.deleteRelations(updatedEntity.workspaceId);
      if (model.relations.length > 0) {
        const upsertRelations = model.relations.map(item => item.toJSON());
        const {body: relations} = await ModelService.upsertRelations(upsertRelations);
        updatedEntity.relations = relations.map((item) => {
          const relation = ModelRelation.create(item);
          relation.attach(updatedEntity);
          return relation;
        });
      }
    }
    dispatch(actions.updateModel(updatedEntity));
    return updatedEntity;
  } catch (err) {
    console.log('ERROR updateModelFailure', err);
    dispatch(actions.updateModelFailure(err));
  }
};

// export const addProperty = modelId => (dispatch, getState) => {
//   const props = {...getState().entities.models[modelId]};
//   props.properties = [...props.properties, ModelProperty.create()];
//   const entity = Model.create(props);
//   dispatch(actions.updateModelSuccess({entity}));
// }

export const remove = entity => async (dispatch) => {
  dispatch(actions.removeModel(entity));
  try {
    await ModelService.delete(entity.workspaceId);
  } catch (err) {
    console.log('ERROR deleteModelFailure', err);
    dispatch(actions.deleteModelFailure(err));
  }
};

export const saveOrder = orderedIds => (dispatch, getState) => {
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
    ModelService.upsert(reordered);
  }
};

export const bundle = (microservice, model) => async (dispatch) => {
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
};

export const unbundle = (microservice, model) => async (dispatch) => {
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
}

export const rebundle = (fromMicroservice, toMicroservice, model) => async (dispatch) => {
  const updatedMicroserviceFrom = fromMicroservice.recreate();
  updatedMicroserviceFrom.removeModel(model);
  const updatedMicroserviceTo = toMicroservice.recreate();
  updatedMicroserviceTo.addModel(model);
  dispatch(actions.updateMicroservices([updatedMicroserviceFrom, updatedMicroserviceTo]));
}
