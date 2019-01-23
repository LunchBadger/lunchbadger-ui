import DataSource from './DataSourceBaseModel';
import schemas from '../../utils/dataSourceSchemas';
const {utils: {checkFields}} = LunchBadgerCore;

export const STORAGE_NPM_MODULE = 'loopback-component-storage';

export default class Storage extends DataSource {

  recreate() {
    return Storage.create(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...super.connectorProperties(this),
      connector: STORAGE_NPM_MODULE,
    };
  }

  get nodeModules() {
    return [
      ...super.nodeModules,
    ];
  }

  get errorMatchKeywords() {
    return [STORAGE_NPM_MODULE];
  }

  validate(model) {
    return (_, getState) => {
      const validations = super.validate(model)(_, getState);
      const {required} = schemas.salesforce;
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
