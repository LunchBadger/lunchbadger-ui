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
  let promise = Promise.resolve(null);

  if (model.loaded && model.name !== props.name) {
    // Workspace API does not support renaming, so we have to delete the old
    // entry before creating a new one.
    promise = promise.then(() => service.deleteModel(model.workspaceId));
    // If we renamed, then must also change the model-config file
    promise = promise.then(() => service.deleteModelConfig(model.workspaceId));
  }

  if ((model.loaded && model.name !== props.name) ||
      (model.loaded && 'public' in props && model.public !== props.public) ||
      (!model.loaded)) {

    // Need to update or create the model config
    let dataSources = ConnectionStore
      .getConnectionsForTarget(model.id)
      .map(conn => BackendStore.findEntity(conn.fromId))
      .filter(entity => entity instanceof DataSource);
    let dataSourceName = dataSources.length > 0 ? dataSources[0].name : null;

    promise = promise.then(() => service.upsertModelConfig({
      name: props.name,
      id: `server.${props.name}`,
      facetName: 'server',
      dataSource: dataSourceName,
      public: 'public' in props ? props.public : model.public
    }));
  }

  promise = promise
    .then(() => service.putModel(_.merge(model, props)))
    .then(() => service.deleteModelProperties(model.workspaceId))
    .then(() => service.upsertModelProperties(props.properties))
    .then(() => service.deleteModelRelations(model.workspaceId))
    .then(() => service.upsertModelRelations(props.relations))

  dispatchAsync(promise, {
    request: 'UpdateModelStart',
    success: 'UpdateModelEnd',
    failure: 'UpdateModelEnd'
  }, {
    id: id,
    data: {
      loaded: true,
      ...props
    }
  });
};
