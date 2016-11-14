const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const ProjectService = LunchBadgerCore.services.ProjectService;
const ConnectionStore = LunchBadgerCore.stores.Connection;
const PrivateStore = LunchBadgerManage.stores.Private;
const Model = LunchBadgerManage.models.Model;

export default (entity) => {
  let service = new ProjectService(
    global.LUNCHBADGER_CONFIG.projectApiUrl,
    global.LUNCHBADGER_CONFIG.workspaceApiUrl,
    global.loginManager.user.id_token);

  let promise = service.deleteDataSource(entity.workspaceId);

  ConnectionStore
    .getConnectionsForSource(entity.id)
    .map(conn => PrivateStore.findEntity(conn.toId))
    .filter(item => item instanceof Model)
    .forEach(model => {
      promise = promise.then(() => service.upsertModelConfig({
        name: model.name,
        id: model.workspaceId,
        facetName: 'server',
        dataSource: null
      }));
    });

  dispatch('RemoveEntity', {
    entity
  });
}
