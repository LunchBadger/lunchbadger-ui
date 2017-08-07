export default [
  state => {
    const {entities} = state;
    const privateEndpoints = Object.keys(entities.privateEndpoints)
      .map(key => entities.privateEndpoints[key].toJSON());
    const publicEndpoints = Object.keys(entities.publicEndpoints)
      .map(key => entities.publicEndpoints[key].toJSON());
    const gateways = Object.keys(entities.gateways)
      .map(key => entities.gateways[key].toJSON());
    return {
      privateEndpoints,
      publicEndpoints,
      gateways,
    };
  },
];
