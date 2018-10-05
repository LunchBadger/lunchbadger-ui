import {determineType} from './';

const parseRef = ref => ref.split('/').pop();

export default schema => {
  const defined = {};
  const data = {
    defs: {},
  };
  schema.forEach((item) => {
    defined[item.schema.$id] = item;
  });
  schema.forEach((item) => {
    item.name = parseRef(item.schema.$id).replace('.json', '');
    if (item.schema.allOf) {
      item.schema.allOf.forEach((allOf) => {
        if (allOf.$ref) {
          item.schema.properties = {
            ...item.schema.properties || {},
            ...defined[allOf.$ref].schema.properties || {},
          };
          item.schema.required = [
            ...item.schema.required || [],
            ...defined[allOf.$ref].schema.required || [],
          ];
        } else {
          item.schema.properties = {
            ...item.schema.properties || {},
            ...allOf.properties || {},
          };
          item.schema.required = [
            ...item.schema.required || [],
            ...allOf.required || [],
          ];
        }
      });
      delete item.schema.allOf;
    }
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
        properties[key].lbType = 'serviceEndpoint';
      }
      if (item.name === 'expression' && key === 'jscode') {
        properties[key].lbType = 'jscode';
      }
      if (properties[key].$ref) {
        if (properties[key].$ref === 'jwt.json') {
          properties[key] = data.policy.jwt;
        } else {
          properties[key].type = parseRef(properties[key].$ref);
        }
      }
      if (properties[key].enum && properties[key].enum.$ref) {
        properties[key].enum.$ref = parseRef(properties[key].enum.$ref);
      }
    });
  });
  Object.keys(data.policy).forEach((key) => {
    const policy = data.policy[key];
    policy.allowEmptyCAPairs = true;
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
      if (prop.hasOwnProperty('examples') && Array.isArray(prop.examples) && prop.examples.length > 0) {
        prop.example = prop.examples[0];
      }
      if (policy.required.includes(k) && !prop.hasOwnProperty('default')) {
        policy.allowEmptyCAPairs = false;
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
  Object.assign(data.model.users.properties, {
    id: {type: 'fake'},
    createdAt: {type: 'fake'},
    updatedAt: {type: 'fake'},
  });
  Object.assign(data.model.applications.properties, {
    createdAt: {type: 'fake'},
    updatedAt: {type: 'fake'},
  });
  return data;
};
