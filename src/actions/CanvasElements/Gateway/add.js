import Gateway from 'models/Gateway';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddGateway', {
  	gateway: Gateway.create({
  		name: name || 'Gateway'
  	})
  });
};
