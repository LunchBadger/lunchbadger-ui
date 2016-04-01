import { dispatch } from '../dispatcher/AppDispatcher';
import PublicEndpoint from '../models/PublicEndpoint';

export default () => {
  dispatch('AddPublicEndpoint', {
  	endpoint: PublicEndpoint.create({
  		name: 'Endpoint'
  	})
  });
};
