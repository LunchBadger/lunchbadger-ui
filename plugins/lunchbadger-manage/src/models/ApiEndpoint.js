import _ from 'lodash';
import {update, remove} from '../reduxActions/apiEndpoints';

const {BaseModel, Port} = LunchBadgerCore.models;
const portGroups = LunchBadgerCore.constants.portGroups;
const {Connections} = LunchBadgerCore.stores;

export default class ApiEndpoint extends BaseModel {
  static type = 'ApiEndpoint';
  static entities = 'apiEndpoints';

  _ports = [];
  wasBundled = false;
  host = '*';
  paths = [];
  methods = [];
  scopes = [];
  zoomWindow = {
    width: 470,
    height: 750,
  };

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
      methods: this.deserializeMethods(data.methods),
      scopes: this.deserializeScopes(data.scopes),
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
    if (this.methods.length > 0) {
      json.methods = this.methods;
    }
    if (this.scopes.length > 0) {
      json.scopes = this.scopes;
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
    if (this.methods.length > 0) {
      json.methods = this.methods;
    }
    if (this.scopes.length > 0) {
      json.scopes = this.scopes;
    }
    return json;
  }

  static deserializePaths(paths) {
    if (typeof paths === 'undefined') return [];
    if (typeof paths === 'string') return [paths];
    return paths;
  }

  static deserializeMethods(methods) {
    if (typeof methods === 'undefined') return [];
    if (typeof methods === 'string') return [methods];
    return methods;
  }

  static deserializeScopes(scopes) {
    if (typeof scopes === 'undefined') return [];
    if (typeof methods === 'string') return [scopes];
    return scopes;
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }

  get apiEndpoints() {
    return [this];
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const {apiEndpoints, apis, portals} = getState().entities;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        let names = Object.values(apiEndpoints)
          .reduce((map, {id, name}) => [...map, {id, name}], []);
        if (apis) {
          names = Object.values(apis)
            .reduce((map, {apiEndpointsNames}) => [...map, ...apiEndpointsNames], names);
        }
        if (portals) {
          names = Object.values(portals)
            .reduce((map, {apiEndpointsNames}) => [...map, ...apiEndpointsNames], names);
        }
        const isDuplicateName = names
          .filter(({id}) => id !== this.id)
          .filter(({name}) => name.toLowerCase() === model.name.toLowerCase())
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

  beforeRemove(paper) {
    const connectionsTo = Connections.search({toId: this.id});
    connectionsTo.map((conn) => {
      conn.info.source.classList.add('discardAutoSave');
      paper.detach(conn.info.connection);
    });
  }

  processModel(model) {
    const data = _.cloneDeep(model);
    data.paths = [];
    (model.paths || []).forEach((path) => {
      if (path.trim() === '') return;
      data.paths.push(path.trim());
    });
    data.methods = [];
    (model.methods || []).forEach((method) => {
      if (method.trim() === '') return;
      data.methods.push(method.trim());
    });
    data.scopes = [];
    (model.scopes || []).forEach((scope) => {
      if (scope.trim() === '') return;
      data.scopes.push(scope.trim());
    });
    return data;
  }

}
