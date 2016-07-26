import Backend from '../stores/Backend';

const Connection = LunchBadgerCore.stores.Connection;
const Private = LunchBadgerManage.stores.Private;
const Strategy = LunchBadgerCore.models.Strategy;
const attachConnection = LunchBadgerCore.actions.Connection.attachConnection;
const reattachConnection = LunchBadgerCore.actions.Connection.reattachConnection;

const checkConnection = (connectionInfo) => {
  const isBackend = Backend.findEntity(connectionInfo.sourceId) || Backend.findEntity(connectionInfo.targetId);
  const isPrivate = Private.findEntity(connectionInfo.targetId) || Private.findEntity(connectionInfo.sourceId);

  if (isBackend && isPrivate) {
    return !(Connection.search({toId: Connection.formatId(connectionInfo.targetId)}).length || Connection.search({toId: Connection.formatId(connectionInfo.sourceId)}).length);
  }

  return null;
};

const checkMovedConnection = (connectionInfo) => {
  const isBackend = Backend.findEntity(connectionInfo.newSourceId);
  const isPrivate = Private.findEntity(connectionInfo.newTargetId);

  if (isBackend && isPrivate) {
    return !Connection.search({toId: Connection.formatId(connectionInfo.newTargetId)}).length;
  }

  return null;
};

const handleConnectionCreate = new Strategy(checkConnection, attachConnection);
const handleConnectionMove = new Strategy(checkConnection, reattachConnection);

export {handleConnectionCreate, handleConnectionMove};
