import PublicEndpoint from 'models/PublicEndpoint';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name, url) => {
  dispatch('AddPublicEndpoint', {
  	endpoint: PublicEndpoint.create({
  		name: name || 'Public Endpoint',
      url: url || 'https://root/endpoint'
  	})
  });
};
