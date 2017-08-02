import {updatePrivateEndpoint} from '../reduxActions/privateEndpoints';
import {updatePublicEndpoint} from '../reduxActions/publicEndpoints';
import {updateGateway} from '../reduxActions/gateways';

export default {
  PrivateEndpoint: updatePrivateEndpoint,
  PublicEndpoint: updatePublicEndpoint,
  Gateway: updateGateway,
};
