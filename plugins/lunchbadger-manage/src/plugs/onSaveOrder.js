import {saveOrder as saveOrderGateway} from '../reduxActions/gateways';
import {saveOrder as saveOrderServiceEndpoint} from '../reduxActions/serviceEndpoints';
import {saveOrder as saveOrderApiEndpoint} from '../reduxActions/apiEndpoints';

export default [
  saveOrderGateway,
  saveOrderServiceEndpoint,
  saveOrderApiEndpoint,
];
