import {actions} from './actions';
import {ModelService} from '../services';
import Model from '../models/_model';
import ModelProperty from '../models/_modelProperty';

export const addModel = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Model.create({itemOrder}, {loaded: false});
  dispatch(actions.addModel({entity}));
  return entity;
}

export const updateModel = props => async (dispatch, getState) => {
  const isDifferent = props.metadata.loaded && props.name !== getState().entities.models[props.metadata.id].name;
  let entity = Model.create(props, {...props.metadata, processing: true});
  dispatch(actions.updateModelRequest({entity}));
  try {
    if (isDifferent) {
      await ModelService.delete(props.id);
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
    const {body} = await ModelService.upsert(Model.toJSON(entity));
    entity = Model.create(body);
    await ModelService.deleteProperties(entity.id);
    if (props.properties.length > 0) {
      const upsertProperties = props.properties.map(item => ModelProperty.toJSON(entity.id, item));
      const {body: properties} = await ModelService.upsertProperties(upsertProperties);
      entity.properties = properties.map(item => ModelProperty.create(item));
    }
    dispatch(actions.updateModelSuccess({entity}));
    return entity;
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

export const deleteModel = props => async (dispatch) => {
  const entity = Model.create(props, {...props.metadata, processing: true});
  dispatch(actions.deleteModelRequest({entity}));
  try {
    await ModelService.delete(props.id);
    dispatch(actions.deleteModelSuccess({id: entity.metadata.id}));
  } catch (err) {
    console.log('ERROR deleteModelFailure', err);
    dispatch(actions.deleteModelFailure(err));
  }
};

export const discardModelChanges = ({metadata: {loaded, id}}) => (dispatch, getState) => {
  if (!loaded) {
    dispatch(actions.deleteModelSuccess({id}));
    return {};
  } else {
    const props = getState().states.currentEditElement;
    const entity = Model.create(props);
    dispatch(actions.updateModelSuccess({entity}));
    return Model.toJSON(entity);
  }
}
