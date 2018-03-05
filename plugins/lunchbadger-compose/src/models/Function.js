import _ from 'lodash';
import {update, remove} from '../reduxActions/functions';
import Config from '../../../../src/config';
import runtimeOptions from '../utils/runtimeOptions';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class Function_ extends BaseModel {
  static type = 'Function_';
  static entities = 'functions';
  static forbiddenFields = [
    '_id',
    '_ready',
    'left',
    'top',
    'itemOrder',
    '_ports',
    '_properties',
    '_relations',
    'contextPath',
    'base',
    'plural',
    'readonly',
    'readOnly',
    'public',
    'strict',
    'wasBundled',
    'name',
    'loaded',
    'facetName',
    'idInjection',
    'options',
    'configFile',
    'lunchbadgerId',
    'elementDOM'
  ];

  _ports = [];
  _properties = [];
  _relations = [];
  contextPath = 'myfunction';
  base = 'PersistedModel';
  plural = '';
  readonly = false;
  public = true;
  strict = false;
  wasBundled = false;
  runtime = runtimeOptions[0];
  slugifyName = true;
  service = null;

  static deserializers = {
    http: (obj, val) => {
      if (val.path) {
        obj.contextPath = val.path;
      }
    }
  };

  constructor(id, name) {
    super(id);
    this.name = name;
    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PRIVATE,
        portType: 'in'
      }),
      Port.create({
        id: this.id,
        portGroup: portGroups.GATEWAYS,
        portType: 'out'
      })
    ];
  }

  recreate() {
    return Function_.create(this);
  }

  static get idField() {
    // The loopback-workspace API ties the name of an entity to its ID. This
    // means that renaming a Model would change its ID. So we store the actual
    // Lunchbadger ID in a separate variable to allow for stable connections
    // to items outside the workspace API.
    return 'lunchbadgerId';
  }

  toJSON() {
    return {
      id: this.workspaceId,
      facetName: 'server',
      name: this.name,
      http: {
        path: this.contextPath
      },
      properties: [],
      relations: [],
      itemOrder: this.itemOrder,
      base: this.base,
      plural: this.plural,
      readonly: this.readonly,
      public: this.public,
      strict: this.strict,
      lunchbadgerId: this.id,
      wasBundled: this.wasBundled,
      runtime: this.runtime,
      kind: 'function',
    }
  }

  toApiJSON() {
    return {
      friendlyName: this.name,
      url: Config.get('slsUrl').replace('{FN}', this.name),
    };
  }

  get workspaceId() {
    return `server.${this.name}`;
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
      const {functions, slsService, models, modelsBundled} = getState().entities;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateFunctionName = Object.keys(functions)
          .filter(id => id !== this.id)
          .filter(id => functions[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        const isDuplicateSlsServiceName = slsService
          .filter(name => name !== this.name)
          .includes(model.name);
        const isDuplicateModelName = Object.keys(models)
          .filter(id => id !== this.id)
          .filter(id => models[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        const isDuplicateModelBundledName = Object.keys(modelsBundled)
          .filter(id => id !== this.id)
          .filter(id => modelsBundled[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateFunctionName || isDuplicateSlsServiceName) {
          validations.data.name = messages.duplicatedEntityName('Function');
        }
        if (isDuplicateModelName || isDuplicateModelBundledName) {
          validations.data.name = messages.duplicatedEntityName('Model');
        }
      }
      const fields = ['name'];
      checkFields(fields, model, validations.data);
      if (model.name.toLowerCase() === 'model') validations.data.name = `Function name cannot be "${model.name}"`;
      if (model.http.path === '') {
        validations.data.contextPath = messages.fieldCannotBeEmpty;
      }
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
    data.service = Object.assign({}, this.service);
    if (data.hasOwnProperty('files')) {
      data.service.files = {};
      Object.keys(data.files || {}).forEach((key) => {
        data.service.files[key.replace(/\*/g, '.')] = data.files[key];
      });
      delete data.files;
    }
    return data;
  }

}
