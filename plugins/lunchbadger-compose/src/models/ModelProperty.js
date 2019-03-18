const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ModelProperty extends BaseModel {
  static type = 'ModelProperty';

  static deserializers = {
    'default': (obj, val) => {
      obj.default_ = val;
      obj.withDefault = val !== undefined;
    },
    format: (obj, val) => {
      obj.format = val;
      obj.withFormat = val !== undefined;
    },
  }

  name = '';
  default_ = undefined;
  withDefault = false;
  type = '';
  format = undefined;
  required = false;
  index = false;
  description = '';
  modelWorkspaceId = '<unattached>';
  itemOrder = 0;

  constructor(id, name = '', default_, type = '', format, required = false, index = false, description = '') {
    super(id);
    this.name = name;
    this.default_ = default_;
    this.type = type;
    this.format = format;
    this.required = required;
    this.index = index;
    this.description = description;
  }

  static get idField() {
    return 'lunchbadgerId';
  }

  get workspaceId() {
    return `${this._model.workspaceId}.${this.name}`;
  }

  attach(model) {
    this._model = model;
  }

  toJSON() {
    let type = this.type;
    if (typeof type === 'object') {
      if (Array.isArray(type) && type.length > 0 && type[0].constructor.type === 'ModelProperty') {
        type = type
          .map(item => item.toJSON())
          .sort((a, b) => a.id > b.id);
      } else if (Object.values(type).length > 0 && Object.values(type)[0].constructor.type === 'ModelProperty') {
        type = Object
          .values(type).map(item => item.toJSON())
          .sort((a, b) => a.id > b.id)
          .reduce((map, item) => ({...map, [item.name]: item}), {});
      }
    }
    return {
      id: this.workspaceId,
      modelId: this._model.workspaceId,
      facetName: 'server',
      name: this.name,
      'default': this.default_,
      type,
      format: this.format,
      required: this.required,
      index: this.index,
      description: this.description,
      lunchbadgerId: this.id,
      itemOrder: this.itemOrder,
    }
  }
}
