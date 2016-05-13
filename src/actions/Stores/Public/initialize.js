import API from 'models/API';

const PublicEndpoint = LunchBadgerManage.models.PublicEndpoint;
const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (data) => {
  const APIs = data.apis;

  const APIObjects = APIs.map((APIDetails, index) => {
    // remove public endpoints before de-serializing data but first save it somewhere
    const embeddedPublicEndpoints = APIDetails.publicEndpoints;
    delete APIDetails.publicEndpoints;

    const api = API.create({
      itemOrder: index,
      loaded: true,
      ...APIDetails
    });

    embeddedPublicEndpoints.forEach((endpoint) => {
      api.addEndpoint(PublicEndpoint.create(endpoint));
    });

    return api;
  });

  dispatch('InitializePublic', {
    data: APIObjects
  });
};
