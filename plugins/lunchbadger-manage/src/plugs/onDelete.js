import {deletePrivateEndpoint} from '../reduxActions/privateEndpoints';
import {deletePublicEndpoint} from '../reduxActions/publicEndpoints';
import {deleteGateway} from '../reduxActions/gateways';

export default {
  PrivateEndpoint: deletePrivateEndpoint,
  PublicEndpoint: deletePublicEndpoint,
  Gateway: deleteGateway,
};
