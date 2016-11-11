const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const Connection = LunchBadgerCore.stores.Connection;
const Private = LunchBadgerManage.stores.Private;
const ProjectService = LunchBadgerCore.services.ProjectService;

export default (connectionInfo) => {
  let {sourceId, targetId} = connectionInfo;
  let model = Private.findEntity(Connection.formatId(targetId));

  let service = new ProjectService(
    global.LUNCHBADGER_CONFIG.projectApiUrl,
    global.LUNCHBADGER_CONFIG.workspaceApiUrl,
    global.loginManager.user.id_token);

  let modelConfig = {
    name: model.name,
    id: `server.${model.name}`,
    facetName: 'server',
    dataSource: null,
    public: model.public
  };

  dispatch('RemoveConnection', {
    from: sourceId,
    to: targetId
  });

  service.upsertModelConfig(modelConfig);
};
