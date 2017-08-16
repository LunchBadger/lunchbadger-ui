import {createSelector} from 'reselect';

const {storeUtils} = LunchBadgerCore.utils;

export default createSelector(
  (_, props) => props.sourceConnections.filter(({toId}) => toId === props.entity.id),
  state => state,
  (conn, state) => {
    if (conn.length === 0) return {gatewayPath: ''};
    const gateway = storeUtils.findGatewayByPipelineId(state, conn[0].fromId);
    if (!gateway) return {gatewayPath: ''};
    return {gatewayPath: 'http://' + gateway.dnsPrefix + '.customer.lunchbadger.com/'};
  },
);
