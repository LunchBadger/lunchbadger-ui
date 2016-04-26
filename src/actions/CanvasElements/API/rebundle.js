import {dispatch} from 'dispatcher/AppDispatcher';

export default (fromAPI, toAPI, endpoint) => {
  dispatch('RebundleAPI', {
    fromAPI,
    toAPI,
    endpoint
  });
};
