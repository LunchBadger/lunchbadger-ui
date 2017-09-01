import {detach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils} = LunchBadgerCore.utils;

const checkConnectionDelete = info => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const isBackend = storeUtils.isInQuadrant(state, 0, sourceId);
  const isPrivate = storeUtils.isInQuadrant(state, 1, targetId);
  return (isBackend && isPrivate);
};

export default [
  new Strategy(checkConnectionDelete, detach),
];
