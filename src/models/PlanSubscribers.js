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
}
