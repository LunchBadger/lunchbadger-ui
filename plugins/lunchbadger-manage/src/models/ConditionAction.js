const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ConditionAction extends BaseModel {
  static type = 'ConditionAction';

  _condition = {};
  _action = {};

  static create(data) {
    return super.create({
      ...data,
      condition: data.condition || {},
      action: data.action || {},
    });
  }

  toJSON() {
    return {
      id: this.id,
      condition: this.condition,
      action: this.action,
    };
  }

  toApiJSON() {
    return {
      condition: this.condition,
      action: this.action,
    };
  }

  set condition(condition){
    this._condition = condition;
  }

  get condition() {
    return this._condition;
  }

  set action(action){
    this._action = action;
  }

  get action() {
    return this._action;
  }
}
