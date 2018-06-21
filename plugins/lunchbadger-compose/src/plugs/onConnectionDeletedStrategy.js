import {
  detachWithModel,
  detachWithFunction,
} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils: {isInQuadrant, findEntity}} = LunchBadgerCore.utils;

const checkConnectionDeleteWithModel = info => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  if (findEntity(state, 1, targetId).constructor.type === 'Function_') return null;
  const isBackend = isInQuadrant(state, 0, sourceId);
  const isPrivate = isInQuadrant(state, 1, targetId);
  return isBackend && isPrivate;
};

const checkConnectionDeleteWithFunction = info => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const isSourceBackend = isInQuadrant(state, 0, sourceId);
  const isSourcePrivate = isInQuadrant(state, 1, sourceId);
  const isTargetPrivate = isInQuadrant(state, 1, targetId);
  const sourceType = isSourcePrivate && findEntity(state, 1, sourceId).constructor.type;
  const targetType = findEntity(state, 1, targetId).constructor.type;
  const isSourceFunction = isSourcePrivate && sourceType === 'Function_';
  if (!isSourceFunction && targetType === 'Model') return null;
  return (isSourceBackend || isSourceFunction) && isTargetPrivate;
};

export default [
  new Strategy(checkConnectionDeleteWithModel, detachWithModel),
  new Strategy(checkConnectionDeleteWithFunction, detachWithFunction),
];
