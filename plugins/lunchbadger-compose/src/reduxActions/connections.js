import ModelService from '../services/ModelService';

const {storeUtils, actions: coreActions} = LunchBadgerCore.utils;

export const addModelConfigsToConnections = response => (dispatch, getState) => {
  const state = getState();
  const connections = response[2].body
    .filter(item => item.dataSource)
    .map(item => ({
      fromId: storeUtils.findEntityByName(state, 0, item.dataSource).id,
      toId: storeUtils.findEntityByName(state, 1, item.name).id,
    }));
  dispatch(coreActions.addInitialConnections(connections));
}

export const attach = info => async (dispatch, getState) => {
  info.connection.setType('wip');
  const state = getState();
  const {sourceId, targetId} = info;
  dispatch(coreActions.addConnection({
    fromId: storeUtils.formatId(sourceId),
    toId: storeUtils.formatId(targetId),
    info,
  }));
  const dataSource = storeUtils.findEntity(state, 0, sourceId);
  const model = storeUtils.findEntity(state, 1, targetId);
  const modelConfig = {
    name: model.name,
    id: `server.${model.name}`,
    facetName: 'server',
    dataSource: dataSource.name,
    public: model.public,
  };
  await ModelService.upsertModelConfig(modelConfig); // FIXME - try/catch
  info.connection.removeType('wip');
};

export const detach = info => async (dispatch, getState) => {
  const state = getState();
  const {sourceId, targetId} = info;
  dispatch(coreActions.removeConnection({
    fromId: storeUtils.formatId(sourceId),
    toId: storeUtils.formatId(targetId),
  }));
  const model = storeUtils.findEntity(state, 1, targetId);
  const modelConfig = {
    name: model.name,
    id: `server.${model.name}`,
    facetName: 'server',
    dataSource: null,
    public: model.public,
  };
  await ModelService.upsertModelConfig(modelConfig);
};

export const reattach = info => async (dispatch, getState) => {
  info.connection.setType('wip');
  const state = getState();
  const {originalSourceId, originalTargetId, newSourceId, newTargetId} = info;
  dispatch(coreActions.moveConnection({
    fromId: storeUtils.formatId(originalSourceId),
    toId: storeUtils.formatId(originalTargetId),
    newFromId: storeUtils.formatId(newSourceId),
    newToId: storeUtils.formatId(newTargetId),
    info,
  }));
  if (originalTargetId !== newTargetId) {
    // Moved the model end, have to remove data source from original model
    const originalModel = storeUtils.findEntity(state, 1, originalTargetId);
    await ModelService.upsertModelConfig({
      name: originalModel.name,
      id: `server.${originalModel.name}`,
      facetName: 'server',
      dataSource: null,
      public: originalModel.public,
    });
  }
  const dataSource = storeUtils.findEntity(state, 0, newSourceId);
  const model = storeUtils.findEntity(state, 1, newTargetId);
  await ModelService.upsertModelConfig({
    name: model.name,
    id: `server.${model.name}`,
    facetName: 'server',
    dataSource: dataSource.name,
    public: model.public,
  });
  info.connection.removeType('wip');
}
