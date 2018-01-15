export default [
  state => {
    const {entities} = state;
    const serviceEndpoints = Object.keys(entities.serviceEndpoints)
      .map(key => entities.serviceEndpoints[key].toJSON());
    const apiEndpoints = Object.keys(entities.apiEndpoints)
      .filter(key => entities.apiEndpoints[key].loaded)
      .map(key => entities.apiEndpoints[key].toJSON());
    const gateways = Object.values(entities.gateways)
      .filter(({deleting}) => !deleting)
      .map(entity => entity.toJSON(true));
    return {
      serviceEndpoints,
      apiEndpoints,
      gateways,
    };
  },
];
