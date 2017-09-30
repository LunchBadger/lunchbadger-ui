import {attach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils} = LunchBadgerCore.utils;
// const {Connections} = LunchBadgerCore.stores;

const checkConnection = (info) => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const isPrivate = storeUtils.isInQuadrant(state, 1, sourceId);
  const isGatewayIn = storeUtils.findGatewayByPipelineId(state, targetId);
  if (isPrivate && isGatewayIn) {
    return true; //!Connections.search({toId: storeUtils.formatId(targetId)}).length;
  }
  const isGatewayOut = storeUtils.findGatewayByPipelineId(state, sourceId);
  // FIXME - check for endpoints inside apis and endpoints inside apis inside portals
  const isPublic = storeUtils.isInQuadrant(state, 3, targetId);
  if (isGatewayOut && isPublic) {
    return true;
  }
  return null;
};

export default [
  new Strategy(checkConnection, attach),
];
