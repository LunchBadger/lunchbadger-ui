import API from '../models/_API';
import Portal from '../models/_Portal';

export default [
  state => {
    const {entities} = state;
    const apis = Object.keys(entities.apis)
      .map(key => API.toJSON(entities.apis[key]));
    const portals = Object.keys(entities.portals)
      .map(key => Portal.toJSON(entities.portals[key]));
    return {
      apis,
      portals,
    };
  },
];
