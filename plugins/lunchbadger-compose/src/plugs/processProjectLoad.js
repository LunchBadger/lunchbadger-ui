import DataSource from '../models/DataSource';
import Model from '../models/Model';

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
    return {
      dataSources,
      models,
    };
  }
];
