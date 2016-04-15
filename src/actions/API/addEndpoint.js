import {dispatch} from '../../dispatcher/AppDispatcher';

export default (api, name) => {
  dispatch('AddEndpoint', {
    api,
    name: name || 'Endpoint'
  });
};
