import ModelService from '../services/ModelService';

const {storeUtils, coreActions, actions: actionsCore} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const addModelConfigsToConnections = response => (dispatch, getState) => {
  const state = getState();
  const connections = response[2].body
    .filter(item => item.dataSource)
    .map(item => ({
      fromId: storeUtils.findEntityByName(state, 0, item.dataSource).id,
      toId: storeUtils.findEntityByName(state, 1, item.name).id,
    }));
  dispatch(actionsCore.addInitialConnections(connections));
};

export const attachWithModel = info => async (dispatch, getState) => {
  info.connection.addType('wip');
  const state = getState();
  Connections.addConnectionByInfo(info);
  const {sourceId, targetId} = info;
  const dataSource = storeUtils.findEntity(state, 0, sourceId);
  const model = storeUtils.findEntity(state, 1, targetId);
  const modelConfig = {
    name: model.name,
    id: `server.${model.name}`,
    facetName: 'server',
    dataSource: dataSource.name,
    public: model.public,
  };
  try {
    await ModelService.upsertModelConfig(modelConfig);
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
  info.connection.removeType('wip');
  await dispatch(coreActions.saveToServer());
};

export const attachWithFunction = info => async (dispatch) => {
  Connections.addConnectionByInfo(info);
  try {
    await dispatch(coreActions.saveToServer());
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const detachWithModel = info => async (dispatch, getState) => {
  const state = getState();
  const {sourceId: fromId, targetId: toId} = info;
  Connections.removeConnection(fromId, toId);
  const model = storeUtils.findEntity(state, 1, toId);
  const modelConfig = {
    name: model.name,
    id: `server.${model.name}`,
    facetName: 'server',
    dataSource: null,
    public: model.public,
  };
  try {
    await ModelService.upsertModelConfig(modelConfig);
    await dispatch(coreActions.saveToServer());
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const detachWithFunction = info => async (dispatch) => {
  const {sourceId: fromId, targetId: toId} = info;
  Connections.removeConnection(fromId, toId);
  try {
    await dispatch(coreActions.saveToServer());
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const reattachWithModel = info => async (dispatch, getState) => {
  try {
    info.connection.addType('wip');
    const state = getState();
    const {originalTargetId, newSourceId, newTargetId} = info;
    Connections.moveConnection(info);
    if (originalTargetId !== newTargetId) {
      const originalModel = storeUtils.findEntity(state, 1, originalTargetId);
      if (originalModel.constructor.type === 'Model') {
        await ModelService.upsertModelConfig({
          name: originalModel.name,
          id: `server.${originalModel.name}`,
          facetName: 'server',
          dataSource: null,
          public: originalModel.public,
        });
      }
    }
    const dataSource = storeUtils.findEntity(state, 0, newSourceId);
    const model = storeUtils.findEntity(state, 1, newTargetId);
    if (model.constructor.type === 'Model') {
      await ModelService.upsertModelConfig({
        name: model.name,
        id: `server.${model.name}`,
        facetName: 'server',
        dataSource: dataSource.name,
        public: model.public,
      });
    }
    info.connection.removeType('wip');
    await dispatch(coreActions.saveToServer());
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const reattachWithFunction = info => async (dispatch) => {
  Connections.moveConnection(info);
  try {
    await dispatch(coreActions.saveToServer());
  } catch (error) {
    dispatch(coreActions.addSystemDefcon1({error}));
  }
};
