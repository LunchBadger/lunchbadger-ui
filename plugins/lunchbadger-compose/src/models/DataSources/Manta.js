import DataSource from './DataSourceBaseModel';
import schemas from '../../utils/dataSourceSchemas';
const {utils: {checkFields}} = LunchBadgerCore;

export default class Manta extends DataSource {

  url = '';
  user = '';
  subuser = '';
  keyId = '';
  privateKeyPath = '/root/.triton_ssh/id_rsa';

  recreate() {
    return Manta.create(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...this.connectorProperties(),
    };
  }

  get nodeModules() {
    return [
      ...super.nodeModules,
      'loopback-connector-manta',
    ];
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
      const {required} = schemas.manta;
      checkFields(required, model, validations.data);
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
