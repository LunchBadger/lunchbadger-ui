import PrivateEndpoint from '../models/_privateEndpoint';
import PublicEndpoint from '../models/_publicEndpoint';
import Gateway from '../models/_gateway';

export default {
  PrivateEndpoint: PrivateEndpoint.validate,
  PublicEndpoint: PublicEndpoint.validate,
  Gateway: Gateway.validate,
};
