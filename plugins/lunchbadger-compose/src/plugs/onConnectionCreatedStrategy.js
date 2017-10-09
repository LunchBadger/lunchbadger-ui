import {attach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils: {isInQuadrant, formatId, findEntity}} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkConnection = (info) => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  // if (findEntity(state, 1, targetId).constructor.type === 'Function') return null;
  const isBackend = isInQuadrant(state, 0, sourceId);
  const isPrivate = isInQuadrant(state, 1, targetId);
  if (isBackend && isPrivate) {
    if (findEntity(state, 1, targetId).constructor.type === 'Function') {
      return !Connections.search({fromId: formatId(sourceId), toId: formatId(targetId)}).length;
    }
    return !Connections.search({toId: formatId(targetId)}).length;
  }
  return null;
};

export default [
  new Strategy(checkConnection, attach),
];
