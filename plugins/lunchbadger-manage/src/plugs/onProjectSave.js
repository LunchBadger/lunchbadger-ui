export default [
  state => {
    const {entities} = state;
    const serviceEndpoints = Object.keys(entities.serviceEndpoints)
      .map(key => entities.serviceEndpoints[key].toJSON());
    const apiEndpoints = Object.keys(entities.apiEndpoints)
      .filter(key => entities.apiEndpoints[key].loaded)
      .map(key => entities.apiEndpoints[key].toJSON());
    const gateways = Object.keys(entities.gateways)
      .map(key => entities.gateways[key].toJSON());
    return {
      serviceEndpoints,
      apiEndpoints,
      gateways,
    };
  },
];
