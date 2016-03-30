import { dispatch } from '../dispatcher/AppDispatcher';

export default () => {
  dispatch('AddGateway', {
  	gateway: {
  		name: 'Gateway'
  	}
  });
};