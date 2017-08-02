import PrivateEndpoint from '../models/_privateEndpoint';
import PublicEndpoint from '../models/_publicEndpoint';
import Gateway from '../models/_gateway';

export default [
  state => {
    const {entities} = state;
    const privateEndpoints = Object.keys(entities.privateEndpoints)
      .map(key => PrivateEndpoint.toJSON(entities.privateEndpoints[key]));
    const publicEndpoints = Object.keys(entities.publicEndpoints)
      .map(key => PublicEndpoint.toJSON(entities.publicEndpoints[key]));
    const gateways = Object.keys(entities.gateways)
      .map(key => Gateway.toJSON(entities.gateways[key]));
    return {
      privateEndpoints,
      publicEndpoints,
      gateways,
    };
  },
];
