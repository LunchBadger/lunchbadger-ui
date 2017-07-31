import {actions} from './actions';
import {DataSourceService} from '../services';
import DataSource from '../models/_dataSource';

export const addDataSource = (name, connector) => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[0].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = DataSource.create({name, connector, itemOrder}, {loaded: false});
  dispatch(actions.addDataSource({entity}));
  return entity;
}

export const updateDataSource = ({data, metadata}) => async (dispatch, getState) => {
  const isDifferent = metadata.loaded && data.name !== getState().entities.dataSources[metadata.id].data.name;
  let entity = DataSource.create(data, {...metadata, processing: true});
  dispatch(actions.updateDataSourceRequest({entity}));
  try {
    if (isDifferent) {
      await DataSourceService.delete(data.id);
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
    const {body} = await DataSourceService.upsert(entity.data);
    entity = DataSource.create(body);
    dispatch(actions.updateDataSourceSuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updateDataSourceFailure', err);
    dispatch(actions.updateDataSourceFailure(err));
  }
};

export const deleteDataSource = ({data, metadata}) => async (dispatch) => {
  const entity = DataSource.create(data, {...metadata, processing: true});
  dispatch(actions.deleteDataSourceRequest({entity}));
  try {
    await DataSourceService.delete(entity.data.id);
    dispatch(actions.deleteDataSourceSuccess({id: entity.metadata.id}));
  } catch (err) {
    console.log('ERROR deleteDataSourceFailure', err);
    dispatch(actions.deleteDataSourceFailure(err));
  }
};

export const discardDataSourceChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deleteDataSourceSuccess({id}));
  }
}
