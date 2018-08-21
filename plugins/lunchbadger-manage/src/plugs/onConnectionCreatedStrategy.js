import {attach} from '../reduxActions/connections';

const Strategy = LunchBadgerCore.models.Strategy;
const {storeUtils: {formatId, isInQuadrant, isInPublicQuadrant, findGatewayByPipelineId}} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

const checkConnection = (info) => (_, getState) => {
  const {sourceId, targetId} = info;
  const state = getState();
  const isPrivate = isInQuadrant(state, 1, sourceId);
  const isGatewayIn = findGatewayByPipelineId(state, targetId);
  if (isPrivate && isGatewayIn) {
    return !Connections.isFromTo(sourceId, targetId);
  }
  const isGatewayOut = findGatewayByPipelineId(state, sourceId);
  const isPublic = isInPublicQuadrant(state, targetId);
  if (isGatewayOut && isPublic) {
    const conns = Connections.search({toId: formatId(targetId)});
    return !conns.length;
  }
  return null;
};

export default [
  new Strategy(checkConnection, attach),
];
