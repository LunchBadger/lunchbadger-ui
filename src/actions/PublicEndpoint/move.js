import { dispatch } from '../../dispatcher/AppDispatcher';

export default (endpoint) => {
  dispatch('MovePublicEndpoint', {
    endpoint
  });
};
