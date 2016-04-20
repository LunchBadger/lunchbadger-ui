import { dispatch } from '../../dispatcher/AppDispatcher';
import PublicEndpoint from '../../models/PublicEndpoint';

export default (endpoint) => {
  dispatch('MovePublicEndpoint', {
    endpoint
  });
};
