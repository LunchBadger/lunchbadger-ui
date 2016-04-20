import {dispatch} from '../../dispatcher/AppDispatcher';

export default (api, endpoint) => {
  dispatch('AddEndpoint', {
    api,
    endpoint
  });
};
