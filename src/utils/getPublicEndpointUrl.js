import GatewayStore from '../stores/Gateway';
const ConnectionStore = LunchBadgerCore.stores.Connection;

export default function getPublicEndpointUrl(publicEndpointId, path) {
  const conn = ConnectionStore.getConnectionsForTarget(publicEndpointId);
  if (conn.length == 0) {
    return path;
  }
  const pipelineId = conn[0].fromId
  const gateway = GatewayStore.findEntityByPipelineId(pipelineId);
  if (!gateway) {
    return path;
  }

  const rootPath = 'http://' + gateway.dnsPrefix + '.customer.lunchbadger.com';
  const subPath = path.replace(/^\//g, '');
  return rootPath + '/' + subPath;
}

