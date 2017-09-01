const ConnectionStore = LunchBadgerCore.stores.Connection;
const PrivateStore = LunchBadgerManage.stores.Private;
const Model = LunchBadgerManage.models.Model;
const handleFatals = LunchBadgerCore.utils.handleFatals;

export default (service, entity) => {
  if (entity.loaded) {
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
    handleFatals(promise);
  }
}
