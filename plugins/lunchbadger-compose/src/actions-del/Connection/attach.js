// import Backend from '../../stores/Backend';
//
// const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
// const Connection = LunchBadgerCore.stores.Connection;
// const Private = LunchBadgerManage.stores.Private;
// const handleFatals = LunchBadgerCore.utils.handleFatals;
// const ProjectService = LunchBadgerCore.services.ProjectService;
//
// export default (connectionInfo) => {
//   connectionInfo.connection.setType('wip');
//   let {sourceId, targetId} = connectionInfo;
//   let dataSource = Backend.findEntity(Connection.formatId(sourceId));
//   let model = Private.findEntity(Connection.formatId(targetId));
//   let modelConfig = {
//     name: model.name,
//     id: `server.${model.name}`,
//     facetName: 'server',
//     dataSource: dataSource.name,
//     public: model.public
//   };
//   let promise = ProjectService.upsertModelConfig(modelConfig).then(() => {
//     connectionInfo.connection.removeType('wip');
//   });
//   handleFatals(promise);
//   dispatch('AddConnection', {
//     from: connectionInfo.sourceId,
//     to: connectionInfo.targetId,
//     info: connectionInfo
//   });
// };
