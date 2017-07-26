import {actions} from './actions';
import {DataSourceService} from '../services';
import DataSource from '../models/_dataSource';

const coreActions = LunchBadgerCore.utils.actions;

export const loadDataSources = () => async (dispatch, getState) => {
  dispatch(actions.loadDataSourcesRequest());
  try {
    const data = await DataSourceService.load();
    const entities = data.body.reduce((map, item) => {
      map[item.lunchbadgerId] = DataSource.create(item);
      return map;
    }, {});
    dispatch(actions.loadDataSourcesSuccess({entities}));
  } catch (err) {
    console.log('ERROR loadDataSourcesFailure', err);
    dispatch(actions.loadDataSourcesFailure(err));
  }
};

export const addDataSource = (name, connector) => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[0].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  dispatch(actions.addDataSource({name, connector, itemOrder}));
}

export const updateDataSource = ({data, metadata}) => async (dispatch, getState) => {
  const {id, lunchbadgerId, name} = data;
  const {loaded} = metadata;
  const entity = DataSource.create(data, {ready: false});
  dispatch(actions.updateDataSourceRequest({entity}));
  try {
    if (loaded && name !== getState().entities.dataSources[lunchbadgerId].data.name) {
      console.log('DELETE!')
      await DataSourceService.delete(id);
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
    dispatch(actions.updateDataSourceSuccess({entity: DataSource.create(body)}));
  } catch (err) {
    console.log('ERROR updateDataSourceFailure', err);
    dispatch(actions.updateDataSourceFailure(err));
  }
};

export const deleteDataSource = entity => async (dispatch) => {
  const {lunchbadgerId, id} = entity.data;
  dispatch(actions.deleteDataSourceRequest({lunchbadgerId}));
  try {
    await DataSourceService.delete(id);
    dispatch(actions.deleteDataSourceSuccess({lunchbadgerId}));
  } catch (err) {
    console.log(111, {err});
    dispatch(actions.deleteDataSourceFailure(err));
  }
};

export const discardDataSourceChanges = entity => (dispatch) => {
  console.log('discardDataSourceChanges', entity);
  const {lunchbadgerId, id} = entity.data;
  dispatch(coreActions.removeEntity({id}));
  if (entity.metadata.loaded) {

  } else {
    dispatch(actions.deleteDataSourceSuccess({lunchbadgerId}));
  }
}
