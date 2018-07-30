export default [
  (state, opts) => {
    const options = Object.assign({
      isForDiff: false,
    }, opts);
    const {isForDiff} = options;
    if (isForDiff) return {};
    const {entities} = state;
    const apis = Object.keys(entities.apis)
      .map(key => entities.apis[key].toJSON());
    const portals = Object.keys(entities.portals)
      .map(key => entities.portals[key].toJSON());
    return {
      apis,
      portals,
    };
  },
];
