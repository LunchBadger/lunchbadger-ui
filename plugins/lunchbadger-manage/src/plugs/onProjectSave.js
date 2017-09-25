export default [
  state => {
    const {entities} = state;
    const serviceEndpoints = Object.keys(entities.serviceEndpoints)
      .map(key => entities.serviceEndpoints[key].toJSON());
    const publicEndpoints = Object.keys(entities.publicEndpoints)
      .map(key => entities.publicEndpoints[key].toJSON());
    const gateways = Object.keys(entities.gateways)
      .map(key => entities.gateways[key].toJSON());
    return {
      serviceEndpoints,
      publicEndpoints,
      gateways,
    };
  },
];
