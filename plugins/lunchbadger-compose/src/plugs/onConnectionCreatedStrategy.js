import {
  attachWithModel,
  attachWithFunction,
} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils: {isInQuadrant, formatId, findEntity}} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkConnectionWithModel = (info) => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const entity = findEntity(state, 1, targetId);
  if (entity && entity.constructor.type === 'Function_') return null;
  const isBackend = isInQuadrant(state, 0, sourceId);
  const isPrivate = isInQuadrant(state, 1, targetId);
  if (isBackend && isPrivate) {
    const conns = Connections
      .search({toId: formatId(targetId)})
      .filter(({info: {source}}) => !source.parentElement.classList.contains('port-Function_'));
    return !conns.length;
  }
  return null;
};

const checkConnectionWithFunction = (info) => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const isSourceBackend = isInQuadrant(state, 0, sourceId);
  const isSourcePrivate = isInQuadrant(state, 1, sourceId);
  const isTargetPrivate = isInQuadrant(state, 1, targetId);
  const sourceType = isSourcePrivate && findEntity(state, 1, sourceId).constructor.type;
  const targetType = isTargetPrivate && findEntity(state, 1, targetId).constructor.type;
  const isSourceFunction = isSourcePrivate && sourceType === 'Function_';
  if (!isSourceFunction && targetType === 'Model') return null;
  if ((isSourceBackend || isSourceFunction) && isTargetPrivate) {
    const conns = Connections
      .search({toId: formatId(targetId)})
      .filter(({info: {source}}) => source.parentElement.classList.contains('port-Function_'));
    return !conns.length;
  }
  return null;
};

export default [
  new Strategy(checkConnectionWithModel, attachWithModel),
  new Strategy(checkConnectionWithFunction, attachWithFunction),
];
