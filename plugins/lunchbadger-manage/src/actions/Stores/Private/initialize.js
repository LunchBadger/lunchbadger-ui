import PrivateEndpoint from 'models/PrivateEndpoint';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (data) => {
  const privateEndpoints = data.privateEndpoints;

  const privateEndpointObjects = privateEndpoints.map((privateEndpoint, index) => {
    return PrivateEndpoint.create({
      itemOrder: index,
      loaded: true,
      ...privateEndpoint
    });
  });

  dispatch('InitializePrivate', {
    data: privateEndpointObjects
  });
};
