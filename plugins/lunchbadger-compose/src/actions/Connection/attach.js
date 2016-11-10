import Backend from '../../stores/Backend';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const Connection = LunchBadgerCore.stores.Connection;
const Private = LunchBadgerManage.stores.Private;
const ProjectService = LunchBadgerCore.services.ProjectService;

export default (connectionInfo) => {
  connectionInfo.connection.setType('wip');

  let {sourceId, targetId} = connectionInfo;
  let dataSource = Backend.findEntity(Connection.formatId(sourceId));
  let model = Private.findEntity(Connection.formatId(targetId));

  let service = new ProjectService(
    global.LUNCHBADGER_CONFIG.projectApiUrl,
    global.LUNCHBADGER_CONFIG.workspaceApiUrl,
    global.loginManager.user.id_token);

  let modelConfig = {
    name: model.name,
    id: `server.${model.name}`,
    facetName: 'server',
    dataSource: dataSource.name,
    public: model.public
  };

  service.upsertModelConfig(modelConfig).then(() => {
    connectionInfo.connection.removeType('wip');
  });

  dispatch('AddConnection', {
    from: connectionInfo.sourceId,
    to: connectionInfo.targetId,
    info: connectionInfo
  });
};
