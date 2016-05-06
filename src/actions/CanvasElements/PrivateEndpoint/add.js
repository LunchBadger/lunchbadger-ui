import PrivateEndpoint from 'models/PrivateEndpoint';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddPrivateEndpoint', {
  	endpoint: PrivateEndpoint.create({
  		name: name || 'Private Endpoint'
  	})
  });
};
