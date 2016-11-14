const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ModelProperty extends BaseModel {
  static type = 'ModelProperty';

  static deserializers = {
    'default': (obj, val) => {
      obj.default_ = val;
    }
  }

  /**
   * @type {string}
   */
  name = '';

  /**
   * @type {string}
   */
  default_ = '';

  /**
   * @type {string}
   */
  type = '';

  /**
   * @type {boolean}
   */
  required = false;

  /**
   * @type {boolean}
   */
  index = false;

  /**
   * @type {string}
   */
  description = '';

  modelWorkspaceId = '<unattached>';

  constructor(id, name = '', default_ = '', type = '', required = false, index = false, description = '') {
    super(id);

    this.name = name;
    this.default_ = default_;
    this.type = type;
    this.required = required;
    this.index = index;
    this.description = description;
  }

  static get idField() {
    return 'lunchbadgerId';
  }

  get workspaceId() {
    return `${this.modelWorkspaceId}.${this.name}`;
  }

  attach(model) {
    this.modelWorkspaceId = model.workspaceId;
  }

  toJSON() {
    return {
      id: this.workspaceId,
      modelId: this.modelWorkspaceId,
      facetName: 'server',
      name: this.name,
      'default': this.default_,
      type: this.type,
      required: this.required,
      index: this.index,
      description: this.description,
      lunchbadgerId: this.id
    }
  }
}
