import {determineType, getDefaultValueByType} from './';

export default schema => {
  const data = {
    defs: {},
  };
  schema.forEach((item) => {
    item.name = item.schema.$id.split('/').pop().replace('.json', '');
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
      if (item.name === 'proxy' && key === 'serviceEndpoint') {
        properties[key].type = 'serviceEndpoint';
      }
      if (item.name === 'expression' && key === 'jscode') {
        properties[key].type = 'jscode';
      }
      if (properties[key].$ref) {
        if (properties[key].$ref === 'jwt.json') {
          properties[key] = data.policy.jwt;
        } else {
          properties[key].type = properties[key].$ref.split('/').pop();
        }
      }
      if (properties[key].enum && properties[key].enum.$ref) {
        properties[key].enum.$ref = properties[key].enum.$ref.split('/').pop();
      }
    });
  });
  Object.keys(data.policy).forEach((key) => {
    const policy = data.policy[key];
    if (!policy.required) {
      policy.required = [];
    }
    Object.keys(policy.properties).forEach((k) => {
      const prop = policy.properties[k];
      if (prop.enum && prop.enum.$ref) {
        prop.enum = data.defs[prop.enum.$ref];
      }
      if (Array.isArray(prop.type)) {
        prop.types = [...prop.type];
        if (prop.hasOwnProperty('default')) {
          prop.type = determineType(prop.default);
        } else {
          prop.type = prop.types[0];
        }
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
      if (Array.isArray(prop.type)) {
        prop.types = [...prop.type];
        if (prop.hasOwnProperty('default')) {
          prop.type = determineType(prop.default);
        } else {
          prop.type = prop.types[0];
        }
      }
    });
  });
  return data;
};
