import _ from 'lodash';
import BackendStore from '../../../stores/Backend';
import DataSource from '../../../models/DataSource';

const {dispatchAsync} = LunchBadgerCore.dispatcher.AppDispatcher;
const ProjectService = LunchBadgerCore.services.ProjectService;
const Private = LunchBadgerManage.stores.Private;
const ConnectionStore = LunchBadgerCore.stores.Connection;

export default (id, props) => {
  let service = new ProjectService(
    global.LUNCHBADGER_CONFIG.projectApiUrl,
    global.LUNCHBADGER_CONFIG.workspaceApiUrl,
    global.loginManager.user.id_token);

  let model = Private.findEntity(id);
  let oldWsId = model.workspaceId;

  let promise = Promise.resolve(null);

  if (model.loaded && model.name !== props.name) {
    // Workspace API does not support renaming, so we have to delete the old
    // entry before creating a new one.
    promise = promise.then(() => service.deleteModel(oldWsId));

    // If we renamed, then must also change the model-config file
    let dataSources = ConnectionStore
      .getConnectionsForTarget(model.id)
      .map(conn => BackendStore.findEntity(conn.fromId))
      .filter(entity => entity instanceof DataSource);
    let dataSourceName = dataSources.length > 0 ? dataSources[0].name : null;

    promise = promise.then(() => service.deleteModelConfig(oldWsId));
    promise = promise.then(() => service.upsertModelConfig({
      name: props.name,
      id: `main.${props.name}`,
      facetName: 'main',
      dataSource: dataSourceName,
      public: model.public
    }));
  } else if (!model.loaded) {
    // This is a new model, must also create a model config
    promise = promise.then(() => service.upsertModelConfig({
      name: props.name,
      id: model.workspaceId,
      facetName: 'main',
      dataSource: null,
      public: model.public
    }));
  }

  promise = promise.then(() => service.putModel(_.merge(model, props)));

  dispatchAsync(promise, {
    request: 'UpdateModelStart',
    success: 'UpdateModelEnd',
    failure: 'UpdateModelEnd'
  }, {
    id: id,
    data: {
      loaded: true,
      props
    }
  });
};
