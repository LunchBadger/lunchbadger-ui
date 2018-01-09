export default [
  state => {
    const {entities} = state;
    const gateways = Object.values(entities.gateways)
      .filter(({deleting}) => !deleting);
    return gateways;
  },
];
