const BaseModel = LunchBadgerCore.models.BaseModel;

export const AND = 'and';
export const NOT = 'not';
export const OR = 'or';

export default class MetricPair extends BaseModel {
  static type = 'MetricPair';

  _metricOne = null;
  _metricTwo = null;
  _type = null;

  constructor(id, metricOne, metricTwo, type) {
    super(id);

    this.metricOne = metricOne;
    this.metricTwo = metricTwo;
    this.type = type;
  }

  toJSON() {
    return {
      id: this.id,
      metricOne: this.metricOne,
      metricTwo: this.metricTwo
    }
  }

  get metricOne() {
    return this._metricOne;
  }

  set metricOne(metric) {
    this._metricOne = metric;
  }

  get metricTwo() {
    return this._metricTwo;
  }

  set metricTwo(metric) {
    this._metricTwo = metric;
  }

  get type() {
    return this._type;
  }

  set type(type) {
    this._type = type;
  }
}
