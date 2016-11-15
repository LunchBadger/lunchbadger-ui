import Backend from '../../stores/Backend';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const Connection = LunchBadgerCore.stores.Connection;
const Private = LunchBadgerManage.stores.Private;

export default (connectionInfo, {projectService}) => {
  connectionInfo.connection.setType('wip');

  let {originalTargetId, newSourceId, newTargetId} = connectionInfo;
  let promise = Promise.resolve(null);

  if (originalTargetId !== newTargetId) {
    // Moved the model end, have to remove data source from original model
    let originalModel = Private.findEntity(Connection.formatId(originalTargetId));

    promise = promise.then(() => {
      return projectService.upsertModelConfig({
        name: originalModel.name,
        id: `server.${originalModel.name}`,
        facetName: 'server',
        dataSource: null,
        public: originalModel.public
      });
    });
  }

  let dataSource = Backend.findEntity(Connection.formatId(newSourceId));
  let model = Private.findEntity(Connection.formatId(newTargetId));

  promise = promise.then(() => projectService.upsertModelConfig({
    name: model.name,
    id: `server.${model.name}`,
    facetName: 'server',
    dataSource: dataSource.name,
    public: model.public
  })).then(() => {
    connectionInfo.connection.removeType('wip');
  });

  dispatch('MoveConnection', {
    from: connectionInfo.originalSourceId,
    to: connectionInfo.originalTargetId,
    newFrom: connectionInfo.newSourceId,
    newTo: connectionInfo.newTargetId,
    connectionInfo
  });
};
