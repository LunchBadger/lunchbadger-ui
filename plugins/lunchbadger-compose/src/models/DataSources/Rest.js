import _ from 'lodash';
import DataSource from './DataSourceBaseModel';
import predefinedRests from '../../utils/predefinedRests';
const {utils: {messages}} = LunchBadgerCore;

export default class Rest extends DataSource {

  predefined = 'custom';
  operations = _.merge([], predefinedRests.custom.operations);
  baseURL = '';

  recreate() {
    return Rest.create(this);
  }

  toJSON() {
    const json = super.toJSON();
    const {
      baseURL,
      predefined,
      operations,
    } = this;
    if (baseURL) {
      Object.assign(json, {baseURL});
    } else {
      Object.assign(json, {
        predefined,
        operations,
      });
    }
    return json;
  }

  get zoomWindow() {
    return {
      width: 905,
      height: 750,
    }
  }

  set zoomWindow(_) {}

  validate(model) {
    return (_, getState) => {
      const validations = super.validate(model)(_, getState);
      const isRestTemplates = model.hasOwnProperty('operations');
      const isRestCrud = model.hasOwnProperty('baseURL');
      if (isRestTemplates && model.operations[0].template.url === '') {
        validations.data['baseUrl'] = messages.fieldCannotBeEmpty;
      }
      if (isRestCrud && model.baseURL === '') {
        validations.data['baseURL'] = messages.fieldCannotBeEmpty;
      }
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  processModel(model) {
    const data = super.processModel(model);
    if (data.hasOwnProperty('predefined')) {
      delete data.mode;
      data.baseURL = undefined;
      const options = data.options;
      if (!options.enabled) {
        data.options = undefined;
      } else {
        data.options = {};
        if (options.hasOwnProperty('strictSSL')) {
          data.options.strictSSL = options.strictSSL;
        }
        if (options.hasOwnProperty('useQuerystring')) {
          data.options.useQuerystring = options.useQuerystring;
        }
        if (options.headers.enabled) {
          data.options.headers = {};
          (options.headers.params || []).forEach(({key, value}) => {
            if (key.trim() !== '') {
              data.options.headers[key.trim()] = value;
            }
          });
        }
      }
      if (!data.operations) {
        data.operations = undefined;
      } else {
        data.operations.forEach((operation) => {
          if (!operation.template.options.enabled) {
            operation.template.options = undefined;
          } else {
            delete operation.template.options.enabled;
          }
          const headers = operation.template.headers || [];
          operation.template.headers = {};
          headers.forEach(({key, value}) => {
            if (key.trim() !== '') {
              operation.template.headers[key.trim()] = value;
            }
          });
          const query = operation.template.query || [];
          operation.template.query = {};
          query.forEach(({key, value}) => {
            if (key.trim() !== '') {
              operation.template.query[key.trim()] = value;
            }
          });
          const body = operation.template.body;
          delete operation.template.body;
          if (typeof body === 'object') {
            if (body.length === 0) {
              operation.template.body = '{body:object}';
            } else {
              operation.template.body = {};
              body.forEach(({key, value}) => {
                if (key.trim() !== '') {
                  operation.template.body[key.trim()] = value;
                }
              });
            }
          }
          const functions = operation.functions || [];
          operation.functions = {};
          functions.forEach(({key, value}) => {
            if (key.trim() !== '') {
              operation.functions[key.trim()] = value.split(',').map(i => i.trim()).filter(i => i !== '');
            }
          });
        });
      }
    }
    if (data.hasOwnProperty('baseURL')) {
      delete data.mode;
    }
    return data;
  }

}
