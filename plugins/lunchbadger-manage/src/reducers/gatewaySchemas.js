import {transformGatewaySchemas} from '../utils';
import gatewaySchemasMock from '../gatewaySchemasMock';

export default (state = transformGatewaySchemas(gatewaySchemasMock), action) => {
  switch (action.type) {
    default:
      return state;
  }
};
