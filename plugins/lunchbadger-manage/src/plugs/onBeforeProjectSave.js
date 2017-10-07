export default [
  state => {
    const {entities} = state;
    const gateways = Object.keys(entities.gateways)
      .map(key => entities.gateways[key]);
    return gateways;
  },
];
