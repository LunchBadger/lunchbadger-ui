import gatewaySchemasMock from '../gatewaySchemasMock';

const transformSchemas = schema => {
  const data = {};
  schema.forEach((item) => {
    if (!data[item.type]) {
      data[item.type] = item.type === 'condition' ? {} : [];
    }
    if (item.type === 'condition') {
      data[item.type][item.name] = item.schema;
    } else {
      data[item.type].push(item);
    }
  })
  return data;
}

export default (state = transformSchemas(gatewaySchemasMock), action) => {
  switch (action.type) {
    default:
      return state;
  }
};
