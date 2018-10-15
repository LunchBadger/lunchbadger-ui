import DataSource from './DataSourceBaseModel';
import schemas from '../../utils/dataSourceSchemas';
const {utils: {checkFields}} = LunchBadgerCore;

export default class Redis extends DataSource {

  host = '';
  port = '';
  database = '';
  username = '';
  password = '';

  recreate() {
    return Redis.create(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...this.connectorProperties(),
    };
  }

  connectorProperties() {
    const generalProps = Object.keys(super.toJSON());
    const properties = {};
    Object.keys(this).forEach(key => {
      if (!this.hasOwnProperty(key)) return;
      if (this[key] === undefined) return;
      if (generalProps.includes(key)) return;
      if (this.constructor.forbiddenFields.includes(key)) return;
      properties[key] = this[key];
    });
    return properties;
  }

  validate(model) {
    return (_, getState) => {
      const validations = super.validate(model)(_, getState);
      const {required} = schemas.redis;
      checkFields(required, model, validations.data);
      if (model.port !== '') {
        if (isNaN(+model.port)) {
          validations.data.port = 'Port format is invalid';
        } else {
          model.port = Math.floor(+model.port);
          if (model.port < 0 || model.port >= 65536) {
            validations.data.port = 'Port should be >= 0 and < 65536';
          }
          model.port = model.port.toString();
        }
      }
      required.forEach((key) => {
        if (validations.data.hasOwnProperty(key)) {
          validations.data[`LunchBadger[${key}]`] = validations.data[key];
          delete validations.data[key];
        }
      });
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

}
