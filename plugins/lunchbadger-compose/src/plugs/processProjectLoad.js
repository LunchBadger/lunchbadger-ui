import uuid from 'uuid';
import DataSource from '../models/DataSource';
import Model from '../models/Model';
import Function_ from '../models/Function';
import Microservice from '../models/Microservice';

export default [
  (responses) => {
    const dataSources = responses[1][0].body
      .reduce((map, item) => {
        const entity = DataSource
          .create(item)
          .toJSON({isForServer: true});
        delete entity.error;
        Object.keys(entity).forEach((prop) => {
          if (entity[prop] === undefined) {
            delete entity[prop];
          }
        });
        return {
          ...map,
          [item.id]: entity,
        }
      }, {});
    const models = responses[1][1].body
      .filter(({wasBundled}) => !wasBundled)
      .reduce((map, item) => ({
        ...map,
        [item.lunchbadgerId]: Model
          .create(item)
          .toJSON({isForServer: true}),
      }), {});
    const modelsBundled = responses[1][1].body
      .filter(({wasBundled}) => wasBundled)
      .reduce((map, item) => ({
        ...map,
        [item.lunchbadgerId]: Model
          .create(item)
          .toJSON({isForServer: true}),
      }), {});
    const functions = responses[1][3].body
      .reduce((map, service) => {
        if (!service.serverless || Object.keys(service.serverless).length === 0) return map;
        const {
          service: name,
          lunchbadger: {id, itemOrder} = {id: uuid.v4(), itemOrder: 0},
        } = service.serverless;
        map[id] = Function_
          .create({id, name, itemOrder, service})
          .toJSON({isForServer: true});
        return map;
      }, {});
    const microservices = responses[0].body.microServices
      .reduce((map, item) => ({
        ...map,
        [item.id]: Microservice
          .create(item)
          .toJSON({isForServer: true}),
      }), {});
    return {
      dataSources,
      models,
      modelsBundled,
      functions,
      microservices,
    };
  }
];
