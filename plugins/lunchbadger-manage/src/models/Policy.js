import _ from 'lodash';
import ConditionAction from './ConditionAction';

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
      if (key === 'id') {
        id = data[key];
      } else {
        name = key;
      }
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
    };
  }

  toModelJSON() {
    return {
      id: this.id,
      name: this.name,
      pairs: this.conditionAction.map(conditionAction => conditionAction.toJSON()),
    };
  }

  toApiJSON() {
    const json = {
      [this.name]: this.conditionAction.map(conditionAction => conditionAction.toApiJSON()),
    };
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

  removeConditionActionByServiceEndpoint(serviceEndpoint) {
    this._conditionAction = this._conditionAction.filter(pair =>
      !(pair.action.serviceEndpoint && pair.action.serviceEndpoint === serviceEndpoint)
    );
  }

  renameServiceEndpointInConditionAction(oldServiceEndpoint, newServiceEndpoint) {
    this._conditionAction = this._conditionAction.map(ca => _.cloneDeep(ca));
    this._conditionAction.forEach((ca) => {
      if (ca.action && ca.action.serviceEndpoint && ca.action.serviceEndpoint === oldServiceEndpoint) {
        ca.action.serviceEndpoint = newServiceEndpoint;
      }
    });
  }

  hasConditionActionWithServiceEndpoint(serviceEndpoint) {
    return this._conditionAction.find(({action}) => action.serviceEndpoint === serviceEndpoint);
  }

}
