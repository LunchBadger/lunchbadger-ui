const BaseModel = LunchBadgerCore.models.BaseModel;

export default class PlanParameters extends BaseModel {
  construct(callsPerSubscriber, cashPerCall) {
    this.callsPerSubscriber = callsPerSubscriber || 0;
    this.cashPerCall = cashPerCall || 0;
  }
}
