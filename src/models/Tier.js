const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Tier extends BaseModel {
  static type = 'Tier';

  constructor(id, name, totals, charge) {
    super(id);

    this.name = name;
    this.totals = totals;
    this.charge = charge;
  }
}
