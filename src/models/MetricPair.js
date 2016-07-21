import {APPS, USERS, REQUESTS, PORTALS} from './MetricDetail';

const BaseModel = LunchBadgerCore.models.BaseModel;

export const AND = 'and';
export const NOT = 'not';
export const OR = 'or';

export default class MetricPair extends BaseModel {
  static type = 'MetricPair';

  _metricOne = null;
  _metricTwo = null;
  _type = null;

  constructor(id, metricOne, metricTwo, type = OR) {
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

  get metrics() {
    const metrics = [];

    this.metricOne && metrics.push(this.metricOne);
    this.metricTwo && metrics.push(this.metricTwo);

    return metrics;
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

  summarizePairDetails() {
    const summary = {
      [APPS]: 0,
      [USERS]: 0,
      [REQUESTS]: 0,
      [PORTALS]: 0
    };

    Object.keys(summary).forEach((key) => {
      this.metrics.forEach(metric => {
        const metricDetailsValue = metric.getDetail(key).value;

        if (this.metrics.length > 1) {
          if (this.type === AND) {
            return summary[key] += parseInt(0.25 * metricDetailsValue, 10);
          } else if (this.type === NOT) {
            return summary[key] += parseInt(0.75 * metricDetailsValue, 10);
          }
        }

        summary[key] += metricDetailsValue;
      });
    });

    return summary;
  }
}
