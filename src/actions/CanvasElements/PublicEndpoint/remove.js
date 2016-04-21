import { dispatch } from 'dispatcher/AppDispatcher';

export default (endpoint) => {
  dispatch('RemovePublicEndpoint', {
    endpoint: endpoint
  });
};
