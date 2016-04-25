import { dispatch } from 'dispatcher/AppDispatcher';

export default (api, endpoint) => {
  dispatch('UnbundleAPI', {
    api,
    endpoint
  });
};
