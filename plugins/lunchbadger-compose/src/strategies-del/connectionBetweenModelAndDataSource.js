// import Backend from '../stores/Backend';
//
// import attachConnection from '../actions/Connection/attach';
// import reattachConnection from '../actions/Connection/reattach';
// import detachConnection from '../actions/Connection/detach';
//
// const Connection = LunchBadgerCore.stores.Connection;
// const Private = LunchBadgerManage.stores.Private;
// const Strategy = LunchBadgerCore.models.Strategy;
//
// const checkConnection = (info) => {
//   const {sourceId, targetId} = info;
//   const isBackend = Backend.findEntity(sourceId);
//   const isPrivate = Private.findEntity(targetId);
//   if (isBackend && isPrivate) {
//     return !Connection.search({toId: Connection.formatId(targetId)}).length;
//   }
//   return null;
// };
//
// const checkConnectionDelete = (info) => {
//   const {sourceId, targetId} = info;
//   const isBackend = Backend.findEntity(sourceId);
//   const isPrivate = Private.findEntity(targetId);
//   return (isBackend && isPrivate);
// }
//
// const checkMovedConnection = (info) => {
//   const {originalSourceId, newSourceId, newTargetId} = info;
//   const isBackend = Backend.findEntity(newSourceId);
//   const isPrivate = Private.findEntity(newTargetId);
//   if (isBackend && isPrivate) {
//     const previousTargetConnections = Connection.search({toId: Connection.formatId(newTargetId)});
//     const previousSourceConnections = Connection.search({fromId: Connection.formatId(newSourceId)});
//     if (previousSourceConnections.length && previousTargetConnections.length) {
//       return false;
//     } else if (previousTargetConnections.length < 1) {
//       return true;
//     } else if (previousTargetConnections.length > 0 && previousTargetConnections[0].fromId === Connection.formatId(originalSourceId)) {
//       return true;
//     }
//     return false;
//   }
//   return null;
// };
//
// const handleConnectionCreate = new Strategy(checkConnection, attachConnection);
// const handleConnectionMove = new Strategy(checkMovedConnection, reattachConnection);
// const handleConnectionDelete = new Strategy(checkConnectionDelete, detachConnection);
//
// export default {
//   handleConnectionCreate,
//   handleConnectionMove,
//   handleConnectionDelete
// };
