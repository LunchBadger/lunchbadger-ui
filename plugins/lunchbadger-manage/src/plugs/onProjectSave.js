const reduceIntoMap = (map, item) => {
  delete item.itemOrder;
  map[item.id] = item;
  return map;
};

export default [
  (state, opts) => {
    const options = Object.assign({
      isForServer: true,
      isForDiff: false,
    }, opts);
    const {entities} = state;
    let serviceEndpoints = Object.keys(entities.serviceEndpoints)
      .map(key => entities.serviceEndpoints[key].toJSON());
    let apiEndpoints = Object.keys(entities.apiEndpoints)
      .filter(key => entities.apiEndpoints[key].loaded)
      .map(key => entities.apiEndpoints[key].toJSON());
    let gateways = Object.values(entities.gateways)
      .filter(({deleting}) => !deleting)
      .map(entity => entity.toJSON(options));
    if (options.isForDiff) {
      serviceEndpoints = serviceEndpoints.reduce(reduceIntoMap, {});
      apiEndpoints = apiEndpoints.reduce(reduceIntoMap, {});
      gateways = gateways.reduce(reduceIntoMap, {});
    }
    return {
      serviceEndpoints,
      apiEndpoints,
      gateways,
    };
  },
];
