import {actions} from './actions';
import {ModelService} from '../services';
import Function from '../models/Function';
// import ModelProperty from '../models/ModelProperty';
// import ModelRelation from '../models/ModelRelation';
import DataSource from '../models/DataSource';

const {storeUtils, coreActions, actions: actionsCore} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Function.create({name: 'Function', itemOrder, loaded: false});
  dispatch(actions.updateFunction(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Function.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  // let type = 'models';
  // let updateAction = 'updateModel';
  const isDifferent = entity.loaded && model.name !== state.entities.functions[entity.id].name;
  updatedEntity = Function.create({...entity.toJSON(), ...model, ready: false});
  dispatch(actions.updateFunction(updatedEntity));
  try {
    const {body} = await ModelService.upsert(updatedEntity.toJSON());
    if (isDifferent) {
      await ModelService.delete(entity.workspaceId);
      await ModelService.deleteModelConfig(entity.workspaceId);
      // const dataSource = Connections.search({toId: entity.id})
      //   .map(conn => storeUtils.findEntity(state, 0, conn.fromId))
      //   .find(item => item instanceof DataSource);
      await ModelService.upsertModelConfig({
        name: updatedEntity.name,
        id: updatedEntity.workspaceId,
        facetName: 'server',
        // dataSource: dataSource ? dataSource.name : null,
        dataSource: null,
        public: updatedEntity.public,
      });
    }
    updatedEntity = Function.create(body);
    // await ModelService.deleteProperties(updatedEntity.workspaceId);
    // if (model.properties.length > 0) {
    //   const upsertProperties = model.properties.map((item) => {
    //     item.attach(updatedEntity);
    //     return item.toJSON();
    //   });
    //   const {body: properties} = await ModelService.upsertProperties(upsertProperties);
    //   updatedEntity.properties = properties.map((item) => {
    //     const property = ModelProperty.create(item);
    //     property.attach(updatedEntity);
    //     return property;
    //   });
    // }
    // if (model.relations) {
    //   await ModelService.deleteRelations(updatedEntity.workspaceId);
    //   if (model.relations.length > 0) {
    //     const upsertRelations = model.relations.map((item) => {
    //       item.attach(updatedEntity);
    //       return item.toJSON();
    //     });
    //     const {body: relations} = await ModelService.upsertRelations(upsertRelations);
    //     updatedEntity.relations = relations.map((item) => {
    //       const relation = ModelRelation.create(item);
    //       relation.attach(updatedEntity);
    //       return relation;
    //     });
    //   }
    // }
    dispatch(actions.updateFunction(updatedEntity));
    // await dispatch(coreActions.saveToServer());
    return updatedEntity;
  } catch (err) {
    dispatch(actionsCore.addSystemDefcon1(err));
  }
};

// export const addProperty = modelId => (dispatch, getState) => {
//   const props = {...getState().entities.models[modelId]};
//   props.properties = [...props.properties, ModelProperty.create()];
//   const entity = Model.create(props);
//   dispatch(actions.updateModelSuccess({entity}));
// }

export const remove = entity => async (dispatch) => {
  const isAutoSave = entity.loaded;
  try {
    dispatch(actions.removeFunction(entity));
    if (entity.loaded) {
      await ModelService.delete(entity.workspaceId);
      await ModelService.deleteModelConfig(entity.workspaceId);
    }
    if (isAutoSave) {
      // await dispatch(coreActions.saveToServer());
    }
  } catch (err) {
    dispatch(actionsCore.addSystemDefcon1(err));
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
  const entities = getState().entities.functions;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateFunctions(reordered));
    try {
      await ModelService.upsert(reordered);
    } catch (err) {
      dispatch(actionsCore.addSystemDefcon1(err));
    }
  }
};

// export const bundle = (microservice, model) => async (dispatch) => {
//   try {
//     let updatedMicroservice = microservice.recreate();
//     updatedMicroservice.ready = false;
//     dispatch(actions.updateMicroservice(updatedMicroservice));
//     const updatedModel = model.recreate();
//     updatedModel.wasBundled = true;
//     await ModelService.upsert(updatedModel);
//     updatedMicroservice = microservice.recreate();
//     updatedMicroservice.addModel(updatedModel);
//     dispatch(actions.updateMicroservice(updatedMicroservice));
//     dispatch(actions.updateModelBundled(updatedModel));
//     dispatch(actions.removeModel(updatedModel));
//   } catch (err) {
//     dispatch(actionsCore.addSystemDefcon1(err));
//   }
// };
//
// export const unbundle = (microservice, model) => async (dispatch) => {
//   try {
//     let updatedMicroservice = microservice.recreate();
//     updatedMicroservice.ready = false;
//     dispatch(actions.updateMicroservice(updatedMicroservice));
//     const updatedModel = model.recreate();
//     updatedModel.wasBundled = false;
//     await ModelService.upsert(updatedModel);
//     updatedMicroservice = microservice.recreate();
//     updatedMicroservice.removeModel(updatedModel);
//     dispatch(actions.updateMicroservice(updatedMicroservice));
//     dispatch(actions.updateModel(updatedModel));
//     dispatch(actions.removeModelBundled(updatedModel));
//   } catch (err) {
//     dispatch(actionsCore.addSystemDefcon1(err));
//   }
// }
//
// export const rebundle = (fromMicroservice, toMicroservice, model) => async (dispatch) => {
//   const updatedMicroserviceFrom = fromMicroservice.recreate();
//   updatedMicroserviceFrom.removeModel(model);
//   const updatedMicroserviceTo = toMicroservice.recreate();
//   updatedMicroserviceTo.addModel(model);
//   dispatch(actions.updateMicroservices([updatedMicroserviceFrom, updatedMicroserviceTo]));
// }
