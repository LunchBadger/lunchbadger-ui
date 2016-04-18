import {dispatch} from '../../dispatcher/AppDispatcher';

export default (api, endpoint) => {
  dispatch('RemoveEndpoint', {
    api,
    endpoint
  });
};
