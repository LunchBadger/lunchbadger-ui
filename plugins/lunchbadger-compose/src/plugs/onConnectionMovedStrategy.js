import {reattach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils: {isInQuadrant, formatId}} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkMovedConnection = info => (_, getState) => {
  const state = getState();
  const {originalSourceId, newSourceId, newTargetId} = info;
  const isBackend = isInQuadrant(state, 0, newSourceId);
  const isPrivate = isInQuadrant(state, 1, newTargetId);
  if (isBackend && isPrivate) {
    const previousTargetConnections = Connections.search({toId: formatId(newTargetId)});
    if (previousTargetConnections.length < 1
      || (previousTargetConnections.length > 0 && previousTargetConnections[0].fromId === formatId(originalSourceId))
    ) {
      return true;
    }
    return false;
  }
  return null;
};

export default [
  new Strategy(checkMovedConnection, reattach),
];
