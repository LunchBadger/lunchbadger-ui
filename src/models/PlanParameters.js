const BaseModel = LunchBadgerCore.models.BaseModel;

export default class PlanParameters extends BaseModel {
  static type = 'PlanParameters';

  construct(callsPerSubscriber, cashPerCall) {
    this.callsPerSubscriber = callsPerSubscriber || 0;
    this.cashPerCall = cashPerCall || 0;
  }

  upgrade(scaleFactor) {
    this.callsPerSubscriber = Math.round(this.callsPerSubscriber * scaleFactor);
    this.cashPerCall = this.cashPerCall * scaleFactor;
  }

  toJSON() {
    return {
      callsPerSubscriber: this.callsPerSubscriber,
      cashPerCall: this.cashPerCall
    }
  }
}
