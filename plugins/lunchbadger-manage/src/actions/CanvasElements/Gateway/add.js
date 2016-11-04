import Gateway from '../../../models/Gateway';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddGateway', {
  	entity: Gateway.create({
  		name: name || 'Gateway'
  	})
  });
};
