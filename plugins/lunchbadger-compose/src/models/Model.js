import _ from 'lodash';
import uuid from 'uuid';
import {update, remove} from '../reduxActions/models';
import addPropertiesToData from '../components/addPropertiesToData';
import ModelProperty from './ModelProperty';
import ModelRelation from './ModelRelation';
import Config from '../../../../src/config';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;
const {defaultEntityNames, coreActions} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export default class Model extends BaseModel {
  static type = 'Model';
  static entities = 'models';
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
    'elementDOM',
    'slugifyName',
    'zoomWindow',
  ];

  _ports = [];
  _properties = [];
  _relations = [];
  contextPath = defaultEntityNames.Model.toLowerCase();
  base = 'PersistedModel';
  plural = '';
  readonly = false;
  public = true;
  strict = false;
  wasBundled = false;
  zoomWindow = {
    width: 1090,
    height: 750,
  };

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

  static create(data) {
    const properties = data.properties || [];
    const relations = data.relations || [];
    delete data.properties;
    delete data.relations;
    const model = super.create(data);
    properties.forEach(property => model.addProperty(ModelProperty.create(property)));
    relations.forEach(relation => model.addRelation(ModelRelation.create(relation)));
    return model;
  }

  recreate() {
    return Model.create(this);
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
      properties: this.properties.map(property => property.toJSON()),
      relations: this.relations.map(relation => relation.toJSON()),
      itemOrder: this.itemOrder,
      base: this.base,
      plural: this.plural,
      readonly: this.readonly,
      public: this.public,
      strict: this.strict,
      lunchbadgerId: this.id,
      wasBundled: this.wasBundled,
      ...this.userFields
    }
  }

  toApiJSON() {
    return {
      friendlyName: this.name,
      url: Config.get('customerUrl'),
    };
  }

  get status() {
    if (this.deleting) return 'deleting';
    return '';
  }

  get workspaceId() {
    return `server.${this.name}`;
  }

  /**
   * @param properties {Properties[]}
   */
  set properties(properties) {
    this._properties = properties;
  }

  /**
   * @returns {Properties[]}
   */
  get properties() {
    return this._properties;
  }

  /**
   * @param property {Property}
   */
  addProperty(property) {
    this._properties.push(property);
    property.attach(this);
  }

  /**
   * @param property {Property}
   */
  removeProperty(property) {
    _.remove(this._properties, function (prop) {
      return prop.id === property.id
    });
  }

  /**
   * @param relations {Relations[]}
   */
  set relations(relations) {
    this._relations = relations;
  }

  /**
   * @returns {Relations[]}
   */
  get relations() {
    return this._relations;
  }

  /**
   * @param relation {Relation}
   */
  addRelation(relation) {
    this._relations.push(relation);
    relation.attach(this);
  }

  /**
   * @param relation {Relation}
   */
  removeRelation(relation) {
    _.remove(this._relations, {id: relation.id});
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }

  get userFields() {
    const fields = {};
    this._getUserFieldsKeys().forEach(key => fields[key] = this[key]);
    return fields;
  }

  get extendedUserFields() {
    return this._getUserFieldsKeys().map(key => {
      return {
        id: uuid.v4(),
        name: key,
        type: Model._assumeUserFieldType(this[key]),
        value: this[key]
      };
    });
  }

  _getUserFieldsKeys() {
    return _.difference(Object.keys(this), Model.forbiddenFields);
  }

  static _assumeUserFieldType(value) {
    if (_.isObject(value)) {
      return 'object';
    } else if (_.isNumber(value)) {
      return 'number';
    }

    return 'string';
  }

  get modelJsName() {
    return this.configFile.split('/').pop().replace(/\.json$/,'') + '.js';
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const {models, modelsBundled} = getState().entities;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateModelName = Object.keys(models)
          .filter(id => id !== this.id)
          .filter(id => models[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        const isDuplicateModelBundledName = Object.keys(modelsBundled)
          .filter(id => id !== this.id)
          .filter(id => modelsBundled[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateModelName || isDuplicateModelBundledName) {
          validations.data.name = messages.duplicatedEntityName('Model');
        }
      }
      const fields = ['name'];
      checkFields(fields, model, validations.data);
      if (model.name.toLowerCase() === 'model') validations.data.name = 'Model name cannot be "Model"';
      if ((/\s/g).test(model.name)) validations.data.name = 'Model name cannot have spaces';
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

  remove(cb) {
    return async dispatch => await dispatch(remove(this, cb));
  }

  beforeRemove(paper) {
    const connectionsTo = Connections.search({toId: this.id});
    connectionsTo.map((conn) => {
      conn.info.connection.setParameter('discardAutoSave', true);
      paper.detach(conn.info.connection);
    });
    const connectionsFrom = Connections.search({fromId: this.id});
    let isAutoSave = false;
    connectionsFrom.map((conn) => {
      isAutoSave = true;
      conn.info.connection.setParameter('discardAutoSave', true);
      paper.detach(conn.info.connection);
    });
    if (isAutoSave) {
      return coreActions.saveToServer;
    }
  }

  processModel(model, properties) {
    const data = {
      properties: [],
    };
    addPropertiesToData(model, this, data.properties, properties);
    if (model.relations) {
      data.relations = [];
      model.relations.forEach((item) => {
        const relation = ModelRelation.create(item);
        relation.attach(this);
        data.relations.push(relation);
      });
    }
    if (model.userFields) {
      model.userFields.forEach(field => {
        const value = field.value;
        let output = value;
        if (field.type === 'object') {
          output = JSON.parse(value);
        } else if (field.type === 'number') {
          output = Number(value);
        }
        data[field.name] = output;
      });
    } else {
      model.userFields = [];
    }
    const propsToRemove = _.difference(
      Object.keys(this.userFields),
      model.userFields.map(field => field.name),
    );
    propsToRemove.forEach(prop => delete this[prop]);
    delete model.dataSource;
    delete model.userFields;
    return _.merge({}, model, data);
  }

}
