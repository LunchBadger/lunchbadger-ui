import { dispatch } from '../../dispatcher/AppDispatcher';
import PrivateEndpoint from '../../models/PrivateEndpoint';

export default (name) => {
  dispatch('AddPrivateEndpoint', {
  	endpoint: PrivateEndpoint.create({
  		name: name || 'Private Endpoint'
  	})
  });
};
