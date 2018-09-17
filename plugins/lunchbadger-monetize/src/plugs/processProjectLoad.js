import API from '../models/API';
import Portal from '../models/Portal';

export default [
  (responses) => {
    const apis = responses[0].body.apis
      .reduce((map, item) => {
        const entity = API
          .create(item)
          .toJSON({isForServer: true});
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
    const portals = responses[0].body.portals
      .reduce((map, item) => ({
        ...map,
        [item.id]: Portal
          .create(item)
          .toJSON({isForServer: true}),
      }), {});
    return {
      apis,
      portals,
    };
  }
];
