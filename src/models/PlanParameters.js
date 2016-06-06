const BaseModel = LunchBadgerCore.models.BaseModel;

export default class PlanParameters extends BaseModel {
  static type = 'PlanParameters';

  construct(callsPerSubscriber, cashPerCall) {
    this.callsPerSubscriber = callsPerSubscriber || 0;
    this.cashPerCall = cashPerCall || 0;
  }

  toJSON() {
    return {
      callsPerSubscriber: this.callsPerSubscriber,
      cashPerCall: this.cashPerCall
    }
  }
}
