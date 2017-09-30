import ConditionAction from './ConditionAction';
import GATEWAY_POLICIES from '../utils/gatewayPolicies';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Policy extends BaseModel {
  static type = 'Policy';

  _conditionAction = [];

  constructor(id, name) {
    super(id);
    this.name = name;
  }

  static create(data) {
    let id = undefined;
    let name = undefined;
    Object.keys(data).forEach((key) => {
      if (key === 'id') id = data[key];
      if (key !== 'id') name = key;
    });
    return super.create({
      id,
      name,
      conditionAction: (data[name] || []).map(conditionAction => ConditionAction.create(conditionAction)),
    });
  }

  toJSON() {
    return {
      id: this.id,
      [this.name]: this.conditionAction.map(conditionAction => conditionAction.toJSON()),
    }
  }

  toApiJSON(serviceEndpoints) {
    const json = {
      id: this.id,
      [this.name]: this.conditionAction.map(conditionAction => conditionAction.toJSON()),
    };
    const proxy = GATEWAY_POLICIES.PROXY;
    if (serviceEndpoints.length > 0 && !!json[proxy]) {
      serviceEndpoints.forEach((serviceEndpoint, idx) => {
        if (!json[proxy][idx]) {
          json[proxy].push({action: {}});
        }
        json[proxy][idx].action.serviceEndpoint = serviceEndpoint;
      });
    }
    return json;
  }

  set conditionAction(conditionAction) {
    this._conditionAction = conditionAction;
  }

  get conditionAction() {
    return this._conditionAction;
  }

  addConditionAction(conditionAction) {
    this._conditionAction.push(conditionAction);
  }

}
