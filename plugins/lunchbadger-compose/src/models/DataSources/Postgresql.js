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
      ...this.connectorProperties(),
    };
  }

  get nodeModules() {
    return [
      ...super.nodeModules,
      'pg',
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
    return super.validateConnectionSettings(model, 'postgresql');
  }

}
