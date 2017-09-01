import {saveOrder as saveOrderGateway} from '../reduxActions/gateways';
import {saveOrder as saveOrderPrivateEndpoint} from '../reduxActions/privateEndpoints';
import {saveOrder as saveOrderPublicEndpoint} from '../reduxActions/publicEndpoints';

export default [
  saveOrderGateway,
  saveOrderPrivateEndpoint,
  saveOrderPublicEndpoint,
];
