import {actions} from './actions';
import {DataSourceService, ModelService} from '../services';
import DataSource from '../models/DataSource';
import Model from '../models/Model';

const {storeUtils, actions: coreActions} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = (name, connector) => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[0].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = DataSource.create({name, connector, itemOrder, loaded: false});
  dispatch(actions.updateDataSource(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const isDifferent = entity.loaded && model.name !== state.entities.dataSources[entity.id].name;
  let updatedEntity = DataSource.create({...entity.toJSON(), ...model, ready: false});
  dispatch(actions.updateDataSource(updatedEntity));
  try {
    if (isDifferent) {
      await DataSourceService.delete(entity.workspaceId);
      Connections.search({fromId: entity.id})
        .map(conn => storeUtils.findEntity(state, 1, conn.toId))
        .filter(item => item instanceof Model)
        .forEach(async modelEntity => {
          await ModelService.upsertModelConfig({
            name: modelEntity.name,
            id: modelEntity.workspaceId,
            facetName: 'server',
            dataSource: model.name,
            public: modelEntity.public,
          });
        });
    }
    const {body} = await DataSourceService.upsert(updatedEntity.toJSON());
    updatedEntity = DataSource.create(body);
    dispatch(actions.updateDataSource(updatedEntity));
    return updatedEntity;
  } catch (err) {
    dispatch(coreActions.addSystemDefcon1(err));
  }
};

export const remove = entity => async (dispatch, getState) => {
  const state = getState();
  dispatch(actions.removeDataSource(entity));
  try {
    await DataSourceService.delete(entity.workspaceId);
    Connections.search({fromId: entity.id})
      .map(conn => storeUtils.findEntity(state, 1, conn.toId))
      .filter(item => item instanceof Model)
      .forEach(async model => {
        await ModelService.upsertModelConfig({
          name: model.name,
          id: model.workspaceId,
          facetName: 'server',
          dataSource: null,
          public: model.public,
        });
      });
  } catch (err) {
    dispatch(coreActions.addSystemDefcon1(err));
  }
};

export const saveOrder = orderedIds => async (dispatch, getState) => {
  const entities = getState().entities.dataSources;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateDataSources(reordered));
    try {
      await DataSourceService.upsert(reordered);
    } catch (err) {
      dispatch(coreActions.addSystemDefcon1(err));
    }
  }
};
