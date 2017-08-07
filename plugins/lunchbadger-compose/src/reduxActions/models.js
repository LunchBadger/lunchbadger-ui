import {actions} from './actions';
import {ModelService} from '../services';
import Model from '../models/Model';
import ModelProperty from '../models/ModelProperty';

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Model.create({name: 'NewModel', itemOrder, loaded: false});
  dispatch(actions.updateModel(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const isDifferent = entity.loaded && model.name !== getState().entities.models[entity.id].name;
  let updatedEntity = Model.create({...entity.toJSON(), ...model, ready: false});
  dispatch(actions.updateModel(updatedEntity));
  try {
    if (isDifferent) {
      await ModelService.delete(entity.workspaceId);
      // ConnectionStore
      //   .getConnectionsForSource(oldId)
      //   .map(conn => PrivateStore.findEntity(conn.toId))
      //   .filter(item => item instanceof Model)
      //   .forEach(model => {
      //     promise = promise.then(() => ProjectService.upsertModelConfig({
      //       name: model.name,
      //       id: model.workspaceId,
      //       facetName: 'server',
      //       dataSource: props.name
      //     }));
      //   });
    }
    const {body} = await ModelService.upsert(updatedEntity.toJSON());
    updatedEntity = Model.create(body);
    await ModelService.deleteProperties(updatedEntity.workspaceId);
    if (model.properties.length > 0) {
      const upsertProperties = model.properties.map(item => item.toJSON());
      const {body: properties} = await ModelService.upsertProperties(upsertProperties);
      updatedEntity.properties = properties.map(item => ModelProperty.create(item));
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
