import _ from 'lodash';
import DataSource from './DataSourceBaseModel';
const {utils: {checkFields}} = LunchBadgerCore;

export default class Soap extends DataSource {

  url = '';
  wsdl = '';
  wsdl_options = {
    rejectUnauthorized: false,
    strictSSL: false,
    requestCert: false,
  };
  remotingEnabled: false;
  security = {
    scheme: 'WS',
    username: '',
    password: '',
    passwordType: 'PasswordText',
    keyPath: '',
    certPath: '',
  };
  soapOperations = {};
  soapHeaders = [];

  static create(data) {
    const obj = {...data};
    obj.soapOperations = obj.soapOperations || obj.operations || {};
    delete obj.operations;
    return super.create(obj);
  }

  recreate() {
    return Soap.create(this);
  }

  toJSON() {
    const json = super.toJSON();
    const {
      url,
      wsdl,
      wsdl_options,
      remotingEnabled,
      security,
      operations,
      soapHeaders,
    } = this;
    Object.assign(json, {
      url,
      wsdl,
      wsdl_options,
      remotingEnabled,
      security,
      operations,
      soapHeaders,
    });
    return json;
  }

  get nodeModules() {
    return [
      ...super.nodeModules,
      'strong-soap',
    ];
  }

  get zoomWindow() {
    return {
      width: 1085,
      height: 750,
    }
  }

  set zoomWindow(_) {}

  validate(model) {
    return (_, getState) => {
      const validations = super.validate(model)(_, getState);
      const required = ['url'];
      checkFields(required, model, validations.data);
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  processModel(model) {
    const data = super.processModel(model);
    if (data.hasOwnProperty('wsdl')) {
      data.soapOperations = {};
      (model.soapOperations || []).forEach(({key, service, port, operation}) => {
        if (key.trim() !== '') {
          data.soapOperations[key] = {service, port, operation};
        }
      });
      data.soapHeaders = [];
      (model.soapHeaders || []).forEach(({elementKey, elementValue, prefix, namespace}) => {
        if (elementKey.trim() !== '') {
          data.soapHeaders.push({
            element: {
              [elementKey]: elementValue,
            },
            prefix,
            namespace,
          });
        }
      });
    }
    return data;
  }

}
