import { dispatch } from '../../dispatcher/AppDispatcher';
import PublicEndpoint from '../../models/PublicEndpoint';

export default (name) => {
  dispatch('AddPublicEndpoint', {
  	endpoint: PublicEndpoint.create({
  		name: name || 'Public Endpoint'
  	})
  });
};
