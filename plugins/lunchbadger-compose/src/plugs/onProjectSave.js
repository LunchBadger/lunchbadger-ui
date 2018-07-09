export default [
  (state, opts) => {
    const options = Object.assign({
      isForDiff: false,
    }, opts);
    const {isForDiff} = options;
    const {entities} = state;
    const microServices = Object.keys(entities.microservices)
      .map(key => entities.microservices[key].toJSON());
    const data = {
      microServices,
    };
    if (isForDiff) {
      const models = Object.values(entities.models).reduce((map, item) => {
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
    }
    return data;
  },
];
