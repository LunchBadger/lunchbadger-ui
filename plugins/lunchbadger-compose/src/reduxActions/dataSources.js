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
  const json = {name, connector, itemOrder, loaded: false};
  const entity = DataSource.create(json);
  dispatch(actions.updateDataSource(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = DataSource.create({...entity.toJSON(), ...model});
    dispatch(coreActions.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const isDifferent = entity.loaded && model.name !== state.entities.dataSources[entity.id].name;
  updatedEntity = DataSource.create({...entity.toJSON(), ...model, ready: false});
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
    if (body.hasOwnProperty('wsdl')) {
      body.soapOperations = body.operations || {};
      delete body.operations;
    }
    updatedEntity = DataSource.create(body);
    dispatch(actions.updateDataSource(updatedEntity));
    return updatedEntity;
  } catch (err) {
    dispatch(coreActions.addSystemDefcon1(err));
  }
};

export const remove = entity => async (dispatch, getState) => {
  try {
    const state = getState();
    dispatch(actions.removeDataSource(entity));
    if (entity.loaded) {
      Connections.search({fromId: entity.id})
        .map(conn => storeUtils.findEntity(state, 1, conn.toId))
        .filter(item => item instanceof Model)
        .forEach(model => {
          ModelService.upsertModelConfig({
            name: model.name,
            id: model.workspaceId,
            facetName: 'server',
            dataSource: null,
            public: model.public,
          });
        });
      await DataSourceService.delete(entity.workspaceId);
    }
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
