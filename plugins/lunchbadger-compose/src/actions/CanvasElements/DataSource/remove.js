const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const ConnectionStore = LunchBadgerCore.stores.Connection;
const PrivateStore = LunchBadgerManage.stores.Private;
const Model = LunchBadgerManage.models.Model;

export default (service, entity) => {
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
