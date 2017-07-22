import {actions} from './actions';
import {DataSourceService} from '../services';
import DataSource from '../models/_dataSource';

export const loadDataSources = () => async (dispatch, getState) => {
  dispatch(actions.loadDataSourcesRequest());
  try {
    const data = await DataSourceService.load();
    dispatch(actions.loadDataSourcesSuccess(data));
  } catch (err) {
    console.log('ERROR loadDataSourcesFailure', err);
    dispatch(actions.loadDataSourcesFailure(err));
  }
};

export const addDataSource = (name, connector) => (dispatch) => {
  dispatch(actions.addDataSource({name, connector}));
}

export const updateDataSource = (entity, model) => async (dispatch) => {
  const {data, metadata} = entity;
  const {id, lunchbadgerId, name} = data;
  const {loaded} = metadata;
  const newEntity = DataSource.create({...data, ...model}).data;
  dispatch(actions.updateDataSourceRequest({lunchbadgerId, entity: newEntity}));
  try {
    if (loaded && name !== model.name) {
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
    // entity.update({...model, loaded: true});
    // const toSave = entity.toJSON();
    // delete toSave.lunchbadgerId;
    // console.log(123, data, model, );
    // console.log({toSave});
    const {body} = await DataSourceService.upsert(newEntity);
    dispatch(actions.updateDataSourceSuccess({lunchbadgerId, entity: body}));
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
