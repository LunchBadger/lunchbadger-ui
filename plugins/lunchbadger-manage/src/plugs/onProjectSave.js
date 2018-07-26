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
    const {isForDiff} = options;
    const {entities} = state;
    let serviceEndpoints = Object.keys(entities.serviceEndpoints)
      .map(key => entities.serviceEndpoints[key].toJSON());
    let apiEndpoints = Object.keys(entities.apiEndpoints)
      .filter(key => entities.apiEndpoints[key].loaded)
      .map(key => entities.apiEndpoints[key].toJSON());
    let gateways = Object.values(entities.gateways)
      .filter(({deleting}) => !deleting)
      .map(entity => entity.toJSON(options));
    if (isForDiff) {
      const {plugins: {quadrants}} = state;
      apiEndpoints = quadrants[3].connectionEntities
        .map(type => ({type, ids: Object.keys(entities[type])}))
        .map(({type, ids}) => ids.map(id => state.entities[type][id].apiEndpoints))
        .reduce((arr, item) => arr.concat(...item), [])
        .filter(item => item.loaded)
        .map(item => item.toJSON());
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
