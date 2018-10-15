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
    return super.validateConnectionSettings(model, 'mongodb');
  }

}
