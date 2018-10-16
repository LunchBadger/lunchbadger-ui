import DataSource from './DataSourceBaseModel';

export default class MongoDB extends DataSource {

  host = '';
  port = '';
  database = '';
  username = '';
  password = '';
  url = '';

  recreate() {
    return MongoDB.create(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...super.connectorProperties(this),
    };
  }

  validate(model) {
    return super.validateConnectionSettings(model, 'mongodb');
  }

}
