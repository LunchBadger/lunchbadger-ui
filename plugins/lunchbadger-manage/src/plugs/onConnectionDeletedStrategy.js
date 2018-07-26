import {detach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils} = LunchBadgerCore.utils;

const checkConnectionDelete = info => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const isPrivate = storeUtils.isInQuadrant(state, 1, sourceId);
  const isGatewayIn = storeUtils.findGatewayByPipelineId(state, targetId);
  if (isPrivate && isGatewayIn) {
    return true;
  }
  const isGatewayOut = storeUtils.findGatewayByPipelineId(state, sourceId);
  const isPublic = storeUtils.isInPublicQuadrant(state, targetId);
  if (isGatewayOut && isPublic) {
    return true;
  }
  return null;
};

export default [
  new Strategy(checkConnectionDelete, detach),
];
