import PrivateEndpoint from 'models/PrivateEndpoint';

const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddPrivateEndpoint', {
  	endpoint: PrivateEndpoint.create({
  		name: name || 'Private Endpoint'
  	})
  });
};
