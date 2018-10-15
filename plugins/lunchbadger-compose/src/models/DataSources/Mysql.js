import DataSource from './DataSourceBaseModel';
import schemas from '../../utils/dataSourceSchemas';
const {utils: {checkFields}} = LunchBadgerCore;

export default class Mysql extends DataSource {

  host = '';
  port = '';
  database = '';
  username = '';
  password = '';
  url = '';

  recreate() {
    return Mysql.create(this);
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
    return super.validateConnectionSettings(model, 'mysql');
  }

}
