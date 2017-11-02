import uuid from 'uuid';

const getDefaultValueByType = type => ({
  string: '',
  boolean: false,
  integer: 0,
  array: [],
})[type];

export default (properties = {}) => {
  const data = {
    id: uuid.v4(),
  };
  Object.keys(properties).forEach((key) => {
    const {type} = properties[key];
    data[key] = getDefaultValueByType(Array.isArray(type) ? type[0] : type);
  });
  return data;
};
