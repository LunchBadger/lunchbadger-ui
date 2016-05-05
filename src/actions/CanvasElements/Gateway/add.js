import Gateway from 'models/Gateway';

const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddGateway', {
  	gateway: Gateway.create({
  		name: name || 'Gateway'
  	})
  });
};
