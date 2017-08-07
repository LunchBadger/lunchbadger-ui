export default [
  state => {
    const {entities} = state;
    const microServices = Object.keys(entities.microservices)
      .map(key => entities.microservices[key].toJSON());
    return {
      microServices,
    };
  },
];
