import { dispatch } from 'dispatcher/AppDispatcher';
import PublicEndpoint from 'models/PublicEndpoint';

export default (name, url) => {
  dispatch('AddPublicEndpoint', {
  	endpoint: PublicEndpoint.create({
  		name: name || 'Public Endpoint',
      url: url || 'https://root/endpoint'
  	})
  });
};
