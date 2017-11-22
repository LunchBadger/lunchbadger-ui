import gatewaySchemasMock from '../gatewaySchemasMock';

const transformSchemas = schema => {
  const data = {
    defs: {},
  };
  schema.forEach((item) => {
    if (!data[item.type]) {
      data[item.type] = {};
    }
    data[item.type][item.name] = item.schema;
    if (item.type === 'core') {
      if (item.schema.definitions) {
        data.defs = item.schema.definitions;
      }
    } else if (!data[item.type][item.name].properties) {
      data[item.type][item.name].properties = {};
    }
    const {properties} = data[item.type][item.name];
    Object.keys(properties || {}).forEach((key) => {
      if (properties[key].$ref) {
        properties[key].type = properties[key].$ref.split('/').pop();
      }
      if (properties[key].enum && properties[key].enum.$ref) {
        properties[key].enum.$ref = properties[key].enum.$ref.split('/').pop();
      }
    });
  });
  Object.keys(data.policy).forEach((key) => {
    const policy = data.policy[key];
    Object.keys(policy.properties).forEach((k) => {
      const prop = policy.properties[k];
      if (prop.enum && prop.enum.$ref) {
        prop.enum = data.defs[prop.enum.$ref];
      }
    });
  });
  Object.keys(data.condition).forEach((key) => {
    const condition = data.condition[key];
    Object.keys(condition.properties).forEach((k) => {
      const prop = condition.properties[k];
      if (prop.enum && prop.enum.$ref) {
        prop.enum = data.defs[prop.enum.$ref];
      }
    });
  });
  return data;
};

export default (state = transformSchemas(gatewaySchemasMock), action) => {
  switch (action.type) {
    default:
      return state;
  }
};
