import {actions} from './actions';
import {DataSourceService} from '../services';
import DataSource from '../models/DataSource';

export const add = (name, connector) => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[0].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = DataSource.create({name, connector, itemOrder, loaded: false});
  dispatch(actions.updateDataSource(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const isDifferent = entity.loaded && model.name !== getState().entities.dataSources[entity.id].name;
  let updatedEntity = DataSource.create({...entity.toJSON(), ...model, ready: false});
  dispatch(actions.updateDataSource(updatedEntity));
  try {
    if (isDifferent) {
      await DataSourceService.delete(entity.workspaceId);
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
    const {body} = await DataSourceService.upsert(updatedEntity.toJSON());
    updatedEntity = DataSource.create(body);
    dispatch(actions.updateDataSource(updatedEntity));
    return updatedEntity;
  } catch (err) {
    console.log('ERROR updateDataSourceFailure', err);
    dispatch(actions.updateDataSourceFailure(err));
  }
};

export const remove = entity => async (dispatch) => {
  dispatch(actions.removeDataSource(entity));
  try {
    await DataSourceService.delete(entity.workspaceId);
  } catch (err) {
    console.log('ERROR deleteDataSourceFailure', err);
    dispatch(actions.deleteDataSourceFailure(err));
  }
};
