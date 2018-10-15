import DataSource from './DataSourceBaseModel';
import schemas from '../../utils/dataSourceSchemas';
const {utils: {checkFields}} = LunchBadgerCore;

export default class Postgresql extends DataSource {

  host = '';
  port = '';
  database = '';
  username = '';
  password = '';
  url = '';

  recreate() {
    return Postgresql.create(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...super.connectorProperties(this),
    };
  }

  get nodeModules() {
    return [
      ...super.nodeModules,
      'pg',
    ];
  }

  validate(model) {
    return super.validateConnectionSettings(model, 'postgresql');
  }

}
