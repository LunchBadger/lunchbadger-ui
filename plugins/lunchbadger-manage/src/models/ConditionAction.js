import Condition from './Condition';
import Action from './Action';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ConditionAction extends BaseModel {
  static type = 'ConditionAction';

  _condition = {};
  _action = {};

  static create(data) {
    return super.create({
      ...data,
      condition: Condition.create(data.condition),
      action: Action.create(data.action),
    });
  }

  toJSON() {
    return {
      id: this.id,
      condition: this.condition.toJSON(),
      action: this.action.toJSON(),
    };
  }

  toApiJSON() {
    const condition = this.condition.parameters.length > 0
      ? this.condition.toJSON()
      : undefined;

    return {
      condition: condition,
      action: this.action.toJSON(),
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
