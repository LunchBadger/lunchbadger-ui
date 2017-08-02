import Microservice from '../models/_microService';

export default [
  state => {
    const {entities} = state;
    const microServices = Object.keys(entities.microservices)
      .map(key => Microservice.toJSON(entities.microservices[key]));
    return {
      microServices,
    };
  },
];
