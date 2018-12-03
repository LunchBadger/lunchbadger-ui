import {actions} from './actions';
import {DataSourceService, ModelService} from '../services';
import DataSource from '../models/DataSource';
import Model from '../models/Model';

const {storeUtils, coreActions, actions: actionsCore} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const add = (label, connector) => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[0].entities;
  const itemOrder = storeUtils.getNextItemOrder(types, entities);
  const name = storeUtils.uniqueName(label, entities.dataSources);
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
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const isDifferent = entity.loaded && model.name !== state.entities.dataSources[entity.id].name;
  updatedEntity = DataSource.create({
    ...entity.toJSON(),
    ...Object.keys(entity.connectorProperties())
      .reduce((map, item) => ({...map, [item]: undefined}), {}),
    ...model,
    ready: false,
    error: null,
  });
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
    await new Promise(res => setTimeout(res, 100));
    const {body} = await DataSourceService.upsert(updatedEntity.toJSON());
    if (body.hasOwnProperty('wsdl')) {
      body.soapOperations = body.operations || {};
      delete body.operations;
    }
    updatedEntity = DataSource.create(body);
    dispatch(actions.updateDataSource(updatedEntity));
    await dispatch(coreActions.saveToServer());
    return updatedEntity;
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const remove = entity => async (dispatch, getState) => {
  const isAutoSave = false;
  try {
    if (entity.loaded) {
      const state = getState();
      const updatedEntity = entity.recreate();
      updatedEntity.ready = false;
      updatedEntity.deleting = true;
      updatedEntity.error = null;
      dispatch(actions.updateDataSource(updatedEntity));
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
    dispatch(actions.removeDataSource(entity));
    if (isAutoSave) {
      await dispatch(coreActions.saveToServer());
    }
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
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
    } catch (error) {
      dispatch(coreActions.addSystemDefcon1({error}));
    }
  }
};
