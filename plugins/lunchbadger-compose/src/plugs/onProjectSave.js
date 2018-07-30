export default [
  (state, opts) => {
    const options = Object.assign({
      isForDiff: false,
    }, opts);
    const {isForDiff} = options;
    const {entities, plugins: {quadrants}} = state;
    const data = {};
    if (isForDiff) {
      const models = quadrants[1].modelEntities
        .map((type) => ({type, ids: Object.keys(entities[type])}))
        .map(({type, ids}) => ids.map(id => state.entities[type][id].models))
        .reduce((arr, item) => arr.concat(...item), [])
        .filter(item => item.loaded)
        .reduce((map, item) => {
          map[item.id] = {
            ...item.toJSON(),
            itemOrder: undefined,
          };
          return map;
        }, {});
      const functions = Object.values(entities.functions).reduce((map, item) => {
        if (!item.deleting) {
          map[item.id] = {
            ...item.toJSON(),
            itemOrder: undefined,
          };
        }
        return map;
      }, {});
      Object.assign(data, {
        models,
        functions,
      });
    } else {
      const microServices = Object.keys(entities.microservices)
        .map(key => entities.microservices[key].toJSON());
      Object.assign(data, {
        microServices,
      });
    }
    return data;
  },
];
