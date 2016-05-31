const BaseModel = LunchBadgerCore.models.BaseModel;

export default class PlanParameters extends BaseModel {
  static type = 'PlanParameters';
  
  iterableKeys = [
    'callsPerSubscriber', 
    'cashPerCall'
  ];
  
  construct(callsPerSubscriber, cashPerCall) {
    this.callsPerSubscriber = callsPerSubscriber || 0;
    this.cashPerCall = cashPerCall || 0;
  }
}
