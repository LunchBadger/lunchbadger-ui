import { dispatch } from '../dispatcher/AppDispatcher';

export default () => {
  dispatch('AddPrivateEndpoint', {
  	endpoint: {
  		name: 'Endpoint 1'
  	}
  });
};