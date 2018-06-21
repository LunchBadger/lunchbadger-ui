import {
  reattachWithModel,
  reattachWithFunction,
} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils: {isInQuadrant, formatId, findEntity}} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkMovedConnectionWithModel = info => (_, getState) => {
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

const checkMovedConnectionWithFunction = info => (_, getState) => {
  const state = getState();
  const {originalSourceId, originalTargetId, newSourceId, newTargetId} = info;
  const isOriginalSourcePrivate = isInQuadrant(state, 1, originalSourceId);
  const originalSourceType = isOriginalSourcePrivate && findEntity(state, 1, originalSourceId).constructor.type;
  const isNewSourcePrivate = isInQuadrant(state, 1, newSourceId);
  const newSourceType = isNewSourcePrivate && findEntity(state, 1, newSourceId).constructor.type;
  const isOriginalTargetPrivate = isInQuadrant(state, 1, originalTargetId);
  const originalTargetType = isOriginalTargetPrivate && findEntity(state, 1, originalTargetId).constructor.type;
  const isNewTargetPrivate = isInQuadrant(state, 1, newTargetId);
  const newTargetType = isNewTargetPrivate && findEntity(state, 1, newTargetId).constructor.type;
  if (
    (
      originalSourceType === 'Function_' && originalSourceType === newSourceType
      &&
      originalTargetType === 'Model' && originalTargetType === newTargetType
    )
    ||
    (
      originalSourceType === 'Model' && originalSourceType === newSourceType
      &&
      originalTargetType === 'Function_' && originalTargetType === newTargetType
    )
  ) {
    return true;
  }
  return null;
};

export default [
  new Strategy(checkMovedConnectionWithModel, reattachWithModel),
  new Strategy(checkMovedConnectionWithFunction, reattachWithFunction),
];
