import Gateway from '../models/Gateway';
import ServiceEndpoint from '../models/ServiceEndpoint';
import ApiEndpoint from '../models/ApiEndpoint';

export default [
  (responses) => {
    const gateways = responses[0].body.gateways
      .reduce((map, item) => {
        const entity = Gateway
          .create(item)
          .toJSON({isForServer: true});
          if (item.pipelinesLunchbadger) {
            entity.pipelines = item.pipelinesLunchbadger;
            entity.pipelinesLunchbadger = item.pipelinesLunchbadger;
          }
          return {
          ...map,
          [item.id]: entity,
        }
      }, {});
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
      gateways,
      serviceEndpoints,
      apiEndpoints,
    };
  }
];
