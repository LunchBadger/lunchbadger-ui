import Backend from '../stores/Backend';

const Private = LunchBadgerManage.stores.Private;
const Strategy = LunchBadgerCore.models.Strategy;
const attachConnection = LunchBadgerCore.actions.Connection.attachConnection;
const reattachConnection = LunchBadgerCore.actions.Connection.reattachConnection;

const checkConnection = (connectionInfo) => {
  const isBackend = Backend.findEntity(connectionInfo.sourceId) || Backend.findEntity(connectionInfo.targetId);
  const isPrivate = Private.findEntity(connectionInfo.targetId) || Private.findEntity(connectionInfo.sourceId);

  return isBackend && isPrivate;
};

const handleConnectionCreate = new Strategy(checkConnection, attachConnection);
const handleConnectionMove = new Strategy(checkConnection, reattachConnection);

export {handleConnectionCreate, handleConnectionMove};
