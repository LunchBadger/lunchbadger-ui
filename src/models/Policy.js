const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Policy extends BaseModel {
  static type = 'Policy';

  constructor(id, name) {
    super(id);

    this.name = name;
  }
}
