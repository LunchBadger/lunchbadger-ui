import {saveOrder as saveOrderGateway} from '../reduxActions/gateways';
import {saveOrder as saveOrderServiceEndpoint} from '../reduxActions/serviceEndpoints';
import {saveOrder as saveOrderPublicEndpoint} from '../reduxActions/publicEndpoints';

export default [
  saveOrderGateway,
  saveOrderServiceEndpoint,
  saveOrderPublicEndpoint,
];
