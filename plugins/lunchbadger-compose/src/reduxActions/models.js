import {actions} from './actions';
import {ModelService} from '../services';
import Model from '../models/_model';

export const loadModels = () => async (dispatch) => {
  dispatch(actions.loadModelsRequest());
  try {
    const data = await ModelService.load();
    const entities = data.body.reduce((map, item) => {
      map[item.lunchbadgerId] = Model.create(item);
      return map;
    }, {});
    dispatch(actions.loadModelsSuccess({entities}));
  } catch (err) {
    console.log('ERROR loadModelsFailure', err);
    dispatch(actions.loadModelsFailure(err));
  }
};

export const addModel = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Model.create({itemOrder}, {loaded: false});
  dispatch(actions.addModel({entity}));
  return entity;
}

export const updateModel = ({data, metadata}) => async (dispatch, getState) => {
  const isDifferent = metadata.loaded && data.name !== getState().entities.models[metadata.id].data.name;
  let entity = Model.create(data, {...metadata, processing: true});
  dispatch(actions.updateModelRequest({entity}));
  try {
    if (isDifferent) {
      await ModelService.delete(data.id);
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
    const {body} = await ModelService.upsert(entity.data);
    entity = Model.create(body);
    dispatch(actions.updateModelSuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updateModelFailure', err);
    dispatch(actions.updateModelFailure(err));
  }
};

export const deleteModel = ({data, metadata}) => async (dispatch) => {
  const entity = Model.create(data, {...metadata, processing: true});
  dispatch(actions.deleteModelRequest({entity}));
  try {
    await ModelService.delete(entity.data.id);
    dispatch(actions.deleteModelSuccess({id: entity.metadata.id}));
  } catch (err) {
    console.log('ERROR deleteModelFailure', err);
    dispatch(actions.deleteModelFailure(err));
  }
};

export const discardModelChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deleteModelSuccess({id}));
  }
}
