import {attach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkConnection = (info) => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const isPrivate = storeUtils.isInQuadrant(state, 1, sourceId);
  const isGatewayIn = storeUtils.findGatewayByPipelineId(state, targetId);
  if (isPrivate && isGatewayIn) {
    return !Connections.isFromTo(sourceId, targetId);
  }
  const isGatewayOut = storeUtils.findGatewayByPipelineId(state, sourceId);
  const isPublic = storeUtils.isInPublicQuadrant(state, targetId);
  if (isGatewayOut && isPublic) {
    return !Connections.isFromTo(sourceId, targetId);
  }
  return null;
};

export default [
  new Strategy(checkConnection, attach),
];
