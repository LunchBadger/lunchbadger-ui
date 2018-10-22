import DataSource from './DataSourceBaseModel';
import schemas from '../../utils/dataSourceSchemas';
const {utils: {checkFields}} = LunchBadgerCore;

export default class Redis extends DataSource {

  host = '';
  port = '';
  database = '';
  username = '';
  password = '';
  url = '';

  recreate() {
    return Redis.create(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...super.connectorProperties(this),
    };
  }

  validate(model) {
    return super.validateConnectionSettings(model, 'redis');
  }

}
