import PublicEndpoint from 'models/PublicEndpoint';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (data) => {
  const publicEndpoints = data.publicEndpoints;

  const publicEndpointObjects = publicEndpoints.map((publicEndpoint, index) => {
    return PublicEndpoint.create({
      itemOrder: index,
      ...publicEndpoint
    });
  });

  dispatch('InitializePublic', {
    data: publicEndpointObjects
  });
};
