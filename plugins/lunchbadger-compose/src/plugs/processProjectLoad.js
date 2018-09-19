import uuid from 'uuid';
import DataSource from '../models/DataSource';
import Model from '../models/Model';
import Function_ from '../models/Function';

export default [
  (responses) => {
    const dataSources = responses[1][0].body
      .reduce((map, item) => {
        const entity = DataSource
          .create(item)
          .toJSON({isForServer: true});
        delete entity.error;
        return {
          ...map,
          [item.lunchbadgerId]: entity,
        }
      }, {});
    const models = responses[1][1].body
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
    return {
      dataSources,
      models,
      functions,
    };
  }
];
