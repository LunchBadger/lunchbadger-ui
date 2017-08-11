import {createSelector} from 'reselect';
import _ from 'lodash';

const {storeUtils} = LunchBadgerCore.utils;

export default createSelector(
  (_, props) => props.entity.id,
  state => state,
  (id, state) => {
    const conn = _.find(state.connections, {toId: id});
    if (!conn) return {gatewayPath: ''};
    const gateway = storeUtils.findGatewayByPipelineId(state, conn.fromId);
    if (!gateway) return {gatewayPath: ''};
    return {gatewayPath: 'http://' + gateway.dnsPrefix + '.customer.lunchbadger.com/'};
  },
);
