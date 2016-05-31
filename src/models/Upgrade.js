const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Upgrade extends BaseModel {
  static type = 'Upgrade';

  constructor(id, fromPlan, toPlan, value) {
    super(id);

    this.fromPlan = fromPlan;
    this.toPlan = toPlan;
    this.value = value;
  }
}
