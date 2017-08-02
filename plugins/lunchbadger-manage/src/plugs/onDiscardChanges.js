import {discardPrivateEndpointChanges} from '../reduxActions/privateEndpoints';
import {discardPublicEndpointChanges} from '../reduxActions/publicEndpoints';
import {discardGatewayChanges} from '../reduxActions/gateways';

export default {
  PrivateEndpoint: discardPrivateEndpointChanges,
  PublicEndpoint: discardPublicEndpointChanges,
  Gateway: discardGatewayChanges,
};
