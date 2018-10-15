import _ from 'lodash';
import schemas from '../../utils/dataSourceSchemas';
import {update, remove} from '../../reduxActions/dataSources';

const {
  models: {BaseModel, Port},
  constants: {portGroups},
  stores: {Connections},
  utils: {messages, checkFields},
} = LunchBadgerCore;

export default class DataSource extends BaseModel {
  static type = 'DataSource';
  static entities = 'dataSources';
  static forbiddenFields = [
    '_id',
    '_ready',
    'left',
    'top',
    'ports',
    'loaded',
    'slugifyName',
    '_locked',
    'configFile',
  ];

  ports = [];
  connector = '';

  constructor(id, name, connector) {
    super(id);
    this.name = name;
    this.connector = connector;
    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PRIVATE,
        portType: 'out'
      })
    ];
  }

  static get idField() {
    return 'lunchbadgerId';
  }

  toJSON() {
    const json = {
      id: this.workspaceId,
      facetName: 'server',
      name: this.name,
      connector: this.connector,
      itemOrder: this.itemOrder,
      lunchbadgerId: this.id,
      error: this.error,
    };
    return json;
  }

  get status() {
    if (this.deleting) return 'deleting';
    return '';
  }

  get isZoomDisabled() {
    return false;
  }

  get workspaceId() {
    return `server.${this.name}`;
  }

  get nodeModules() {
    return [this.connector];
  }

  get zoomWindow() {
    return {
      width: 470,
      height: 630,
    }
  }

  set zoomWindow(_) {}

  get gaType() {
    return `${this.constructor.type}[${this.connector}]`;
  }

  connectorProperties() {
    return {};
  }

  validate(model) {
    return this.validateName(model);
  }

  validateName(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.dataSources;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Model Connector');
        }
      }
      checkFields(['name'], model, validations.data);
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  validateConnectionSettings(model, connector) {
    return (_, getState) => {
      const validations = this.validateName(model)(_, getState);
      const isUrl = model.url !== '';
      const required = isUrl ? ['url'] : schemas[connector].required;
      checkFields(required, model, validations.data);
      if (isUrl) {
        // TODO: possibility to valid connection url here
      } else {
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

  update(model) {
    return async dispatch => await dispatch(update(this, model));
  }

  remove() {
    return async dispatch => await dispatch(remove(this));
  }

  beforeRemove(paper) {
    const connectionsFrom = Connections.search({fromId: this.id});
    connectionsFrom.map((conn) => {
      conn.info.source.classList.add('discardAutoSave');
      paper.detach(conn.info.connection);
    });
  }

  processModel(model) {
    const data = _.merge({}, model);
    if (data.hasOwnProperty('LunchBadger')) {
      Object.assign(data, data.LunchBadger);
      delete data.LunchBadger;
    }
    delete data.tmp;
    return data;
  }

}
