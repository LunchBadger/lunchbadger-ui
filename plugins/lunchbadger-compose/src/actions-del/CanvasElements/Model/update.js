// import _ from 'lodash';
// import BackendStore from '../../../stores/Backend';
// import DataSource from '../../../models/DataSource';
//
// const {dispatchAsync} = LunchBadgerCore.dispatcher.AppDispatcher;
// const Private = LunchBadgerManage.stores.Private;
// const ConnectionStore = LunchBadgerCore.stores.Connection;
// const handleFatals = LunchBadgerCore.utils.handleFatals;
// const ProjectService = LunchBadgerCore.services.ProjectService;
//
// export default (id, props, propsToRemove = []) => {
//   let model = Private.findEntity(id);
//   let promise = Promise.resolve(null);
//
//   if (model.loaded && model.name !== props.name) {
//     // Have to save the workspace ID as model may be modified before the then
//     // handler gets executed.
//     let workspaceId = model.workspaceId;
//
//     // Workspace API does not support renaming, so we have to delete the old
//     // entry before creating a new one.
//     promise = promise.then(() => ProjectService.deleteModel(workspaceId));
//     // If we renamed, then must also change the model-config file
//     promise = promise.then(() => ProjectService.deleteModelConfig(workspaceId));
//   }
//
//   if ((model.loaded && model.name !== props.name) ||
//       (model.loaded && 'public' in props && model.public !== props.public) ||
//       (!model.loaded)) {
//
//     // Need to update or create the model config
//     let dataSources = ConnectionStore
//       .getConnectionsForTarget(model.id)
//       .map(conn => BackendStore.findEntity(conn.fromId))
//       .filter(entity => entity instanceof DataSource);
//     let dataSourceName = dataSources.length > 0 ? dataSources[0].name : null;
//
//     promise = promise.then(() => ProjectService.upsertModelConfig({
//       name: props.name,
//       id: `server.${props.name}`,
//       facetName: 'server',
//       dataSource: dataSourceName,
//       public: 'public' in props ? props.public : model.public
//     }));
//   }
//
//   propsToRemove.forEach(prop => delete model[prop]);
//
//   promise = promise
//     .then(() => ProjectService.upsertModel(_.merge(model, props)))
//     .then(() => ProjectService.deleteModelProperties(model.workspaceId))
//     .then(() => {
//       if (props.properties) {
//         return ProjectService.upsertModelProperties(props.properties)
//       }
//     })
//     .then(() => ProjectService.deleteModelRelations(model.workspaceId))
//     .then(() => {
//       if (props.relations) {
//         return ProjectService.upsertModelRelations(props.relations)
//       }
//     });
//
//   dispatchAsync(handleFatals(promise), {
//     request: 'UpdateModelStart',
//     success: 'UpdateModelEnd',
//     failure: 'UpdateModelEnd'
//   }, {
//     id: id,
//     data: {
//       loaded: true,
//       ...props
//     }
//   });
//
//   return promise;
// };
