const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Parameter extends BaseModel {
  static type = 'Parameter';

  toJSON() {
    return {
      [this.name]: this.value,
    };
  }
}
