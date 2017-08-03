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

export const updateDataSource = props => async (dispatch, getState) => {
  const isDifferent = props.metadata.loaded && props.name !== getState().entities.dataSources[props.metadata.id].name;
  let entity = DataSource.create(props, {...props.metadata, processing: true});
  dispatch(actions.updateDataSourceRequest({entity}));
  try {
    if (isDifferent) {
      await DataSourceService.delete(props.id);
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
    const {body} = await DataSourceService.upsert(DataSource.toJSON(entity));
    entity = DataSource.create(body);
    dispatch(actions.updateDataSourceSuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updateDataSourceFailure', err);
    dispatch(actions.updateDataSourceFailure(err));
  }
};

export const deleteDataSource = props => async (dispatch) => {
  const entity = DataSource.create(props, {...props.metadata, processing: true});
  dispatch(actions.deleteDataSourceRequest({entity}));
  try {
    await DataSourceService.delete(props.id);
    dispatch(actions.deleteDataSourceSuccess({id: entity.metadata.id}));
  } catch (err) {
    console.log('ERROR deleteDataSourceFailure', err);
    dispatch(actions.deleteDataSourceFailure(err));
  }
};

export const discardDataSourceChanges = ({metadata: {loaded, id}}) => (dispatch, getState) => {
  if (!loaded) {
    dispatch(actions.deleteDataSourceSuccess({id}));
    return {};
  } else {
    const props = getState().states.currentEditElement;
    const entity = DataSource.create(props);
    dispatch(actions.updateDataSourceSuccess({entity}));
    return DataSource.toJSON(entity);
  }
}
