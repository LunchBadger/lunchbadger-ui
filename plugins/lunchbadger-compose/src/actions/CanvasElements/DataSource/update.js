import _ from 'lodash';
import BackendStore from '../../../stores/Backend';

const {dispatchAsync} = LunchBadgerCore.dispatcher.AppDispatcher;
const ConnectionStore = LunchBadgerCore.stores.Connection;
const PrivateStore = LunchBadgerManage.stores.Private;
const Model = LunchBadgerManage.models.Model;
const handleFatals = LunchBadgerCore.utils.handleFatals;

export default (service, id, props) => {
  let dataSource = BackendStore.findEntity(id);
  let oldWsId = dataSource.workspaceId;
  let oldId = dataSource.id;

  let promise = Promise.resolve(null);

  if (dataSource.loaded && dataSource.name !== props.name) {
    // Workspace API does not support renaming, so we have to delete the old
    // entry before creating a new one.
    promise = promise.then(() => service.deleteDataSource(oldWsId));

    // Also have to re-point the models to the new data source name.
    // Have to do everything sequentially b/c loopback-workspace cannot deal
    // properly with concurrent writes to the same file.
    ConnectionStore
      .getConnectionsForSource(oldId)
      .map(conn => PrivateStore.findEntity(conn.toId))
      .filter(item => item instanceof Model)
      .forEach(model => {
        promise = promise.then(() => service.upsertModelConfig({
          name: model.name,
          id: model.workspaceId,
          facetName: 'server',
          dataSource: props.name
        }));
      });
  }

  promise = promise.then(() => service.upsertDataSource(_.merge(dataSource, props)));

  dispatchAsync(handleFatals(promise), {
    request: 'UpdateDataSourceStart',
    success: 'UpdateDataSourceEnd',
    failure: 'UpdateDataSourceEnd'
  }, {
    id: id,
    data: {
      loaded: true,
      ...props
    }
  });
};
