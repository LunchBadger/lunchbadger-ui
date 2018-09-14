import ProjectService from '../services/ProjectService';
import {actions} from '../reduxActions/actions';
import {createModelsFromJSON} from '../reduxActions/states';

export default [
  {
    request: ProjectService.load,
    callback: actions.onLoadProject,
    action: createModelsFromJSON,
    responses: responses => {
      const {
        // gateways,
        // serviceEndpoints,
        // apiEndpoints,
        // microServices: microservices,
        // apis,
        // portals,
      } = responses.body;
      const endpoints = {
        // gateways,
        // serviceEndpoints,
        // apiEndpoints,
        // microservices,
        // apis,
        // portals,
      };
      const data = Object.keys(endpoints)
        .reduce((map, key) => ({
          ...map,
          [key]: endpoints[key].reduce((arr, item) => ({
            ...arr,
            [item.id]: item
          }), {}),
        }), {});
      return data;
    },
  },
];
