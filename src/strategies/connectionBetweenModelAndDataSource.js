import Backend from '../stores/Backend';

const Connection = LunchBadgerCore.stores.Connection;
const Private = LunchBadgerManage.stores.Private;
const Strategy = LunchBadgerCore.models.Strategy;
const attachConnection = LunchBadgerCore.actions.Connection.attachConnection;
const reattachConnection = LunchBadgerCore.actions.Connection.reattachConnection;

const checkConnection = (connectionInfo, paper) => {
  const isBackend = Backend.findEntity(connectionInfo.sourceId) || Backend.findEntity(connectionInfo.targetId);
  const isPrivate = Private.findEntity(connectionInfo.targetId) || Private.findEntity(connectionInfo.sourceId);

  if (isBackend && isPrivate) {
    if (Connection.search({toId: Connection.formatId(connectionInfo.targetId)}).length ||
      Connection.search({toId: Connection.formatId(connectionInfo.sourceId)}).length) {
      paper.detach(connectionInfo.connection, {
        fireEvent: false
      });

      return false;
    }

    return true;
  }

  return null;
};

const handleConnectionCreate = new Strategy(checkConnection, attachConnection);
const handleConnectionMove = new Strategy(checkConnection, reattachConnection);

export {handleConnectionCreate, handleConnectionMove};
