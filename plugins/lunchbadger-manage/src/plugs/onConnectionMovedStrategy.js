import {reattach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils: {formatId, isInQuadrant, isInPublicQuadrant, findGatewayByPipelineId}} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkMovedConnection = info => (_, getState) => {
  const state = getState();
  const {newSourceId, newTargetId} = info;
  const isPrivate = isInQuadrant(state, 1, newSourceId);
  const isGatewayIn = findGatewayByPipelineId(state, newTargetId);
  if (isPrivate && isGatewayIn) {
    // const previousTargetConnections = Connections.search({toId: storeUtils.formatId(newTargetId)});
    // const previousSourceConnections = Connections.search({fromId: storeUtils.formatId(newSourceId)});
    // if (previousSourceConnections.length && previousTargetConnections.length) {
    //   return false;
    // } else if (previousTargetConnections.length < 1) {
    //   return true;
    // } else if (previousTargetConnections.length > 0 && previousTargetConnections[0].fromId === storeUtils.formatId(originalSourceId)) {
    //   return true;
    // }
    // return false;
    return !Connections.isFromTo(newSourceId, newTargetId);
  }
  const isGatewayOut = findGatewayByPipelineId(state, newSourceId);
  const isPublic = isInPublicQuadrant(state, newTargetId);
  if (isGatewayOut && isPublic) {
    const conns = Connections.search({toId: formatId(newTargetId)});
    return !conns.length;
  }
  return null;
};

export default [
  new Strategy(checkMovedConnection, reattach),
];
