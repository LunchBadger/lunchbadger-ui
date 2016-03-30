import { dispatch } from '../dispatcher/AppDispatcher';

export default () => {
  dispatch('AddPublicEndpoint', {
  	endpoint: {
  		name: 'Endpoint'
  	}
  });
};