const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ModelRelation extends BaseModel {
  static type = 'ModelRelation';

  /**
   * @type {string}
   */
  name = '';

  /**
   * @type {string}
   */
  type = '';

  /**
   * @type {string}
   */
  foreignKey = '';

  /**
   * @type {string}
   */
  model = '';

  constructor(id, name='', foreignKey='', type = '', model='') {
    super(id);
    this.name = name;
    this.type = type;
    this.foreignKey = foreignKey;
    this.model = model;
  }

  attach(model) {
    this._model = model;
  }

  static get idField() {
    return 'lunchbadgerId';
  }

  get workspaceId() {
    return `${this._model.workspaceId}.${this.name}`;
  }

  toJSON() {
    return {
      id: this.workspaceId,
      facetName: 'server',
      modelId: this._model.workspaceId,
      name: this.name,
      type: this.type,
      foreignKey: this.foreignKey,
      model: this.model,
      lunchbadgerId: this.id
    }
  }
}
