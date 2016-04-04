import { dispatch } from '../../dispatcher/AppDispatcher';
import PrivateEndpoint from '../../models/PrivateEndpoint';

export default () => {
  dispatch('AddPrivateEndpoint', {
  	endpoint: PrivateEndpoint.create({
  		name: 'Endpoint'
  	})
  });
};
