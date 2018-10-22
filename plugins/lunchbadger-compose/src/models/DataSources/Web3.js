import DataSource from './DataSourceBaseModel';
import schemas from '../../utils/dataSourceSchemas';
const {utils: {checkFields}} = LunchBadgerCore;

export default class Web3 extends DataSource {

  url = '';

  recreate() {
    return Web3.create(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...super.connectorProperties(this),
    };
  }

  validate(model) {
    return (_, getState) => {
      const validations = super.validate(model)(_, getState);
      const {required} = schemas.web3;
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
