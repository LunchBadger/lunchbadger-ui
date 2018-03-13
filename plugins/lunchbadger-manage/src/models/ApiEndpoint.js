import _ from 'lodash';
import {update, remove} from '../reduxActions/apiEndpoints';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class ApiEndpoint extends BaseModel {
  static type = 'ApiEndpoint';
  static entities = 'apiEndpoints';

  _ports = [];
  wasBundled = false;
  host = '*';
  paths = [];

  constructor(id, name) {
    super(id);
    this.name = name;
    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PUBLIC,
        portType: 'in'
      })
    ];
  }

  static create(data) {
    return super.create({
      ...data,
      paths: this.deserializePaths(data.paths),
    });
  }

  recreate() {
    return ApiEndpoint.create(this.toJSON());
  }

  toJSON() {
    const json = {
      id: this.id,
      name: this.name,
      host: this.host,
      itemOrder: this.itemOrder
    }
    if (this.paths.length > 0) {
      json.paths = this.paths;
    }
    return json;
  }

  toApiJSON() {
    const json = {
      friendlyName: this.name,
      host: this.host,
    };
    if (this.paths.length > 0) {
      json.paths = this.paths;
    }
    return json;
  }

  static deserializePaths(paths) {
    if (typeof paths === 'undefined') return [];
    if (typeof paths === 'string') return [paths];
    return paths;
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.apiEndpoints;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('API Endpoint');
        }
      }
      const fields = ['name', 'host'];
      checkFields(fields, model, validations.data);
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

  processModel(model) {
    const data = _.cloneDeep(model);
    data.paths = [];
    (model.paths || []).forEach((path) => {
      if (path.trim() === '') return;
      data.paths.push(path.trim());
    })
    return data;
  }

}
