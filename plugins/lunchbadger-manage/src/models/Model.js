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
  base = 'PersistedModel';
  plural = '';
  readonly = false;
  public = true;
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
      lunchbadgerId: this.id
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
