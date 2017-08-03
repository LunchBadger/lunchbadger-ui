const feedFlatModel = (json, data, prefix = '') => {
  Object.keys(json).forEach((key) => {
    const pfx = prefix ? `[${key}]` : key;
    if (Array.isArray(json[key])) {
      json[key].forEach((item, idx) => {
        feedFlatModel(item, data, `${prefix}${pfx}[${idx}]`);
      });
    } else if (typeof json[key] === 'object') {
      Object.keys(json[key]).forEach((idx) => {
        feedFlatModel(json[key], data, `${prefix}${pfx}`);
      });
    } else {
      data[`${prefix}${pfx}`] = json[key];
    }
  });
};

export default (model) => {
  const flatModel = {};
  feedFlatModel(model, flatModel);
  return flatModel;
};
