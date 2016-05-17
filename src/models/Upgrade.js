const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Upgrade extends BaseModel {
  static type = 'Upgrade';

  constructor(id, name, value, percentage) {
    super(id);

    this.name = name;
    this.value = value;
    this.percentage = percentage;
  }
}
