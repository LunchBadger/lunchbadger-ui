import PublicEndpoint from '../../../models/PublicEndpoint';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name, path, sourceId, outPort) => {
  dispatch('AddPublicEndpointAndConnect', {
    endpoint: PublicEndpoint.create({
      name: name || 'Public Endpoint',
      path: path || '/endpoint'
    }),
    sourceId,
    outPort
  });
};
