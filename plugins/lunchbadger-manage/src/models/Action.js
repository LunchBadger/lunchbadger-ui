import Parameter from './Parameter';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Action extends BaseModel {
  static type = 'Action';

  _parameters = [];

  static create(data = {}) {
    return super.create({
      parameters: (Object.keys(data)).map(name => Parameter.create({name, value: data[name]})),
    });
  }

  toJSON() {
    return this.parameters.reduce((result, item) => result = {...result, ...item.toJSON()}, {});
  }

  set parameters(parameters){
    this._parameters = parameters;
  }

  get parameters() {
    return this._parameters;
  }

  addParameter(parameter) {
    this._parameters.push(parameter);
  }

}
