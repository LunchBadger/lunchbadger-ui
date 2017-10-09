import {detach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils: {isInQuadrant, findEntity}} = LunchBadgerCore.utils;

const checkConnectionDelete = info => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  if (findEntity(state, 1, targetId).constructor.type === 'Function') return null;
  const isBackend = isInQuadrant(state, 0, sourceId);
  const isPrivate = isInQuadrant(state, 1, targetId);
  return isBackend && isPrivate;
};

export default [
  new Strategy(checkConnectionDelete, detach),
];
