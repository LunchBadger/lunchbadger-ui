const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Policy extends BaseModel {
  static type = 'Policy';

  constructor(id, name, type) {
    super(id);

    this.name = name;
    this.type = type;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type
    }
  }
}
