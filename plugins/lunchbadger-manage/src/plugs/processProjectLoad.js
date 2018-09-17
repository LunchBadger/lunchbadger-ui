// import Gateway from '../models/Gateway';
import ServiceEndpoint from '../models/ServiceEndpoint';
import ApiEndpoint from '../models/ApiEndpoint';

export default [
  (responses) => {
    const serviceEndpoints = responses[0].body.serviceEndpoints
      .reduce((map, item) => ({
        ...map,
        [item.id]: ServiceEndpoint
          .create(item)
          .toJSON({isForServer: true}),
      }), {});
    const apiEndpoints = responses[0].body.apiEndpoints
      .reduce((map, item) => ({
        ...map,
        [item.id]: ApiEndpoint
          .create(item)
          .toJSON({isForServer: true}),
      }), {});
    return {
      serviceEndpoints,
      apiEndpoints,
    };
  }
];
