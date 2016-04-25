import { dispatch } from 'dispatcher/AppDispatcher';

export default (api, endpoint) => {
  dispatch('BundleAPI', {
    api,
    endpoint
  });
};
