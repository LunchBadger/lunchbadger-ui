const BaseModel = LunchBadgerCore.models.BaseModel;

export default class PlanSubscribers extends BaseModel {
  static type = 'PlanSubscribers';

  construct(existingUsers, newUsers, upgrades, downgrades, churn) {
    this.existing = existingUsers || 0;
    this.new = newUsers || 0;
    this.upgrades = upgrades || 0;
    this.downgrades = downgrades || 0;
    this.churn = churn || 0;
  }

  forecast(scaleFactor = 1) {
    // existing users should be net value from previous month
    this.existing = Math.round(this.sum * scaleFactor);

    // reset other predictions...
    this.new = 0;
    this.upgrades = 0;
    this.downgrades = 0;
    this.churn = 0;
  }

  toJSON() {
    return {
      existing: this.existing,
      new: this.new,
      upgrades: this.upgrades,
      downgrades: this.downgrades,
      churn: this.churn
    }
  }

  get sum() {
    return this.existing + this.new + this.upgrades - this.downgrades - this.churn;
  }
}
