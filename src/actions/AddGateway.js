import { dispatch } from '../dispatcher/AppDispatcher';
import Gateway from '../models/Gateway';

export default () => {
  dispatch('AddGateway', {
  	gateway: Gateway.create({
  		name: 'Gateway'
  	})
  });
};
