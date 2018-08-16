import Ajv from 'ajv';

const ajv = new Ajv({
  schemas: [],
  useDefaults: true,
  coerceTypes: true
});

const registeredKeys = [];

const processError = (error, schema) => {
  const path = error.dataPath.replace(/\.(\w*)/g, '[$1]');
  let message = error.message;
  if (error.keyword === 'enum') {
    message += `: ${error.params.allowedValues.join(', ')}`;
  } else if (error.keyword === 'oneOf') {
    // message += ' ' + JSON.stringify(_.get(schema.properties, path).oneOf); // TODO visualize better
  }
  return {
    path,
    message,
  };
};

const register = (schema) => {
  if (registeredKeys.findIndex(keys => keys.$id === schema.$id) === -1) {
    ajv.addSchema(schema, schema.$id);
    registeredKeys.push({$id: schema.$id});
  }
  return data => validate(schema.$id, data);
}

const validate = (id, data) => {
  const isValid = ajv.validate(id, data);
  const errors = ajv.errors;
  const processPolicyActionValidations = (validations, prefix) => errors.forEach((error) => {
    const {path, message} = processError(error, ajv.getSchema(id));
    validations.data[`${prefix}[action]${path}`] = message;
  });
  return {
    isValid,
    errors,
    processPolicyActionValidations,
  }
};

module.exports = {
  register,
  validate
};
