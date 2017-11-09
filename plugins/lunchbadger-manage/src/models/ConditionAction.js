import uuid from 'uuid';
import Action from './Action';
import Condition from './Condition';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ConditionAction extends BaseModel {
  static type = 'ConditionAction';

  _condition = {};
  _action = {};

  static create(data) {
    return super.create({
      ...data,
      // condition: {
      //   ...data.condition,
      //   id: (data.condition || {id: uuid.v4()}).id,
      // },
      condition: Condition.create(data.condition),
      action: Action.create(data.action),
    });
  }

  toJSON() {
    return {
      id: this.id,
      // condition: this.condition,
      condition: this.condition.toJSON(),
      action: this.action.toJSON(),
    };
  }

  toApiJSON() {
    return {
      // condition: this.condition,
      condition: this.condition.toJSON(),
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
