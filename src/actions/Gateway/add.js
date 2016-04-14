import { dispatch } from '../../dispatcher/AppDispatcher';
import Gateway from '../../models/Gateway';

export default (name) => {
  dispatch('AddGateway', {
  	gateway: Gateway.create({
  		name: name || 'Gateway'
  	})
  });
};
