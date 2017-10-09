export default [
  state => {
    const {entities} = state;
    const microServices = Object.keys(entities.microservices)
      .map(key => entities.microservices[key].toJSON());
    // const functions = Object.keys(entities.functions)
    //   .map(key => entities.functions[key].toJSON());
    return {
      microServices,
      // functions,
    };
  },
];
