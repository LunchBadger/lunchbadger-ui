import _ from 'lodash';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class MetricFunction extends BaseModel {
  static type = 'MetricFunction';

  constructor(id) {
    super(id);
  }

  recreate() {
    return MetricFunction.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      left: this.left,
      top: this.top,
    }
  }

  get metrics() {
    return this._pairs.reduce((metrics, pair) => {
      if (pair.metrics.length > 0) return metrics.concat(pair.metrics);
      return metrics;
    }, []);
  }

}
