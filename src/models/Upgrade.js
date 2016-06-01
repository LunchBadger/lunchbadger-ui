const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Upgrade extends BaseModel {
  static type = 'Upgrade';

  constructor(id, fromPlan, toPlan, date, value) {
    super(id);

    this.fromPlanId = fromPlan;
    this.toPlanId = toPlan;
    this.date = date;
    this.value = value;
  }
  
  toJSON() {
    return {
      fromPlanId: this.fromPlanId,
      toPlanId: this.toPlanId,
      date: this.date,
      value: this.value
    }
  }
}
