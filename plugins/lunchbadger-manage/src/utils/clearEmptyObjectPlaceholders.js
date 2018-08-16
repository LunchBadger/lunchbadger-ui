const clearEmptyObjectPlaceholders = (data) => {
  if (typeof data === 'object') {
    delete data[''];
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'undefined') {
        delete data[key];
      } else {
        clearEmptyObjectPlaceholders(data[key]);
      }
    });
  }
  return data;
};

export default clearEmptyObjectPlaceholders;
