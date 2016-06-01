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

  upgrade(scaleFactor) {
    this.existing = Math.round(this.existing * scaleFactor);
    this.new = Math.round(this.new * scaleFactor);
    this.upgrades = Math.round(this.upgrades * scaleFactor);
    this.downgrades = Math.round(this.downgrades * scaleFactor);
    this.churn = Math.round(this.churn * scaleFactor);
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
