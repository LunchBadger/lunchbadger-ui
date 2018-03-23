const clearEmptyObjectPlaceholders = (data) => {
  if (typeof data === 'object') {
    delete data[''];
    Object.keys(data).map(key => clearEmptyObjectPlaceholders(data[key]));
  }
  return data;
};

export default clearEmptyObjectPlaceholders;
