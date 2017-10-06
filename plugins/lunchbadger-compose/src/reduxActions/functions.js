import {actions} from './actions';
import {FunctionService} from '../services';
import Function from '../models/Function';
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
  // let updateAction = 'updateFunction';
  // if (entity.wasBundled) {
  //   type += 'Bundled';
  //   updateAction += 'Bundled';
  // }
  // const isDifferent = entity.loaded && model.name !== state.entities[type][entity.id].name;
  updatedEntity = Function.create({...entity.toJSON(), ...model});
  dispatch(actions.updateFunction(updatedEntity));
  return updatedEntity;
  // try {
  //   if (isDifferent) {
  //     await FunctionService.delete(entity.workspaceId);
  //     await FunctionService.deleteFunctionConfig(entity.workspaceId);
  //     const dataSource = Connections.search({toId: entity.id})
  //       .map(conn => storeUtils.findEntity(state, 0, conn.fromId))
  //       .find(item => item instanceof DataSource);
  //     await FunctionService.upsertFunctionConfig({
  //       name: updatedEntity.name,
  //       id: updatedEntity.workspaceId,
  //       facetName: 'server',
  //       dataSource: dataSource ? dataSource.name : null,
  //       public: updatedEntity.public,
  //     });
  //   }
  //   const {body} = await FunctionService.upsert(updatedEntity.toJSON());
  //   updatedEntity = Function.create(body);
  //   await FunctionService.deleteProperties(updatedEntity.workspaceId);
  //   if (model.properties.length > 0) {
  //     const upsertProperties = model.properties.map((item) => {
  //       item.attach(updatedEntity);
  //       return item.toJSON();
  //     });
  //     const {body: properties} = await FunctionService.upsertProperties(upsertProperties);
  //     updatedEntity.properties = properties.map((item) => {
  //       const property = FunctionProperty.create(item);
  //       property.attach(updatedEntity);
  //       return property;
  //     });
  //   }
  //   if (model.relations) {
  //     await FunctionService.deleteRelations(updatedEntity.workspaceId);
  //     if (model.relations.length > 0) {
  //       const upsertRelations = model.relations.map((item) => {
  //         item.attach(updatedEntity);
  //         return item.toJSON();
  //       });
  //       const {body: relations} = await FunctionService.upsertRelations(upsertRelations);
  //       updatedEntity.relations = relations.map((item) => {
  //         const relation = FunctionRelation.create(item);
  //         relation.attach(updatedEntity);
  //         return relation;
  //       });
  //     }
  //   }
  //   dispatch(actions[updateAction](updatedEntity));
  //   // await dispatch(coreActions.saveToServer());
  //   return updatedEntity;
  // } catch (err) {
  //   dispatch(actionsCore.addSystemDefcon1(err));
  // }
};

export const remove = entity => async (dispatch) => {
  // const isAutoSave = entity.loaded;
  dispatch(actions.removeFunction(entity));
  // try {
  //   dispatch(actions.removeFunction(entity));
  //   if (entity.loaded) {
  //     await FunctionService.delete(entity.workspaceId);
  //     await FunctionService.deleteFunctionConfig(entity.workspaceId);
  //   }
  //   if (isAutoSave) {
  //     // await dispatch(coreActions.saveToServer());
  //   }
  // } catch (err) {
  //   dispatch(actionsCore.addSystemDefcon1(err));
  // }
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
    // try {
    //   await FunctionService.upsert(reordered);
    // } catch (err) {
    //   dispatch(actionsCore.addSystemDefcon1(err));
    // }
  }
};

// export const bundle = (microservice, model) => async (dispatch) => {
//   try {
//     let updatedMicroservice = microservice.recreate();
//     updatedMicroservice.ready = false;
//     dispatch(actions.updateMicroservice(updatedMicroservice));
//     const updatedFunction = model.recreate();
//     updatedFunction.wasBundled = true;
//     await FunctionService.upsert(updatedFunction);
//     updatedMicroservice = microservice.recreate();
//     updatedMicroservice.addFunction(updatedFunction);
//     dispatch(actions.updateMicroservice(updatedMicroservice));
//     dispatch(actions.updateFunctionBundled(updatedFunction));
//     dispatch(actions.removeFunction(updatedFunction));
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
//     const updatedFunction = model.recreate();
//     updatedFunction.wasBundled = false;
//     await FunctionService.upsert(updatedFunction);
//     updatedMicroservice = microservice.recreate();
//     updatedMicroservice.removeFunction(updatedFunction);
//     dispatch(actions.updateMicroservice(updatedMicroservice));
//     dispatch(actions.updateFunction(updatedFunction));
//     dispatch(actions.removeFunctionBundled(updatedFunction));
//   } catch (err) {
//     dispatch(actionsCore.addSystemDefcon1(err));
//   }
// }
//
// export const rebundle = (fromMicroservice, toMicroservice, model) => async (dispatch) => {
//   const updatedMicroserviceFrom = fromMicroservice.recreate();
//   updatedMicroserviceFrom.removeFunction(model);
//   const updatedMicroserviceTo = toMicroservice.recreate();
//   updatedMicroserviceTo.addFunction(model);
//   dispatch(actions.updateMicroservices([updatedMicroserviceFrom, updatedMicroserviceTo]));
// }
