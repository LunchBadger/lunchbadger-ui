import Backend from '../stores/Backend';

const Connection = LunchBadgerCore.stores.Connection;
const Private = LunchBadgerManage.stores.Private;
const Strategy = LunchBadgerCore.models.Strategy;
const attachConnection = LunchBadgerCore.actions.Connection.attachConnection;
const reattachConnection = LunchBadgerCore.actions.Connection.reattachConnection;

const checkConnection = (sourceId, targetId) => {
  const isBackend = Backend.findEntity(sourceId);
  const isPrivate = Private.findEntity(targetId);

  if (isBackend && isPrivate) {
    return !Connection.search({toId: Connection.formatId(targetId)}).length;
  }

  return null;
};

const checkMovedConnection = (oldSourceId, oldTargetId, sourceId, targetId) => {
  const isBackend = Backend.findEntity(sourceId);
  const isPrivate = Private.findEntity(targetId);

  if (isBackend && isPrivate) {
    const previousTargetConnections = Connection.search({toId: Connection.formatId(targetId)});
    const previousSourceConnections = Connection.search({fromId: Connection.formatId(sourceId)});

    if (previousSourceConnections.length) {
      return false;
    }

    if (previousTargetConnections.length < 1) {
      return true;
    } else if (previousTargetConnections.length > 0 && previousTargetConnections[0].fromId === Connection.formatId(oldSourceId)) {
      return true;
    }

    return false;
  }

  return null;
};

const handleConnectionCreate = new Strategy(checkConnection, attachConnection);
const handleConnectionMove = new Strategy(checkMovedConnection, reattachConnection);

export {handleConnectionCreate, handleConnectionMove};
