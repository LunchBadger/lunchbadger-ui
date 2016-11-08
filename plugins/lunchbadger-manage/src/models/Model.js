import _ from 'lodash';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class Model extends BaseModel {
  static type = 'Model';
  _ports = [];
  _properties = [];
  _relations = [];
  contextPath = 'model';
  base = 'Model';
  plural = '';
  readonly = false;
  public = false;
  strict = false;

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
      strict: this.strict
    }
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
}
